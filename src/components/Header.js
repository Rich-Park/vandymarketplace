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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const userProfileImageUrl = auth.currentUser?.photoURL;

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
                  Menu
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Link to="/">Home</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/about">About</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/contact">Contact</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
            
          </Flex>
        </Flex>

  );
}

export default Header;