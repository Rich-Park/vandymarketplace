import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React from 'react';

export default function LogInPage() {
  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Successfully logged out.");
      })
      .catch((error) => {
        console.error(error.code);
      });
  };

  const handleLogIn = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        if (!user.email.endsWith("@vanderbilt.edu")) {
          //logOut();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    onAuthStateChanged(auth, async (user) => {
      //make sure user is a Vanderbilt user
      if (user){   //&& user.email.endsWith("@vanderbilt.edu")) {
        console.log("auth changed");
        const userEmail = user.email;
        const userIdRef = doc(db, "userIDMap", userEmail);
        let docSnap = await getDoc(userIdRef);

        if (!docSnap.exists()) {
          let newId = user.email.substring(0, user.email.indexOf("@"));
          newId = newId.replace(/[^a-zA-Z ]/g, "");
          await setDoc(doc(db, "userIDMap", user.email), {
            userId: newId,
          });

          docSnap = await getDoc(userIdRef);
        }
        let id = docSnap.data().userId;
        const userDataRef = doc(db, "users", id);
        const userDataSnap = await getDoc(userDataRef);

        if (!userDataSnap.exists()) {
          await setDoc(doc(db, "users", id), {
            likedItems: [],
          });
        }
      }
      navigate("/");
    });
  };

  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
            color={"brand.200"}
          >
            Vanderbilt <br />
            <Text as={"span"} color={"brand.100"}>
              Marketplace
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Buy and sell items with other Vanderbilt students. Post your items,
            browse for items, and get in contact to find the perfect price!
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              bg={"brand.200"}
              color={"black"}
              borderRadius="full"
              boxShadow="md"
              width={120}
              _hover={{
                bg: "brand.500",
                boxShadow: "lg",
              }}
              data-testid="LogIn"
              onClick={handleLogIn}
            >
              Log In
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
