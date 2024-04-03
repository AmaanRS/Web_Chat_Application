import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

//Tried to create a global email so that user can use more than one account on different tabs in th same browser, but failed
// let globalEmail;

const AuthProvider = ({ children }) => {
    const [email, setEmail] = useState(null);

    // Function to update email
    const updateEmail = (newEmail) => {
        setEmail(newEmail);
    };

    // useEffect(()=>{
    //     // Function to set global email
    //     const setGlobalEmail = (() => {
    //         globalEmail = email;
    //     })()
    // },[email])

    return (
        <AuthContext.Provider value={{ email, updateEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};

// export const getGlobalEmail = () => {
//     return globalEmail;
// };
