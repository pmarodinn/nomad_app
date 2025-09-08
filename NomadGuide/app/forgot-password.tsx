import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../src/contexts/AuthContext';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Email Enviado!',
        'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Erro ao enviar email de recuperação';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email não encontrado. Verifique o endereço digitado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido. Verifique o formato do endereço.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Esqueci Minha Senha</Title>
          
          {!emailSent ? (
            <>
              <Paragraph style={styles.description}>
                Digite seu email abaixo e enviaremos instruções para redefinir sua senha.
              </Paragraph>
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={{ marginBottom: 16 }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="Digite seu email"
              />
              
              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.button}
                disabled={loading}
              >
                Enviar Email de Recuperação
              </Button>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Paragraph style={styles.successText}>
                ✅ Email enviado com sucesso!
              </Paragraph>
              <Paragraph style={styles.description}>
                Verifique sua caixa de entrada (incluindo spam) e siga as instruções no email para redefinir sua senha.
              </Paragraph>
            </View>
          )}
          
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Voltar ao Login
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
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    color: '#2196F3',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 15,
    paddingVertical: 5,
  },
  backButton: {
    marginTop: 10,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
});
