import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';

import SignUpCard from './components/signUpCard';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SignUpCard />
    </ChakraProvider>
  );
}

export default App;
