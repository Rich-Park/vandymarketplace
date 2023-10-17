import { Box, Button, Image, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function MyPage() {
    const navigate = useNavigate();
    let userDisplayName = "";
    let userPhotoURL = "";
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userDisplayName = user.displayName;
        userPhotoURL = user.photoURL;
      }
    });
  
    return (
        <div>
            <Header />
            <Box textAlign={"center"} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
        <Image src={userPhotoURL} boxSize="150px" m="auto" borderRadius="full" />
        <Text fontSize="xl" fontWeight="bold" mt={5}>{userDisplayName}</Text>
  
        <Button 
          mt={5}
          colorScheme="blue" 
          onClick={() => navigate("/manage-uploaded-items")}>
          Manage Uploaded Items
        </Button>
        <Button 
          mt={5} 
          ml={3}
          colorScheme="teal" 
          onClick={() => navigate("/favorited-items")}>
          Favorited Items
        </Button>
      </Box>
        </div>
      
    );
  }
  