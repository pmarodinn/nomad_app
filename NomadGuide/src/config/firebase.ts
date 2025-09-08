import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase para mobile
// Configuração baseada no google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyC_IVGhFgR5AwyyYEi6lYiLOZtd8fFjrEg",
  authDomain: "nomadguide-5ea09.firebaseapp.com",
  projectId: "nomadguide-5ea09",
  storageBucket: "nomadguide-5ea09.firebasestorage.app",
  messagingSenderId: "1053963071181",
  appId: "1:1053963071181:android:207a38563eb737d9640384"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Para React Native, o Firebase automaticamente detecta e usa AsyncStorage quando disponível
// Vamos usar getAuth que já tem melhor suporte para React Native
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
