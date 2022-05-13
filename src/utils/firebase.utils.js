import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

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

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async userAuth => {
  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { email, password } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        password,
        createdAt,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};
