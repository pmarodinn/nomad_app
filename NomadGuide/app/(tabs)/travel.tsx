import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '@/src/contexts/AuthContext';

export default function TravelScreen() {
  const { user } = useAuth();
  const [trips] = useState<any[]>([]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Viagens" />
        <Appbar.Action icon="plus" onPress={() => console.log('Nova viagem')} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        {trips.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>Nenhuma viagem planejada</Title>
              <Paragraph>
                Comece a planejar sua próxima aventura!
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => console.log('Planejar viagem')}>
                Planejar Viagem
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          trips.map((trip, index) => (
            <Card key={index} style={styles.tripCard}>
              <Card.Content>
                <Title>{trip.destination}</Title>
                <Paragraph>{trip.dates}</Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyCard: {
    marginTop: 50,
    marginHorizontal: 20,
  },
  tripCard: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
