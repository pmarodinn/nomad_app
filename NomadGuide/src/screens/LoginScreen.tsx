import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, TextInput, Card, Title } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!isLoginMode && !displayName.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email.trim(), password);
        router.replace('/(tabs)');
      } else {
        await register(email.trim(), password, displayName.trim());
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro inesperado';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está sendo usado';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setDisplayName('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>NomadGuide</Title>
            <Text style={styles.subtitle}>
              Descubra e compartilhe os melhores lugares
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>
                {isLoginMode ? 'Entrar' : 'Criar Conta'}
              </Title>

              {!isLoginMode && (
                <TextInput
                  label="Nome"
                  value={displayName}
                  onChangeText={setDisplayName}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="words"
                  textContentType="name"
                />
              )}

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />

              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                textContentType="password"
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              >
                {isLoginMode ? 'Entrar' : 'Criar Conta'}
              </Button>

              <Button
                mode="text"
                onPress={toggleMode}
                disabled={loading}
                style={styles.toggleButton}
              >
                {isLoginMode
                  ? 'Não tem conta? Criar uma'
                  : 'Já tem conta? Entrar'}
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    backgroundColor: 'white',
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  toggleButton: {
    marginTop: 8,
  },
});
