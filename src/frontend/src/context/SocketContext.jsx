import { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getToken } from '../utils/Auth';
const socket = io(import.meta.env.VITE_SOCKET_ORIGIN);

const SocketContext = createContext()

const SocketProvider = ({children})=>{
    try {

    let error = null
    

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

    useEffect(()=>{
        (async function c() {

            const token = await getToken()
            console.log(token)
            
            socket.on("connect",()=>{
            console.log("WebSocket connected successfully")
            socket.emit('authentication', {
                token: token
            });
        })
    })()
    },[])
    

    return(
        // Add socket variable as value in provider and then use it in sending token in Auth.js logout function instead of sending a post request since post request is getting stalled due to socket running on server
        
        // <SocketContext.Provider value={{ sendMessageTo, onMessageRec }}>
        <SocketContext.Provider value={{  }}>
            {children}
        </SocketContext.Provider>
    )
        
    } catch (error) {
        console.error("Error in SocketProvider:", error);
        return null;
    }
    
}

export default SocketProvider