import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerContent}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Title style={styles.headerTitle}>NomadGuide</Title>
        </View>
        <Appbar.Action icon="bell" onPress={() => console.log('Notificações')} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title>Bem-vindo ao NomadGuide!</Title>
            <Paragraph>
              Seu companheiro completo para viagens. Explore destinos, gerencie seu orçamento, 
              cuide da sua saúde e conecte-se com outros viajantes.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Ações Rápidas</Title>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => console.log('Nova viagem')}>
              Nova Viagem
            </Button>
            <Button mode="outlined" onPress={() => console.log('Explorar')}>
              Explorar
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Resumo</Title>
            <Paragraph>• Próxima viagem: Em breve</Paragraph>
            <Paragraph>• Orçamento atual: R$ 0,00</Paragraph>
          </Card.Content>
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
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  card: {
    marginBottom: 16,
  },
});
