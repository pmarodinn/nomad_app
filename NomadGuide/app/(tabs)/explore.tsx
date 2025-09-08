import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ExploreScreen() {
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
          <Title style={styles.headerTitle}>Explorar</Title>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Destinos Populares</Title>
            <Paragraph>
              Descubra novos destinos e lugares incríveis para sua próxima aventura.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Dicas de Viagem</Title>
            <Paragraph>
              Confira dicas valiosas e guias especializados para suas viagens.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Experiências Locais</Title>
            <Paragraph>
              Encontre experiências autênticas e atividades únicas em cada destino.
            </Paragraph>
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
  card: {
    marginBottom: 16,
  },
});
