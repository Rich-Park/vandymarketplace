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
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const Header = () => {
  // Replace this with actual user information

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
            <Button
                  as={Link}
                  bg={"brand.200"}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          </Flex>
        </Flex>

  );
}

export default Header;

