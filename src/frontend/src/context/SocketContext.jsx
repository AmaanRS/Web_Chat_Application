import { createContext } from 'react';
import socketIO from 'socket.io-client';
const socket = socketIO.connect(import.meta.env.VITE_SOCKET_ORIGIN);

const SocketContext = createContext()

const SocketProvider = ({children})=>{

    //Implement sendMessage and onMessageRec functions here and chnage the logic of sending,receiving and displaying message

    return(
        // <SocketContext.Provider value={{ sendMessage, onMessageRec }}>
        <SocketContext.Provider value={{ }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider