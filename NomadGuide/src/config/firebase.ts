import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// getReactNativePersistence não possui types no pacote principal em algumas versões RN; usar require dinâmico.
// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

let getReactNativePersistence: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  getReactNativePersistence = require('firebase/auth/react-native').getReactNativePersistence;
} catch (e) {
  console.warn('Persistência RN do Firebase Auth não disponível, usando sessão em memória.');
}

const firebaseConfig = {
  apiKey: "AIzaSyC_IVGhFgR5AwyyYEi6lYiLOZtd8fFjrEg",
  authDomain: "nomadguide-5ea09.firebaseapp.com",
  projectId: "nomadguide-5ea09",
  storageBucket: "nomadguide-5ea09.firebasestorage.app",
  messagingSenderId: "1053963071181",
  appId: "1:1053963071181:android:207a38563eb737d9640384"
};

const app = initializeApp(firebaseConfig);

let authInstance;
try {
  if (getReactNativePersistence) {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } else {
    authInstance = getAuth(app);
  }
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
