import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getToken, logoutUsingCookies } from "../utils/Auth";
import { useConv } from "./ConvContext";

const SocketContext = createContext();

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

let socketInstance = null;

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { convContent, setConvContent } = useConv();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSocket = async () => {
      try {

        const token = await getToken();
        console.log(token);

        console.log("Socket connection request sent from client");

        const newSocket = io(import.meta.env.VITE_SOCKET_ORIGIN,{
          auth:{
            token : token
          }
        });

        newSocket.on("connect", () => {
          console.log("WebSocket connected successfully");
          // newSocket.emit("authentication", {
          //   token: token,
          // });
        });

        newSocket.on("event:onMessageRec", (data) => {
          console.log(data);
          setConvContent((prevContent) => [
            ...prevContent,
            {
              message: data.message,
              sender: data.sender,
              receiver: data.receiver,
            },
          ]);
        });

        // newSocket.on("unauthorized", (reason) => {
        //   console.log("Unauthorized:", reason);
        //   newSocket.disconnect();
        //   logoutUsingCookies();
        //   navigate("/", { replace: true });
        // });

        newSocket.on("connect_error",(error)=>{
          console.log(error)
          logoutUsingCookies();
          navigate("/", { replace: true });
        })


        setSocket(newSocket);
        socketInstance = newSocket;
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initializeSocket();

    // Clean up
    return () => {
      if (socket) {
        console.log("Cleaning up socket");
        socket.removeAllListeners();
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  if (!socket) {
    return null; // or return a loading indicator
  }

  const sendMessageTo = (message, to) => {
    socket.emit("event:send_message", { message: message, to: to });
  };

  return (
    <SocketContext.Provider value={{ sendMessageTo }}>
      {children}
    </SocketContext.Provider>
  );
};

//Export the socket variable as a function
export const getSocket = () => {
  if (!socketInstance) {
    throw new Error("Socket is not initialized");
  }
  return socketInstance;
};

export default SocketProvider;
