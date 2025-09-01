import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const cfg = (Constants.expoConfig?.extra as any)?.firebase;
    const app = initializeApp(cfg);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }
      setUid(user.uid);
      // Grava um perfil mínimo em users/{uid}
      await setDoc(doc(db, 'users', user.uid), {
        displayName: 'Guest',
        baseCurrency: 'USD',
        currentCity: 'Lisboa',
        currentCountry: 'Portugal',
        timezone: 'Europe/Lisbon'
      }, { merge: true });
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>Carregando...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'NomadGuide' }} />
    </Stack>
  );
}
