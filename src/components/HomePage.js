import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
            color={"brand.200"}
          >
            Vanderbilt <br />
            <Text as={"span"} color={"brand.100"}>
              Marketplace
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Buy and sell items with other Vanderbilt students. Post your items,
            browse for items, and get in contact to find the perfect price!
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              bg={"brand.100"}
              color="white"
              rounded={"full"}
              _hover={{
                bg: "brand.300",
                boxShadow: "lg",
              }}
              width={120}
            >
              Find items
            </Button>
            <Button
              as={Link}
              bg={"brand.200"}
              color={"black"}
              to="/sell-item"
              borderRadius="full"
              boxShadow="md"
              width={120}
              _hover={{
                bg: "brand.500",
                boxShadow: "lg",
              }}
            >
              Sell items
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
