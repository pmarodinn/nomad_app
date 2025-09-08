import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { useAuth } from '../src/contexts/AuthContext';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.jpg')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Title style={styles.title}>NomadGuide</Title>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Entrar
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotButton}
          >
            Esqueci minha senha
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => router.push('/register')}
            style={styles.registerButton}
          >
            Criar nova conta
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
  forgotButton: {
    marginTop: 10,
  },
  registerButton: {
    marginTop: 15,
    borderColor: '#2196F3',
  },
});
