import React, { useEffect, useState } from "react";
import {
  AllSellItemsLoader,
  QueryItemsLoader,
  filterFavorites
} from "../firebaseFunctions/dataload";
import ContactForm from "./ContactForm";
import { auth } from "../firebaseConfig";
import { Grid, Heading, Box, filter } from "@chakra-ui/react";
import ItemCard from "./ItemCard";
import {
  deleteItemFunc,
} from "../firebaseFunctions/firebaseWrite";



const ImageGallery = ({ searchQuery, selectedPrice, selectedTag, myItems, favorites, favoriteItems }) => {

  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [updateItems, setUpdateItems] = useState(false);

  const priceMap = {
    option1: 0,
    option2: 25,
    option3: 50,
    option4: 75,
    option5: 100,
  };

  useEffect(() => {

    async function load() {
      setLoading(true);
      let price = -1;
      if(selectedPrice != ""){
        price = priceMap[selectedPrice]
      }
      if (favorites) {
        const filteredFavorites = await filterFavorites(favoriteItems, searchQuery, price, selectedTag)
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
    setUpdateItems(false);
    load();
  }, [searchQuery, selectedPrice, selectedTag, myItems, favorites, favoriteItems, updateItems]);

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
                myItems={myItems}
                onDelete={deleteItem}
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
    </Box>
  );
};

export default ImageGallery;
