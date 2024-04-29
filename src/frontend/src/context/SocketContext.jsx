import { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getToken } from '../utils/Auth';
const socket = io(import.meta.env.VITE_SOCKET_ORIGIN);

const SocketContext = createContext()

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error(`state is undefined`);
  
    return state;
  };

const SocketProvider = ({children})=>{
    try {

    let error = null
    

    //Implement sendMessage and onMessageRec functions here and chnage the logic of sending,receiving and displaying message

    //Check this
    const sendMessageTo = (message,to)=>{
        socket.emit("event:send_message",{message:message,to:to})
    }

    socket.on("event:onMessageRec",(message)=>{
        console.log(message)
    })


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
        // <SocketContext.Provider value={{ sendMessageTo, onMessageRec }}>
        <SocketContext.Provider value={{ sendMessageTo }}>
            {children}
        </SocketContext.Provider>
    )
        
    } catch (error) {
        console.error("Error in SocketProvider:", error);
        return null;
    }
    
}

//Export the socket variable as a function
export const getSocket = () => socket;

export default SocketProvider