import { ChakraProvider, Button } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SellItemForm from './SellItemForm';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/sell-item"
            element={
              <>
                <SellItemForm />
                <Button
                  as={Link}
                  to="/"
                  colorScheme="teal"
                  size="lg"
                  borderRadius="full"
                  boxShadow="md"
                  _hover={{ boxShadow: 'lg' }}
                >
                  Go back to Home
                </Button>
              </>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

function Home() {
  return (
    <div>
      <p>This is the Home page</p>
      {/* Button for navigating to Sell Item */}
      <Link to="/sell-item">
        <Button
          colorScheme="teal"
          size="lg"
          borderRadius="full"
          boxShadow="md"
          _hover={{ boxShadow: 'lg' }}
        >
          Go to Sell Item
        </Button>
      </Link>
    </div>
  );
}

export default App;
