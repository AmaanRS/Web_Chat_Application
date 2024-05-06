import React, { createContext, useContext,useState } from 'react'

const ConvContext = createContext()

export const useConv = ()=>{
    const state = useContext(ConvContext)

    if (!state) throw new Error(`state is undefined`);
  
    return state;
}

export default function ConvProvider({children}) {
    try {
        const [ convContent, setConvContent ] = useState([])

        return (
            <ConvContext.Provider value={{ convContent,setConvContent}}>
                {children}
            </ConvContext.Provider>
          )

    } catch (error) {
        console.error("Error in ConvContext:", error);
        return <div>Error occurred in ConvProvider. Please try again.</div>;
    }
}
