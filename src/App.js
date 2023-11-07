import { ChakraProvider, Button, extendTheme, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SellItemForm from "./components/SellItemForm";
import HomePage from "./components/HomePage";
import LogInPage from "./components/LogInPage";
import MyItems from "./components/MyItems";
import Favorites from "./components/Favorites";
const colors = {
  brand: {
    100: "#000000", // main black
    200: "#A8996E", // main gold
    300: "#595959", // hover black
    400: "#FFFFFF", // main white
    500: "#D1C49D", // hover gold
  },
};

const theme = extendTheme({
  colors,
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/log-in" element={<LogInPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path='/favorites' element = {<Favorites/>}/>
          <Route path='/my-items' element = {<MyItems/>}/>
          <Route
            path="/sell-item"
            element={
              <div>
                <SellItemForm />
              </div>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
