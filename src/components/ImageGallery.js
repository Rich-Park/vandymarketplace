import React, { useEffect, useState } from 'react'
import { AllSellItemsLoader,  QueryItemsLoader} from '../firebaseFunctions/dataload';
import ContactForm from "./ContactForm";
import { auth } from "../firebaseConfig";
import { Grid, Heading, Box, useBreakpointValue } from "@chakra-ui/react";
import ItemCard from "./ItemCard";

const ImageGallery = ({ searchQuery })  => {
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
      
        async function load(){

            setLoading(true);
            if(searchQuery === ""){
              try{
                const result = await AllSellItemsLoader();
                setItemsData(result);
                const user = auth.currentUser;
                if (user && user.email) {
                  setUserEmail(user.email);
                }
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000);
              } catch (error){
                console.error("Error fetching data:", error);
              }
            }else{
              try{
                const result = await QueryItemsLoader(searchQuery);
                setItemsData(result);
                const user = auth.currentUser;
                if (user && user.email) {
                  setUserEmail(user.email);
                }
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000);
              } catch (error){
                console.error("Error fetching data:", error);
              }
            }

            setLoading(false);
            
        }
        load();

    }, [searchQuery]);


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
      {loading ? ( // Show loading message while data is being fetched
        <p>Loading images...</p>
      ) : itemsData.length > 0 ? (
        <>
          <Heading size="md" m={2}>
            Featured Items
          </Heading>

          <Grid
            templateColumns={{
              base: "repeat(auto-fit, minmax(150px, 1fr))", // On smaller screens, minimum width is 150px
              md: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust as needed for different breakpoints
              lg: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
            gridAutoRows="1fr"
            gap={4}
            p={5}
          >
            {itemsData.map((item, index) => (
              <ItemCard key={index} item={item} openModal={openModal} />
            ))}
          </Grid>
        </>
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
