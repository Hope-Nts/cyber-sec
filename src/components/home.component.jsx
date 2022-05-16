import { Flex, Heading, useColorModeValue } from '@chakra-ui/react';

export default function Home() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Heading fontSize={'4xl'}>Successfully Signed Up!</Heading>
    </Flex>
  );
}
