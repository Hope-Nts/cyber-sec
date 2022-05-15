import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, getDocs, addDoc, collection } from 'firebase/firestore';

import sha256 from 'crypto-js/sha256';

const firebaseConfig = {
  apiKey: 'AIzaSyAljsg_JDZfcHMcBhlvSeCjEBBNIiNzmNI',
  authDomain: 'cyber-assignment.firebaseapp.com',
  projectId: 'cyber-assignment',
  storageBucket: 'cyber-assignment.appspot.com',
  messagingSenderId: '693806217599',
  appId: '1:693806217599:web:c26912e7866395ee42c24a',
  measurementId: 'G-7YZVSLJ0R6',
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore(firebaseApp);

//check if the username exists in the database
export const checkIfUsernameExists = async newUsername => {
  let doesExist = false;
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach(doc => {
      const { username } = doc.data();
      if (newUsername === username) {
        doesExist = true;
      }
    });
  } catch (e) {
    console.error('Error getting documents: ', e);
  }
  return doesExist;
};

export const signUpUser = async userData => {
  const { username, password } = userData;
  const passwordHash = sha256(password).toString();
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      username,
      password: passwordHash,
      passwordChanges: 0,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
