import logo from './logo.svg';
import './App.css';
import { AppProvider } from './context/AppContext';
import Spotify from './components/Spotify';


function App() {
  return (
    <AppProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Spotify />
      </div>
    </AppProvider>
  );
}

export default App;
