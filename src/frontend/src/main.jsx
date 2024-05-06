import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import ConvProvider from "./context/ConvContext";
import AddFriendProvider from "./context/AddFriendContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <ConvProvider>
      <AddFriendProvider>
        <App />
      </AddFriendProvider>
    </ConvProvider>
  </AuthProvider>
  // </React.StrictMode>
);
