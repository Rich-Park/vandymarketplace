import React, { useEffect, useState } from 'react'
import { AllSellItemsImageLoader } from '../firebaseFunctions/dataload';
import { db, auth } from "../firebaseConfig";
const ImageGallery = () => {

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
            const result = await AllSellItemsImageLoader();
            setImageURLs(result);
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(1000);
            setLoading(false);
            
        }
        load();
        
  

    }, []);

    const [imageURLs, setImageURLs] = useState([]);
    const [loading, setLoading] = useState(false);

    

    return (
        <div>
        {loading ? ( // Show loading message while data is being fetched
          <p>Loading images...</p>
        ) : imageURLs.length > 0 ? (
          imageURLs.map((url, index) => (
            <div key = {index}>
              <span>hihi</span>
              <img
                src={url}
                key={index}
                alt={`Image ${index} ${url}`}
                style={{ maxWidth: "100px", maxHeight: "100px", margin: "10px" }}
              />
            </div>
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>
    )
}

export default ImageGallery;