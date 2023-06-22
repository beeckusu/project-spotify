import { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { generateRandomString, sha256 } from '../Utils';


function Spotify() {
    const spotifyApi = new SpotifyWebApi();
    const [authenticated, setAuthenticated] = useState(false);
    console.log("Test Client ID: " + process.env.REACT_APP_SPOTIFY_CLIENT_ID);

    useEffect(() => {

        const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        console.log("Client ID: " + client_id);
        const redirect_uri = 'http://localhost:8080';

        const codeChallengeMethod = 'S256';
        const codeVerifier = generateRandomString(128);
        const codeChallenge = sha256(codeVerifier);

        const authEndpoint = 'https://accounts.spotify.com/authorize';
        const scopes = ['user-read-private', 'user-read-email'];
        const state = generateRandomString(16);
        
        const authUrl = `${authEndpoint}?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&code_challenge_method=${codeChallengeMethod}&code_challenge=${codeChallenge}&state=${state}&scope=${encodeURIComponent(scopes.join(' '))}`;        

        // Redirect to Spotify authorization page
        window.location.href = authUrl;

        // Handling authorization callback
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        const receivedState = urlParams.get('state');
        const storedState = sessionStorage.getItem('spotify_auth_state');


        if (authorizationCode && (receivedState === storedState)) {
            // Code exchange
            const tokenEndpoint = 'https://accounts.spotify.com/api/token';
            const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

            const tokenOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: authorizationCode,
                    redirect_uri,
                    code_verifier: codeVerifier
                })
            };

            fetch(tokenEndpoint, tokenOptions)
                .then(response => response.json())
                .then(data => {
                    const { access_token, refresh_token, expires_in } = data;

                    // Store access token and refresh_token securely
                    setAuthenticated(true);

                    // Set access_token for SpotifyWebApi instance
                    spotifyApi.setAccessToken(access_token);
                })
                .catch(error => {
                    // Error handling
                    console.log("Error exchanging authorizaation code for access token: ", error);
                });
                

        } else {
            // Error handling
            console.log("Error authorizing with Spotify");
        }

    }, []);

    if (!authenticated) {
        return <div>Redirecting to Spotify Authorization page...</div>;
    }
    else {
        return <div>Authenticated with Spotify!</div>;
    }
}

export default Spotify;