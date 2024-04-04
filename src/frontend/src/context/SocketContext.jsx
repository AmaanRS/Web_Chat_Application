import { createContext } from 'react';
import socketIO from 'socket.io-client';
import { getToken } from '../utils/Auth';
const socket = socketIO.connect(import.meta.env.VITE_SOCKET_ORIGIN);

const SocketContext = createContext()

const SocketProvider = async ({children})=>{
    const token = await getToken()

    socket.on("connect",()=>{
        console.log("WebSocket connected successfully")
        socket.emit('authentication', {
            token: token
          });
    })

    //Implement sendMessage and onMessageRec functions here and chnage the logic of sending,receiving and displaying message

    //Check this
    const sendMessageTo = (message,to)=>{
        socket.emit("event:send_message",{message:message,to:to})
    }

    //SocketAuth emits an unauthorized event if the user is unauthorized which is listened to here
    socket.on('unauthorized', (reason) => {
        console.log('Unauthorized:', reason);
    
        error = reason.message;
    
        socket.disconnect();
    });
    

    return(
        // <SocketContext.Provider value={{ sendMessageTo, onMessageRec }}>
        <SocketContext.Provider value={{ sendMessageTo }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider