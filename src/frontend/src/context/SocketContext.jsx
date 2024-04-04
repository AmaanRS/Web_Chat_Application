import { createContext } from 'react';
import socketIO from 'socket.io-client';
const socket = socketIO.connect(import.meta.env.VITE_SOCKET_ORIGIN);

const SocketContext = createContext()

const SocketProvider = ({children})=>{

    //Implement sendMessage and onMessageRec functions here and chnage the logic of sending,receiving and displaying message

    //Check this
    const sendMessageTo = (message,to)=>{
        socket.emit("event:send_message",{message:message,to:to})
    }

    return(
        // <SocketContext.Provider value={{ sendMessageTo, onMessageRec }}>
        <SocketContext.Provider value={{ sendMessageTo }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider