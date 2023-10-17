import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { storeItemsSell } from '../firebaseFunctions/firebaseWrite';  
import { useNavigate } from "react-router-dom";
import { getUserID } from '../firebaseFunctions/dataload';

function SellItemForm() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    email: '',
    price: '',
    description: '', 
    images: [],
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
    if (!formData.email.endsWith('@vanderbilt.edu')) {
      alert('Email must end with "@vanderbilt.edu"');
      return;
    }
    let userId = await getUserID();
    console.log("get user ID form the function getUserID", userId);
    await storeItemsSell(userId,formData);
    console.log('Form data submitted:', formData);
    navigate('/');
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
              <InputRightElement style={{ width: '130px' }}>
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
        </VStack>
      </form>
    </Box>
  );
}

export default SellItemForm;