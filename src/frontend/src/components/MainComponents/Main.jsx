import React, { useEffect, useState } from 'react'
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
import ChatArea from './ChatArea';
import { getUserConversation } from "../../utils/DataFetch"
import SocketProvider from '../../context/SocketContext';
import { useConv } from '../../context/ConvContext';

export default function Main() {

  let {email,friends} = useLoaderData()

  //Which friend's chat is open for conversation
  var [ currentChat, setCurrentChat ] = useState(0)

  const { convContent,setConvContent} = useConv()

  useEffect(() => {
      openChat(0);
      console.log(convContent);
  }, []);
  

  const openChat = async (index)=>{
    try {
      const conv = await getUserConversation(friends[index]?.email)
      try {
        setConvContent(conv.conversation.map(JSON.parse))
      } catch (error) {
        setConvContent(conv.conversation)
      }
      console.log(conv.message)
      setCurrentChat(index)
    } catch (error) {
      console.log(error)
    }
      
  }

  //Function to render the list of friends
  function renderRow(props) {
    const { index, style } = props;

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
    <SocketProvider>
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
                <TitleBar email={friends[currentChat]?.email}/>
                  <ChatArea Friendemail={friends[currentChat]?.email}SelfEmail={email} conversation={convContent}/>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </SocketProvider>
    </>
  )
}