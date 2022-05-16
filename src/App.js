import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import SignUpCard from './components/signUpCard';
import Home from './components/home.component';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUpCard />}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
