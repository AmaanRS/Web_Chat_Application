import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useSocket } from '../../context/SocketContext'
import { useConv } from "../../context/ConvContext";

export default function ChatArea(props) {
  const { sendMessageTo } = useSocket();
  const [message, setMessage] = useState("");
  const { convContent,setConvContent} = useConv()

  const addToConversation = async () => {
    try {

      // Send message and wait for response
      const response = await sendMessageTo(message, props.email);

      // Update conversation state
      setConvContent([
        ...convContent,
        { message:message, sender: "Self", receiver: "Friend" }
      ])

      // Clear input field
      setMessage("");

    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error if needed
      return <div>Error occurred in ConvProvider. Please try again.</div>;
    }
  };

  return (
    <>
      {props.email && (
        <>
          Chat area
          {props.email}
          <div
            id="chatArea"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: "500px" }} id="chatContent">
              {props.conversation?.map((e, index) => {
                return e.sender == "Self" ? (
                  <div
                    key={index}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {e.message}
                  </div>
                ) : (
                  <div
                    key={index}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    {e.message}
                  </div>
                );
              })}
            </div>
            <div>
            <TextField
                id="outlined-multiline-flexible"
                maxRows={4}
                style={{ width: "800px" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={addToConversation}
              >
                Send
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
