import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../src/contexts/AuthContext';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const { displayName, email, password, confirmPassword } = formData;

    // Validações
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (displayName.length < 2) {
      Alert.alert('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, displayName);
      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso. Bem-vindo ao NomadGuide!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro detalhado no registro:', error);
      let errorMessage = 'Erro ao criar conta';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso. Tente fazer login ou use outro email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido. Verifique o formato do endereço.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.code === 'auth/invalid-user-token') {
        errorMessage = 'Erro de autenticação. Tente novamente ou reinicie o aplicativo.';
      } else if (error.code === 'auth/user-token-expired') {
        errorMessage = 'Sessão expirada. Tente novamente.';
      } else {
        errorMessage = `Erro: ${error.message || error.code || 'Erro desconhecido'}`;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Criar Conta</Title>
          <Paragraph style={styles.subtitle}>
            Comece sua jornada com o NomadGuide
          </Paragraph>
          
          <TextInput
            label="Nome completo"
            value={formData.displayName}
            onChangeText={(value) => updateFormData('displayName', value)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
            placeholder="Seu nome completo"
          />
          
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            style={{ marginBottom: 16 }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="Digite seu email"
          />
          
          <TextInput
            label="Senha"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            placeholder="Mínimo 6 caracteres"
          />
          
          <TextInput
            label="Confirmar senha"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            placeholder="Digite a senha novamente"
          />
          
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
            disabled={loading}
          >
            Criar Conta
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Já tenho uma conta
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  backButton: {
    marginTop: 15,
  },
});
