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
      const response = await sendMessageTo(message, props.Friendemail);

      // Update conversation state
      setConvContent((prevContent)=>[
        ...prevContent,
        { message:message, sender: props.SelfEmail, receiver: props.Friendemail }
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
      {props.Friendemail && (
        <>
          Chat area
          {props.Friendemail}
          <div
            id="chatArea"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: "500px" }} id="chatContent">
              {convContent?.map((e, index) => {
                return e.sender == props.SelfEmail ? (
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
