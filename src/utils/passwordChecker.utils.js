export const checkPasswordStrength = password => {
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

  return points[type] * matches.length;
};
