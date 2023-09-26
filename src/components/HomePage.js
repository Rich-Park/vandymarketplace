import { Box, Heading, Container, Text, Button, Stack, InputGroup, InputRightElement } from "@chakra-ui/react";
import {
  Flex,
  Input,
  Spacer,
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
//import { SearchIcon } from "@chakra-ui/icons";
import Header from "./Header";


export default function HomePage() {

  const navigate = useNavigate();

  useEffect(() => {
    // Observe auth state to redirect to login/home page
    onAuthStateChanged(auth, async (user) => {
      console.log("check auth");
      if (user) {
        console.log("user auth");
        navigate("/");
        const userEmail = user.email;
        const userIdRef = doc(db, "userIdMap", userEmail);
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

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header/>

      <InputGroup>
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
 

    </>
  );
}
