import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function ChatArea(props) {

    const addToConversation = ()=>{
        let data = document.getElementById("outlined-multiline-flexible").value
        
        //Call a api to save the data as a conversation

        //Show a the data in the #chatContent with div
    }

    console.log(props.conversation)


  return (
    <>
      Chat area
      {props.email}
      <div id="chatArea" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "500px" }} id="chatContent"></div>
        <div>
          <TextField id="outlined-multiline-flexible" maxRows={4} style={{width:"800px"}} />
          <Button onClick={addToConversation} style={{backgroundColor:"green", color:"white"}}>Send</Button>
        </div>
      </div>
    </>
  );
}
