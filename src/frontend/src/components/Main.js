import React, { useEffect,useState } from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Grid, Paper } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import TitleBar from "./TitleBar"
import SelfTitleBar from "./SelfTitleBar"
import { useLoaderData } from 'react-router-dom';

export default function Main() {

  //Done setting email as current user's name in UI,rendering friends list is left
  let {email,friends} = useLoaderData()

  //If there are no friends then add a test friend(You can't start a conversation since it's for testing)
  if(friends.length == 0){
      friends.push({email:"TestBot@gmail.com"})
  }

  //Populate this using the content from database
  var [chatAreaContent,setChatAreaContent] = useState("")

  //Which friend's chat is open for conversation
  var [ currentChat, setCurrentChat ] = useState(0)

  //Used to add saved chat from database to the chat area, not to add data to the conversation 
  function addDataToChatArea(chatAreaContent){

    const newDiv = document.createElement("div")
    newDiv.innerHTML = chatAreaContent
    const chatArea = document.getElementById("chatArea")
    chatArea.innerHTML = ""
    chatArea.appendChild(newDiv)

  }

  useEffect(()=>{
    addDataToChatArea(chatAreaContent)
  },[chatAreaContent])

  //Function to render the list of friends
  function renderRow(props) {
    const { index, style } = props;

    const openChat = (index)=>{
      setCurrentChat(index)
      // console.log("openChat onClick works "+ (index+1))

      //Content of conversation between users
      setChatAreaContent(`${index+1}`)
    }

    // console.log(friends)
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton sx={{background:"white", border:"0.5px solid #808080"}} onClick={()=>openChat(index)}>

          {/* To display email on every list item */}
          <ListItemText primary={friends[index].email} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <>
    <Container maxWidth="false" disableGutters>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Paper elevation={0}>
              <SelfTitleBar email={email}/>
          <FixedSizeList
            height={575}
            width={455}
            itemSize={46}
            itemCount={friends.length}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
          </Paper>
          </Grid>
          <Grid item xs={8}>
            <Container disableGutters>
              <Box sx={{height:"100vh", overflowY:"scroll"}} >
                <TitleBar email={friends[currentChat].email}/>
                <div id='chatArea'>

                </div>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </>
  )
}
