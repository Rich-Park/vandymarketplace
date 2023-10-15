import React, { useEffect, useState } from 'react'
import { AllSellItemsLoader } from '../firebaseFunctions/dataload';
import { db } from "../firebaseConfig";
import ContactForm from './ContactForm';
import { auth } from "../firebaseConfig";

const ImageGallery = () => {
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        
        // // Call the function to load image URLs and update the state
        //setLoading(false)
        //load();
        // AllSellItemsImageLoader()
        //   .then((result) => {
        //     setImageURLs(result);
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching imageURLs:", error);
        //   });
       
        async function load(){
            setLoading(true);
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
            setLoading(false);
            
        }
        load();
        
  

    }, []);



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
      <div>
        {loading ? ( // Show loading message while data is being fetched
          <p>Loading images...</p>
        ) : itemsData.length > 0 ? (
          itemsData.map((item, index) => (
            <div key={index}>
              <span>hihi</span>
              {item.imageURLs && Array.isArray(item.imageURLs) ? (
                item.imageURLs.map((url, imageIndex) => (
                  <img
                    src={url}
                    key={imageIndex}
                    alt={`Image ${imageIndex} ${url}`}
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      margin: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => openModal(item)}
                  />
                ))
              ) : (
                <p>No images available for this item.</p>
              )}
            </div>
          ))
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
      </div>
    );
  }

  export default ImageGallery;