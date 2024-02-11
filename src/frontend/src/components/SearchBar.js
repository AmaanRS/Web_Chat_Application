import React, { useState,useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { getAllUsersEmail } from '../utils/DataFetch';
import { ListItemButton } from '@mui/material';
import {addFriendBothWays} from '../utils/AddFriendBothWays'
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate()

    useEffect(()=>{
        try {
            (async function getAllUsersEmailFunc(){
                const getEmails = await getAllUsersEmail()
                setAllEmails(getEmails.listOfAllEmails)
            })()
        } catch (error) {
            console.log(error)
        }
    },[])

    // Changed the getUserData endpoint so now the below mentioned bug is fixable

    // useEffect(()=>{
    //     try {
    //         const AlreadyFriendsFunc =( async ()=>{
    //             const token = await getToken()

    //             if(!token){
    //                 console.log("User is not Authenticated")
    //             }

    //             const ORIGIN = process.env.REACT_APP_ORIGIN
    //             const response = await axios.post(`${ORIGIN}/getUserData`,{},
    //             {
    //                 headers:{"Authorization":`Bearer ${token}`}
    //             })

    //             if(!response){
    //                 console.log("There is some problem while fetching the data")
    //             }
    //             if(!response.data.success){
    //                 console.log(response.data.message)
    //             }
    //             if(!response.data.friends){
    //                 console.log("There is some problem while fetching the data")
    //             }
    //             console.log(response.data.friends)

    //         })()
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },[])

    //There is a bug in this that user's own email as well as other users who are already friends with current user are also displayed in the list
    //I wrote a function to remove those names above, but the function return array of Mongodb's ObjectId on the other hand the filter condition below is based on emails
    //But this is validated in Backend to prevent duplicate or self adding of friends in the friend's array
    useEffect(()=>{
        //If the array is not empty and the search term is not empty
        if(allEmails.length != 0 && searchTerm != ""){
            let updatedFilteredResults = []
            
            //Push all the emails to the array
            for(let i = 0;i<allEmails.length;i++){
                if(allEmails[i].includes(searchTerm)){
                    updatedFilteredResults.push(allEmails[i])
                }
            }
            setFilteredResults(updatedFilteredResults);
        }else{
            setFilteredResults([]);
        }
    },[searchTerm])

    const handleSearchKeyDown = (e) => {
        //On press of Enter key
        if (e.key === 'Enter') {
            setSearchTerm(e.target.value)        
        }
    };

    const addedFriend = async (friendEmail) =>{
        try {
            const isAdded = await addFriendBothWays(friendEmail)
            console.log(isAdded.message)
            if(isAdded.success){
                return navigate("/main")
            }
        } catch (error) {
            console.log(error)
            return {message:"The friend could not be added",success:false}
        }
        
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ width: '100%' }}>
                <Toolbar sx={{ width: '80%' }}>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…and Press Enter"
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <List>
                {filteredResults.map((result, index) => (
                    <ListItem key={index}>
                        <ListItemButton onClick={()=>addedFriend(result)}>
                            <ListItemText primary={result}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default PrimarySearchAppBar