import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function ChatArea(props) {

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
            style={{ backgroundColor: "green", color: "white" }}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
