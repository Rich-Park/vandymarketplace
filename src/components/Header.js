import React from 'react';
import {logout} from "../authentication/logout";
import {
  Box,
  Flex,
  Text,
  Button,
  Avatar,
  Spacer,
  ChakraProvider,
  extendTheme,
  CSSReset,
  ThemeProvider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const Header = () => {
 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Observe auth state to redirect to login/home page

    async function load(){
      const delay1 = ms => new Promise(res => setTimeout(res, ms));
      await delay1(1000);
      setUserImage(auth.currentUser?.photoURL)
    }
    load();
    

  }, []);  
  //const userProfileImageUrl = auth.currentUser?.photoURL;

  return (
        <Flex
          p={4}
          alignItems="center"
          justifyContent="space-between"
          bg="brand.200"
          color="brand.100"
        >
          <Box fontSize="2xl" fontWeight="bold">
            Vandy Market
          </Box>
          <Flex alignItems="center">
            
            <Box position="relative">
              <Menu>
                <MenuButton as={Box} p={2} cursor="pointer">
                  <Image
                    src= {userImage}  // Replace with the URL of your image
                    width="30px"
                    height="30px"
                    borderRadius="50%"
                  />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/")}>
                Home
              </MenuItem>
              <MenuItem onClick={() => navigate("/my-page")}>
                My Page
              </MenuItem>
              <MenuItem onClick={() => navigate("/sell-item")}>
                Sell Item Form
              </MenuItem> 
                  
                </MenuList>
              </Menu>
            </Box>
            
          </Flex>
        </Flex>

  );
}

export default Header;