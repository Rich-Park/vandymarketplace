import React from 'react';
import {logout} from "../authentication/logout";
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image
} from '@chakra-ui/react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import 'firebase/auth';
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";



const Header = () => {
 
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(auth.currentUser ? auth.currentUser.photoURL : null);


  useEffect(() => {
    // Observe auth state to redirect to login/home page

    async function load(){
      const delay1 = ms => new Promise(res => setTimeout(res, ms));
      await delay1(10000);
      if(auth.currentUser){
        console.log('user is logged in');
      }
      setUserImage(auth.currentUser?.photoURL)
    }
    load();
    console.log(userImage);
    

  }, [auth]);  
  //const userProfileImageUrl = auth.currentUser?.photoURL;

  const handleLogout = async () => {
    try {
      logout(); // Call the logout function to sign the user out
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
        <Flex
          p={4}
          alignItems="center"
          justifyContent="space-between"
          bg="brand.200"
          color="brand.100"
        >
          <Link to="/"> {/* Replace "/" with the path to your home page */}
            <Box fontSize="2xl" fontWeight="bold" as="button">
              Vandy Market
            </Box>
          </Link>
          <Flex alignItems="center">
            
              <Button
                    as={Link}
                    bg={"brand.400"}
                    color={"black"}
                    to="/sell-item"
                    borderRadius="full"
                    boxShadow="md"
                    width={120}
                    _hover={{
                      bg: "brand.500",
                      boxShadow: "lg",
                    }}
                    ml={"1rem"}
                    
                  >
                Sell Item
              </Button>

            <Box position="relative">

              <Menu>
                <MenuButton as={Box} p={2} cursor="pointer">
                  <Image
                    src = {userImage}  // Replace with the URL of your image
                    width="30px"
                    height="30px"
                    borderRadius="50%"
                  />
               </MenuButton>

              <MenuList>
                <MenuItem onClick={() => navigate("/")}>
                  Home
                </MenuItem>
              <MenuItem onClick={() => navigate("/favorites")}>
                Favorites
              </MenuItem>
              <MenuItem onClick={() => navigate("/my-items")}>
                My Items
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>    
              </MenuList>

              </Menu>

            </Box>
            
          </Flex>
        </Flex>

  );
}

export default Header;