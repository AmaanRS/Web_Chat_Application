import React from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';


function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton sx={{background:"white", border:"0.5px solid #808080"}}>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}



export default function MainPage() {
  return (
    <>
    <Container maxWidth="false" disableGutters>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
          <FixedSizeList
            height={640}
            width={450}
            itemSize={46}
            itemCount={20}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>

          </Grid>
          <Grid item xs={8}>
            Hoo
          </Grid>
        </Grid>
      </Box>
    </Container>
    </>
  )
}
