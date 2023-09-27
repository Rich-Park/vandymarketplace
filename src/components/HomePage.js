import { Box, Heading, Container, Text, Button, Stack, InputGroup, InputRightElement } from "@chakra-ui/react";
import {
  Flex,
  Input,
  Spacer,
  ChakraProvider,
  extendTheme,
  Image
} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
//import { SearchIcon } from "@chakra-ui/icons";
import Header from "./Header";
import { AllSellItemsImageLoader } from '../firebaseFunctions/dataload';
import ImageGallery from "./ImageGallery";


export default function HomePage() {

  const navigate = useNavigate();

  useEffect(() => {

    // Observe auth state to redirect to login/home page
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const userIdRef = doc(db, "userIDMap", userEmail);
        const docSnap = await getDoc(userIdRef);
    
        if (docSnap.exists()) {
        } else {
          console.error("Could not find document.");
        }
      } else {
        console.log("redirect");
        navigate("/log-in");
      }
    });
    
  }, [auth]);  

  return (
    <>
      <Header/>
      <ImageGallery/>
    </>
  );
}
