import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Textarea,
  InputGroup,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import { storeItemsSell } from "../firebaseFunctions/firebaseWrite";
import { useNavigate } from "react-router-dom";
import { getUserID } from "../firebaseFunctions/dataload";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

async function rateLimitFormSubmissions(userId) {
  const itemsCollectionRef = collection(db, "users", userId, "ItemsToSell");
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1); // Calculate 1 hour ago
  const oneHourAgoTimestamp = Timestamp.fromDate(oneHourAgo);
  const userItemsQuery = query(
    itemsCollectionRef,
    where("timestamp", ">=", oneHourAgoTimestamp)
  );

  try {
    const querySnapshot = await getDocs(userItemsQuery);
    const userItemsCount = querySnapshot.size;
    return userItemsCount >= 3;
  } catch (error) {
    console.error("Error fetching user items:", error);
    return false; // Handle the error and return an appropriate value
  }
}

function SellItemForm() {
  const navigate = useNavigate();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    email: "",
    price: "",
    description: "",
    images: [],
    timestamp: serverTimestamp(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFormData({
        ...formData,
        images: [files[0]],
      });
    }
  };

  // const handleRemoveImage = (index) => {
  //   const updatedImages = [...formData.images];
  //   updatedImages.splice(index, 1);
  //   setFormData({
  //     ...formData,
  //     images: updatedImages,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.endsWith("@vanderbilt.edu")) {
      alert('Email must end with "@vanderbilt.edu"');
      return;
    }
    try {
      let userId = await getUserID();
      const tooManyItems = await rateLimitFormSubmissions(userId);

      if (tooManyItems) {
        setError(
          "Submission limit exceeded. You may only post 3 items every hour. Try again later."
        );
        setIsErrorModalOpen(true); // Open the error modal
        return;
      }
      await storeItemsSell(userId, formData);
      console.log("Form data submitted:", formData);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
    console.log(formData);
  };

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Sell Your Item
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="start">
          <FormControl id="productName" isRequired>
            <FormLabel>Product Name</FormLabel>
            <Input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Product Name"
            />
          </FormControl>

          <FormControl id="price" isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price (USD)"
            />
          </FormControl>

          {/* Description Input */}
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description of your item..."
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email (so potential buyers can contact you!)"
            />
          </FormControl>

          {/* Image Upload */}
          <FormControl id="images" isRequired>
            <FormLabel>Upload Images</FormLabel>
            <InputGroup>
              <Input
                type="file"
                name="images"
                onChange={handleImageUpload}
                accept="image/*"
              />
              <InputRightElement style={{ width: "130px" }}>
                <Button
                  size="md"
                  bg={"brand.200"}
                  color={"black"}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      images: [],
                    });
                  }}
                >
                  Clear Image
                </Button>
              </InputRightElement>
            </InputGroup>
            {formData.images.length > 0 && (
              <Image
                src={URL.createObjectURL(formData.images[0])}
                alt="Uploaded Image"
                maxH="100px"
                mt={2}
              />
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            bg={"brand.100"}
            color={"white"}
            borderRadius="full"
            boxShadow="md"
            width={120}
            _hover={{
              bg: "brand.300",
              boxShadow: "lg",
            }}
          >
            Submit
          </Button>
          <Modal
            isOpen={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Error</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text color="red">{error}</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </form>
    </Box>
  );
}

export default SellItemForm;
