import React, { useEffect } from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Grid, Paper } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';



function renderRow(props) {
  const { index, style } = props;
  const displayChatArea = (index)=>{
    console.log("displayChatArea onClick works"+ (index+1))
  }

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton sx={{background:"white", border:"0.5px solid #808080"}} onClick={()=>displayChatArea(index)}>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}



export default function MainPage() {

  //Populate this using the content from database
  const chatAreaContent = "<b>Hiii lorem100</b>"
  
  function addDataToChatArea(chatAreaContent){
    const newDiv = document.createElement("div")
    newDiv.innerHTML = chatAreaContent
    const chatArea = document.getElementById("chatArea")
    chatArea.appendChild(newDiv)
  }

  useEffect(()=>{
    addDataToChatArea(chatAreaContent)
  },[chatAreaContent])


  return (
    <>
    <Container maxWidth="false" disableGutters>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Paper elevation={0}>
          <FixedSizeList
            height={640}
            width={455}
            itemSize={46}
            itemCount={10}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
          </Paper>
          </Grid>
          <Grid item xs={8}>
            <Container disableGutters>
              <Box sx={{height:"100vh", overflowY:"scroll"}} >
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
