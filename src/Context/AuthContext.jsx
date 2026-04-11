import { createContext, useState } from "react";

// Context To User Token
export const AuthContext = createContext();
export default function AuthContextProvider({ children }) {

    const [userToken, setUserToken] = useState(null);

    return <AuthContext.Provider value={{ userToken, setUserToken }}>
        {children}
    </AuthContext.Provider>
}