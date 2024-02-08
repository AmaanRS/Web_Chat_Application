import React, { useState,useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { getAllUsersEmail } from '../utils/DataFetch';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '50ch',
        },
    }
}));

const PrimarySearchAppBar = () => {
    const [allEmails,setAllEmails] = useState([])
    const [filteredResults,setFilteredResults] = useState([])
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(()=>{
        if(allEmails.length != 0){
            let updatedFilteredResults = []
            
            for(let i = 0;i<allEmails.length;i++){
                if(allEmails[i].includes(searchTerm)){
                    updatedFilteredResults.push(allEmails[i])
                }
            }
            setFilteredResults(updatedFilteredResults);
        }
    },[allEmails,searchTerm])

    const searchEmail = async (e) => {

        setSearchTerm(e.target.value)

        const getEmails = await getAllUsersEmail()

        setAllEmails(getEmails.listOfAllEmails)
        
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchEmail(e);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ width: '100%' }}>
                <Toolbar sx={{ width: '80%' }}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <List>

                {/* FilteredList is printing a string and i want it to be an array so i can map over it */}
                {/* {filteredResults.map((result, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={result.label} />
                    </ListItem>
                ))} */}
            </List>
        </Box>
    );
};

// Dummy data for demonstration
const countries = [
    { code: 'AD', label: 'Andorra' },
    { code: 'AE', label: 'United Arab Emirates' },
    // ... (other countries)
];

export default PrimarySearchAppBar