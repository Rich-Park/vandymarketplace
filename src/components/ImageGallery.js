import React, { useEffect, useState } from "react";
import {
  QueryItemsLoader,
  filterFavorites
} from "../firebaseFunctions/dataload";
import ContactForm from "./ContactForm";
import { auth } from "../firebaseConfig";
import { Grid, Heading, Box, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text, 
  Image,
  Flex } from "@chakra-ui/react";

import ItemCard from "./ItemCard";
import {
  deleteItemFunc,
} from "../firebaseFunctions/firebaseWrite";
import { reload } from "firebase/auth";



const ImageGallery = ({ searchQuery, selectedPrice, selectedTag, selectedSort, myItems, favorites, favoriteItems, reloadFav }) => {

  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [updateItems, setUpdateItems] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [descriptionItem, setDescriptionItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadFav, setLoadFav] = useState(false);

  const priceMap = {
    option1: 0,
    option2: 25,
    option3: 50,
    option4: 75,
    option5: 100,
  };

  useEffect(() => {
    // load the items to be displayed
    async function load() {
      setLoading(true);
      let price = -1;
      if(selectedPrice !== ""){
        price = priceMap[selectedPrice]
      }
      if (favorites) {
        const filteredFavorites = await filterFavorites(favoriteItems, searchQuery, price, selectedTag, selectedSort)
        setItemsData(filteredFavorites);
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(2000);
      } else {
        try {
  
          let result;
          result = await QueryItemsLoader(
            searchQuery,
            price,
            selectedTag,
            selectedSort,
            myItems
          );

          setItemsData(result);
          const user = auth.currentUser;
          if (user && user.email) {
            setUserEmail(user.email);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        
      }
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(1000);
      setLoading(false);
    }
    setLoadFav(false);
    setUpdateItems(false);
    load();
  }, [searchQuery, selectedPrice, selectedTag, selectedSort, myItems, favorites, favoriteItems, updateItems, loadFav]);

  const updateLikesCount = () => {
    setLoadFav(true);
    if(favorites){
      reloadFav(true);
    }
    
  };

  // Function to handle item deletion
  const deleteItem = async (item) => {
    try {
      await deleteItemFunc(item);
      setUpdateItems(true)
      console.log(itemsData)
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

    // Handler for opening description modal
    const handleItemDoubleClick = (item) => {
      setDescriptionItem(item);
      setCurrentImageIndex(0); // Reset to the first image
      setIsDescriptionModalOpen(true);
    };

    const goToPreviousImage = () => {
      setCurrentImageIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
    };
    
    const goToNextImage = () => {
      setCurrentImageIndex(prevIndex => (prevIndex < descriptionItem.imageURLs.length - 1 ? prevIndex + 1 : prevIndex));
    };
  
    // Handler for closing description modal
    const closeDescriptionModal = () => {
      setIsDescriptionModalOpen(false);
      setDescriptionItem(null);
    };
  

  // Event handler to open the modal
  const openModal = (item) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <Box>
      {itemsData.length > 0 ? (
        <>
          <Heading size="md" m={2}>
            {favorites
              ? "My Favorited Items"
              : myItems
              ? "My Items For Sale"
              : "Featured Items"}
          </Heading>
          <Grid
            templateColumns={{
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(6, 1fr)",
            }}
            gap={4}
            p={5}
          >
            {itemsData.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                openModal={openModal}
                onDoubleClick={handleItemDoubleClick}
                myItems={myItems}
                onDelete={deleteItem}
                item_likes_count={item.likesCount}
                updateLikesCount = {updateLikesCount}
              />
            ))}
          </Grid>
        </>
      ) : loading ? (
        <p>Loading images...</p>
      ) : (
        <p>No images available.</p>
      )}
      {selectedItem && (
        <ContactForm
          isOpen={isModalOpen}
          onClose={closeModal}
          sellerEmail={selectedItem.email}
          productName={selectedItem.productName}
          productPrice={selectedItem.price}
          userEmail={userEmail}
        />
      )}
      {/* Description Modal */}
      
      {/*descriptionItem && (
        <Modal isOpen={isDescriptionModalOpen} onClose={closeDescriptionModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{descriptionItem.productName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{descriptionItem.description}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={closeDescriptionModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )*/}
      {descriptionItem && (
        <Modal isOpen={isDescriptionModalOpen} onClose={closeDescriptionModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{descriptionItem.productName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" alignItems="center" position="relative">
                {/* Image */}
                <Image
                  src={descriptionItem.imageURLs[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1} of ${descriptionItem.productName}`}
                  objectFit="cover"
                  maxWidth="100%"
                />

                {/* Navigation Buttons (only shown if there are multiple images) */}
                <Flex justify="center" align="center" mt={2}>
                  {descriptionItem.imageURLs.length > 1 && (
                    <>
                      <Button 
                        onClick={goToPreviousImage} 
                        disabled={currentImageIndex === 0}
                      >
                        ←
                      </Button>
                      <Text mx={2}>
                        {currentImageIndex + 1} of {descriptionItem.imageURLs.length}
                      </Text>
                      <Button 
                        onClick={goToNextImage} 
                        disabled={currentImageIndex === descriptionItem.imageURLs.length - 1}
                      >
                        →
                      </Button>
                    </>
                  )}
                </Flex>
                
                {/* Description and Tags */}
                <Text mt={4}>{descriptionItem.description}</Text>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={closeDescriptionModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

    </Box>
  );
};

export default ImageGallery;
