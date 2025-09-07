import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase para mobile
// IMPORTANTE: Substitua os valores abaixo pelos do seu google-services.json
const firebaseConfig = {
  apiKey: "your-api-key-here", // Pegar do google-services.json
  authDomain: "your-project-id.firebaseapp.com", // Pegar do google-services.json
  projectId: "your-project-id", // Pegar do google-services.json
  storageBucket: "your-project-id.appspot.com", // Pegar do google-services.json
  messagingSenderId: "1053963071181", // Do seu App ID
  appId: "1:1053963071181:android:207a38563eb737d9640384" // Seu App ID real
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços do Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
