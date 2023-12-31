import React, { useState, useEffect } from "react";
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
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { storeItemsSell } from "../firebaseFunctions/firebaseWrite";
import { useNavigate } from "react-router-dom";
import { getUserID } from "../firebaseFunctions/dataload";
import {
  Modal,
  Flex,
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
import { auth } from "../firebaseConfig";


export async function rateLimitFormSubmissions(userId) {
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
  const [selectedTag, setSelectedTag] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    email: "",
    price: "",
    description: "",
    images: [],
    tags: [],
    timestamp: serverTimestamp(),
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {
      setFormData((prevData) => ({
        ...prevData,
        email: user.email,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return; // Exit the function if more than 5 files are selected
    }
  
    setFormData({
      ...formData,
      images: files,
    });
  };
  

  const addTag = () => {
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      console.log("Adding tags:", selectedTag);
      setFormData({
        ...formData,
        tags: [...formData.tags, selectedTag],
      });
      setSelectedTag(""); // Reset the selected tag
    }
    console.log("updated tags:", formData.tags);
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData({
      ...formData,
      tags: updatedTags,
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };
  

  const handleSubmit = async (e) => {
    console.log("formData", formData);
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
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
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      submitButton.disabled = false;
    }
    console.log(formData)
  };

  return (
    <div>
    <Button
        onClick={() => navigate("/")}
        bg={"brand.200"}
        color={"black"}
        size="sm"
        mb={4}
        ml={4}
        mt={4}
      >
        Back
    </Button>
    <Box p={4} maxWidth="500px" margin="0 auto">
      <Heading as="h2" size="lg" mb={4} textAlign="center" >
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
              width="100%"
              border="1px solid #D1C49D"
              borderRadius="md"
              _hover={{ border: "1px solid #A8996E" }} 
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
              width="100%"
              border="1px solid #D1C49D"
              borderRadius="md"
              _hover={{ border: "1px solid #A8996E" }} 
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
              width="100%"
              border="1px solid #D1C49D"
              borderRadius="md"
              _hover={{ border: "1px solid #A8996E" }}             
            />
          </FormControl>
          {/* Image Upload */}
          
          <FormControl id="images" isRequired>
            <FormLabel>Upload Image (Choose up to 5 images)</FormLabel>
            <InputGroup>
              <Input
                type="file"
                name="images"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                data-testid="upload-images-input"
                width="100%"
                style={{ textAlign: "center" }}
                border="1px solid #D1C49D"
                borderRadius="md"
                _hover={{ border: "1px solid #A8996E" }} 
              />
              <InputRightElement>
                <Button
                  style={{ fontSize: "13px", padding: "16px 28px", whiteSpace: "normal",  marginLeft: "-10px", }}
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
            {/*formData.images.length > 0 && (
              <Image
                src={URL.createObjectURL(formData.images[0])}
                alt="Uploaded Image"
                maxH="100px"
                mt={2}
              />
            )*/}
            
            {/* {formData.images.length > 0 && (
              <Flex direction="row" wrap="wrap" mt={2}>
                {formData.images.map((image, index) => (
                  <Box key={index} p={1}>
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded Image ${index + 1}`}
                      maxH="100px"
                    />
                  </Box>
                ))}
              </Flex>
            )} */}
            {formData.images.length > 0 && (
            <Flex direction="row" wrap="wrap" mt={2}>
              {formData.images.map((image, index) => (
              <Box key={index} p={1} position="relative">
                <Image
                src={URL.createObjectURL(image)}
                alt={`Uploaded Image ${index + 1}`}
                maxH="100px"
                />
                <Button 
                position="absolute"
                top="0"
                right="0"
                size="sm"
                onClick={() => removeImage(index)}
                >
                  ×
                  </Button>
                  </Box>
                  ))}
                  </Flex>
                  )}
          </FormControl>
          <FormControl id="tags" >  
            <FormLabel>Tags</FormLabel>
            <Select
              border="1px solid #D1C49D"
              borderRadius="md"
              _hover={{ border: "1px solid #A8996E" }} 
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">Options</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="appliances">Appliances</option>
              <option value="home">Home Decor</option>
              <option value="jewelry">Jewelry</option>
              <option value="toys">Toys</option>
              <option value="sports">Sports</option>
              <option value="antiques">Antiques</option>
              <option value="kitchenware">Kitchenware</option>
              <option value="office">Office Supplies</option>
              <option value="vehicles">Vehicles</option>

            </Select>
            <Button
              bg={"brand.200"}
              color={"black"}
              onClick={addTag}
              mt={2}
            >
              Add Tag
            </Button>
          </FormControl>
          {formData.tags.length > 0 && (
            <Wrap spacing={2}>
              {formData.tags.map((tag, index) => (
                <WrapItem key={index}>
                  <Tag size="lg" variant="solid" bg={"brand.200"} color={"white"}>
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          )}
        </VStack>
        <Flex justifyContent="center" mt={4}>
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
        </Flex>
      </form>
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
    </Box>
    </div>
  );
}

export default SellItemForm;
