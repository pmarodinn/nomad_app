import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuário autenticado, redirecionar para as tabs
        router.replace('/(tabs)');
      } else {
        // Usuário não autenticado, redirecionar para login
        router.replace('/auth');
      }
    }
  }, [user, loading]);

  // Mostrar loading enquanto verifica autenticação
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2196F3" />
    </View>
  );
}
