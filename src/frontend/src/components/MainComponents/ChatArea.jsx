import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { sendMessage } from "../../utils/DataFetch";


export default function ChatArea(props) {

  const addToConversation = async () => {
    // const chatContentArea = document.getElementById("chatContent");
    const message = document.getElementById("outlined-multiline-flexible").value

    const response = await sendMessage(props.email,message)

    if(response.success){
      document.getElementById("outlined-multiline-flexible").value = ""
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
              />
              <Button style={{ backgroundColor: "green", color: "white" }}
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
