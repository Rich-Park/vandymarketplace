import React from "react";
import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from "@chakra-ui/react";
import { getUserID } from "../firebaseFunctions/dataload";
import { AiOutlineHeart, AiOutlineDelete, AiFillHeart } from "react-icons/ai";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { likeItem, unlikeItem } from "../firebaseFunctions/firebaseWrite";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ItemCard = ({ item, openModal, onDoubleClick, myItems, onDelete }) => {
  console.log("item", item);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likesCount || 0);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const userId = await getUserID();
        const userRef = doc(db, "users", userId);
        const userData = await getDoc(userRef);
        if (userData.exists) {
          const userLikedItems = userData.data().likedItems || [];
          setLiked(
            userLikedItems.some((likedItem) => likedItem.itemId === item.id)
          );
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchLikedStatus();
  }, [item.id]);

  // Function to handle the liking and unliking process
  const handleLikeToggle = async () => {
    const userId = await getUserID();

    if (liked) {
      await unlikeItem(userId, item.sellerId, item.id);
      setLiked(false);
      setLikesCount((prevCount) => prevCount - 1); // Decrement likes count
    } else {
      await likeItem(userId, item.sellerId, item.id);
      setLiked(true);
      setLikesCount((prevCount) => prevCount + 1); // Increment likes count
    }
  };

  return (
    <Flex
      direction="column"
      h="100%"
      w="100%"
      justifyContent="center"
      overflow="hidden"
      borderWidth="1px"
      rounded="lg"
      _hover={{ transform: "scale(1.05)", transition: ".3s" }}
      onDoubleClick={() => onDoubleClick(item)}
    >
      <Box width="100%" height="100%" overflow="hidden">
        <Image
          src={item.imageURLs[0]}
          alt={`Image of ${item.name}`}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>

      <Box p="2">
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {item.productName}
          </Box>
          {!myItems && (
            <Tooltip
              label={liked ? "Remove from favorites" : "Add to favorites"}
              bg="white"
              placement={"top"}
              color={"gray.800"}
            >
              <chakra.button
                onClick={handleLikeToggle}
                display={"flex"}
                aria-label="Favorite Button"
              >
                <chakra.span marginLeft="2" color="gray.600">
                  {likesCount}
                </chakra.span>
                <Icon
                  as={liked ? AiFillHeart : AiOutlineHeart}
                  h={7}
                  w={7}
                  alignSelf={"center"}
                  color={liked && "red"}
                  marginLeft="1"
                  aria-label="favorite-icon"
                />
              </chakra.button>
            </Tooltip>
          )}
        </Flex>

        <Flex justifyContent="space-between" alignContent="center">
          <Box color={useColorModeValue("gray.800", "white")}>
            <Box as="span" color={"gray.600"} fontSize="lg">
              $
            </Box>
            {item.price}
          </Box>
          {!myItems && (
            <Tooltip
              label="Contact Seller"
              bg="white"
              placement={"top"}
              color={"gray.800"}
            >
              <chakra.a href={"#"} display={"flex"}>
                <Icon
                  as={BiMessageRoundedDetail}
                  h={7}
                  w={7}
                  alignSelf={"center"}
                  onClick={() => openModal(item)}
                  aria-label="Contact Button"
                />
              </chakra.a>
            </Tooltip>
          )}
          {myItems && (
            <Tooltip label="Delete" bg="white" placement={"top"} color={"gray.800"}>
              <chakra.button
                onClick={() => onDelete(item.id)} 
                display={"flex"}
                aria-label="Delete Button"
              >
                <Icon as={AiOutlineDelete} h={7} w={7} color="red" />
              </chakra.button>
            </Tooltip>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ItemCard;
