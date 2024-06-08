import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();


// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
} // to be able to consume auth values, we have made this hook

// here we will provide some values that we can use throughout the application
export const AuthContextProvider = ({children}) => {
    const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user"))|| null)


    // we will wrap our application with this authcontext.provider so that our app is able to use this values

    // children is our app (see in main.jsx) and we have wrapped it with the two values, and these two values can be used anywhere in app
    return <AuthContext.Provider value={{authUser,setAuthUser}} >
        {children}
    </AuthContext.Provider>;
}