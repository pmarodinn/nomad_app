import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase para mobile
// TEMPORÁRIA PARA TESTES - Substitua pelos valores reais do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDQtest-test-test-test-test-testkey",
  authDomain: "nomadguide-test.firebaseapp.com",
  projectId: "nomadguide-test",
  storageBucket: "nomadguide-test.appspot.com",
  messagingSenderId: "1053963071181",
  appId: "1:1053963071181:android:207a38563eb737d9640384"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços do Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
