import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '@/src/contexts/AuthContext';

export default function EmergencyScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerContent}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Title style={styles.headerTitle}>Emergência</Title>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Contatos de Emergência</Title>
            <Paragraph>
              Aqui você encontrará contatos importantes para emergências durante sua viagem.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Números de Emergência</Title>
            <Paragraph>• Polícia: 190</Paragraph>
            <Paragraph>• SAMU: 192</Paragraph>
            <Paragraph>• Bombeiros: 193</Paragraph>
            <Paragraph>• Defesa Civil: 199</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Documentos</Title>
            <Paragraph>
              Mantenha sempre cópias digitais dos seus documentos importantes.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => console.log('Gerenciar documentos')}>
              Gerenciar Documentos
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});
