import { createContext, useReducer } from 'react';

const AppReducer = (state, action) => {
    switch (action.type) {
        case 'Test':
            return {...state,};
        
        default:
            return state;
    }
}

const initialState = {
    //key: value
    //Same keys from below
};

export const AppContext = createContext();

export const AppProvider =(props)=> {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    console.log(process.env.REACT_APP_TEST);

    return (
        <AppContext.Provider 
            value = {{
                //key: value,
                dispatch,
            }}>
            {props.children}
            </AppContext.Provider>
    );
}