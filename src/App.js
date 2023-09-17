import { ChakraProvider, Button, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SellItemForm from "./components/SellItemForm";
import HomePage from "./components/HomePage";

const colors = {
  brand: {
    100: "#000000", // main black
    200: "#A8996E", // main gold
    300: "#595959", // hover black
    400: "#FFFFFF", // main white
    500: "#D1C49D", // hover gold
  },
};

const theme = extendTheme({ colors });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sell-item"
            element={
              <>
                <SellItemForm />
                <Button
                  as={Link}
                  bg={"brand.200"}
                  color={"black"}
                  to="/"
                  borderRadius="full"
                  boxShadow="md"
                  width={120}
                  _hover={{
                    bg: "brand.500",
                    boxShadow: "lg",
                  }}
                  ml={"1rem"}
                  
                >
                  Home Page
                </Button>
              </>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
