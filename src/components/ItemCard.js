import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { BiMessageRoundedDetail } from "react-icons/bi";

const ItemCard = ({ item, openModal }) => {
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
      // shadow="sm"
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
          <Tooltip
            label="Add to cart"
            bg="white"
            placement={"top"}
            color={"gray.800"}
          >
            <chakra.a href={"#"} display={"flex"}>
              <Icon as={FiShoppingCart} h={7} w={7} alignSelf={"center"} />
            </chakra.a>
          </Tooltip>
        </Flex>

        <Flex justifyContent="space-between" alignContent="center">
          <Box color={useColorModeValue("gray.800", "white")}>
            <Box as="span" color={"gray.600"} fontSize="lg">
              $
            </Box>
            {item.price}
          </Box>
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
              />
            </chakra.a>
          </Tooltip>
        </Flex>
      </Box>
      {/* </Box> */}
      {/* </AspectRatio> */}
    </Flex>
  );
};

export default ItemCard;
