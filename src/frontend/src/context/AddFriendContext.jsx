import React, { createContext, useState,useContext } from "react";

const AddFriendContext = createContext();

export const useAddFriend = () => {
  const state = useContext(AddFriendContext);

  if (!state) throw new Error(`state is undefined`);

  return state;
};

export default function AddFriendProvider({ children }) {
  const [open, setOpen] = useState(false);

  try {
    return (
      <>
        <AddFriendContext.Provider value={{ open, setOpen }}>
          {children}
        </AddFriendContext.Provider>
      </>
    );
  } catch (error) {
    console.error("Error in AddFriendContext:", error);
    return <div>Error occurred in AddFriendContext. Please try again.</div>;
  }
}
