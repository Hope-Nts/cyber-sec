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

import { checkPasswordStrength } from '../utils/passwordChecker.utils';
import ReCAPTCHA from 'react-google-recaptcha';

const defaultFormFields = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);

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

  const verifyCaptcha = () => {
    setCaptchaVerified(true);
  };

  const resetCaptcha = () => {
    setCaptchaVerified(false);
  };

  //method that is called when we submit the form
  const handleSubmit = async event => {
    event.preventDefault();

    if (
      strength.eightCharacter === false ||
      strength.upperCase === false ||
      strength.digit === false ||
      strength.lowerCase === false ||
      strength.specialCharacter === false
    ) {
      alert(`All password rules must be satisfied`);
      return;
    }

    if (password.length > 0 && password !== confirmPassword) {
      setShowPasswordMatch(true);
      return;
    }

    if (password === confirmPassword) {
      setShowPasswordMatch(false);
    }

    if (!isCaptchaVerified) {
      alert(`Verify you're human`);
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
                  required={true}
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

            {showPasswordMatch ? (
              <Text fontSize={'sm'} color={'red.600'}>
                Passwords do not match!
              </Text>
            ) : (
              ''
            )}

            <Stack>
              <Text fontSize={'xs'}>
                8+ Characters{' '}
                {strength.eightCharacter === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
              <Text fontSize={'xs'}>
                Uppercase letters{' '}
                {strength.upperCase === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
              <Text fontSize={'xs'}>
                Lowercase letters{' '}
                {strength.lowerCase === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>

              <Text fontSize={'xs'}>
                Special Character{' '}
                {strength.specialCharacter === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
              <Text fontSize={'xs'}>
                Contains digits{' '}
                {strength.digit === true ? (
                  <CheckCircleIcon color="green.500" />
                ) : (
                  <WarningIcon color="red.500" />
                )}
              </Text>
            </Stack>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Stack>

            <Stack>
              <ReCAPTCHA
                sitekey="6LcgtOIfAAAAAPKY4tPJouA-7ujrn7IHYJNvuOk6"
                onChange={verifyCaptcha}
                onExpired={resetCaptcha}
              />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
