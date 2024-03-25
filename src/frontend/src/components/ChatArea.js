import React, { useEffect, useMemo } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "../static/style.css";

export default function ChatArea(props) {
  //Rather than this directly use react

  // useEffect(()=>{
  //   const addPreviousContentToChatArea = (()=>{
  //     if(props.conversation === undefined) return
  //     props.conversation.map((e)=>{
  //       let side = ""
  //       if(e.sender == "Self"){
  //         //The message should be on right
  //         side = "Right"
  //       }else{
  //         //The message should be on left
  //         side = "Left"
  //       }
  //       const new_div = document.createElement("div")
  //       new_div.innerText = e.message
  //       new_div.setAttribute("class",side)
  //       chatContentArea.appendChild(new_div)
  //     })
  //   })()
  // },[])

  const addToConversation = () => {
    const chatContentArea = document.getElementById("chatContent");

    // The message typed in the chat box should be displayed on screen and saved to database using an api call

  };

  console.log(props.conversation);

  return (
    <>
      Chat area
      {props.email}
      <div id="chatArea" style={{ display: "flex", flexDirection: "column" }}>
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
          <Button
            onClick={addToConversation}
            style={{ backgroundColor: "green", color: "white" }}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
