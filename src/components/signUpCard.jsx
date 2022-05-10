import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  ViewIcon,
  ViewOffIcon,
  CheckCircleIcon,
  WarningIcon,
} from '@chakra-ui/icons';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../utils/firebase.utils';

const defaultFormFields = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password, confirmPassword } = formFields;
  let strength = {
    eightCharacter: false,
    upperCase: false,
    digit: false,
    lowerCase: false,
    specialCharacter: false,
    totalPoints: 0,
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const checkPassword = () => {
    if (password === confirmPassword) {
      setPasswordConfirmed(true);
    } else if (password !== confirmPassword) {
      setPasswordConfirmed(false);
    }
  };

  //method that is called when we submit the form
  const handleSubmit = async event => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user);
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already in use');
      } else {
        console.log('user creation encountered an error', error);
      }
    }
  };

  const checkPasswordStrength = password => {
    //checking for 8 character count
    const eightCharactePoints = checkRuleStrength(
      password,
      /^.{8,}/,
      'eightCharacters'
    );
    // console.log(eightCharactePoints);

    //checking for upercase
    const upperCasePoints = checkRuleStrength(password, /[A-Z]/g, 'upperCase');
    // console.log(upperCasePoints);

    //checking for lowerCase
    const lowerCasePoints = checkRuleStrength(password, /[a-z]/g, 'lowerCase');
    // console.log(lowerCasePoints);

    //checking for digits
    const digitPoints = checkRuleStrength(password, /[0-9]/g, 'digits');
    // console.log(digitPoints);

    //checking for special characters
    const specialCharacter = checkRuleStrength(
      password,
      /[^0-9a-zA-Z\s]/g,
      'specialCharacter'
    );
    // console.log(uniqueCharacterPoints);

    const totalPoints =
      eightCharactePoints +
      upperCasePoints +
      digitPoints +
      lowerCasePoints +
      specialCharacter;
    console.log(totalPoints);

    return {
      eightCharacter: eightCharactePoints > 0 ? true : false,
      upperCase: upperCasePoints > 0 ? true : false,
      digit: digitPoints > 0 ? true : false,
      lowerCase: lowerCasePoints > 0 ? true : false,
      specialCharacter: specialCharacter > 0 ? true : false,
      totalPoints: totalPoints,
    };
  };

  const checkRuleStrength = (password, regex, type) => {
    const matches = password.match(regex) || [];
    const points = {
      eightCharacters: 10,
      lowerCase: 5,
      upperCase: 5,
      digits: 5,
      specialCharacter: 10,
      uniqueCharacters: 5,
    };
    console.log(type, ':', matches.length);
    return points[type] * matches.length;
  };

  if (password.length > 0) {
    strength = checkPasswordStrength(password);
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Please Enter your details
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                required
                value={email}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={password}
                  onChange={handleInputChange}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword(showPassword => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Progress
              value={strength.totalPoints}
              colorScheme={
                strength.totalPoints < 50
                  ? 'red'
                  : strength < 65
                  ? 'orange'
                  : strength < 85
                  ? 'yellow'
                  : 'green'
              }
            />

            <Stack pt={0}>
              <Text fontSize={'xs'} align={'center'}>
                8+ Characters{' '}
                {strength.eightCharacter === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
              <Text fontSize={'xs'} align={'center'}>
                Uppercase letters{' '}
                {strength.upperCase === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
              <Text fontSize={'xs'} align={'center'}>
                Lowercase letters{' '}
                {strength.lowerCase === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>

              <Text fontSize={'xs'} align={'center'}>
                Special Character{' '}
                {strength.specialCharacter === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
              <Text fontSize={'xs'} align={'center'}>
                Contains digits{' '}
                {strength.digit === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
            </Stack>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel> Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={handleInputChange}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowConfirmPassword(
                        showConfirmPassword => !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {confirmPassword ? (
              <Text fontSize={'sm'} color={'red.600'}>
                Passwords do not match!
              </Text>
            ) : (
              ''
            )}

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              {/* This is where the Captcha will go */}
              {/* <Text align={'center'}>
                Already a user? <Link color={'blue.400'}>Login</Link>
              </Text> */}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
