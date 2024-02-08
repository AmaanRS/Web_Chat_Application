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

  if(friends.length == 0){
      friends.push("TestBot@gmail.com")
  }

  //Populate this using the content from database
  var [chatAreaContent,setChatAreaContent] = useState(friends[0])

  console.log(friends)

  var [indexx,setIndexx] = useState("Emptyyyyy")

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


  function renderRow(props) {
    const { index, style } = props;
    const displayChatArea = (index)=>{
      console.log("displayChatArea onClick works "+ (index+1))
      setIndexx(index+1)
      setChatAreaContent(`${index+1}`)
    }
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton sx={{background:"white", border:"0.5px solid #808080"}} onClick={()=>displayChatArea(index)}>
          <ListItemText primary={friends[index]} />
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
                <TitleBar name={indexx}/>
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
