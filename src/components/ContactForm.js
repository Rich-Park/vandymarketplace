import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import axios from 'axios';


const ContactForm = ({ isOpen, onClose, sellerEmail, productName, productPrice, userEmail }) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleOfferPriceChange = (event) => {
    setOfferPrice(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-email', {
        sellerEmail,
        productName,
        productPrice,
        offerPrice,
        message,
        userEmail,
      });
  
      console.log(response.data.message); // Log the server's response
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact Seller</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="offerPrice">
            <FormLabel>Offer Price</FormLabel>
            <Input type="number" value={offerPrice} onChange={handleOfferPriceChange} />
          </FormControl>

          <FormControl id="message">
            <FormLabel>Message</FormLabel>
            <Textarea value={message} onChange={handleMessageChange} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button bg={"brand.200"}
                  color={"black"}  
                  borderRadius="full"
                  boxShadow="md"
                  width={120}
                  _hover={{
                    bg: "brand.500",
                    boxShadow: "lg",
                  }}
                  mr={3}
                    onClick={handleSubmit}>
            Submit
          </Button>
          <Button  
            bg={"brand.100"}  color={"white"}
            borderRadius="full"
            boxShadow="md"
            width={120}
              _hover={{
                bg: "brand.300",
                boxShadow: "lg",
              }} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContactForm;
