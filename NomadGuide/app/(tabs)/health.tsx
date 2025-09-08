import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';

export default function HealthScreen() {
  const [healthInfo, setHealthInfo] = useState({
    vaccinations: [],
    medications: [],
    allergies: [],
    emergencyContacts: [],
  });

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saúde" />
        <Appbar.Action icon="plus" onPress={() => console.log('Adicionar info')} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Vacinações</Title>
            {healthInfo.vaccinations.length === 0 ? (
              <Paragraph>Nenhuma vacinação registrada.</Paragraph>
            ) : (
              healthInfo.vaccinations.map((vaccine, index) => (
                <Chip key={index} style={styles.chip}>
                  {vaccine}
                </Chip>
              ))
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => console.log('Adicionar vacinação')}>
              Adicionar
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Medicamentos</Title>
            {healthInfo.medications.length === 0 ? (
              <Paragraph>Nenhum medicamento registrado.</Paragraph>
            ) : (
              healthInfo.medications.map((med, index) => (
                <Paragraph key={index}>• {med}</Paragraph>
              ))
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => console.log('Adicionar medicamento')}>
              Adicionar
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Alergias</Title>
            {healthInfo.allergies.length === 0 ? (
              <Paragraph>Nenhuma alergia registrada.</Paragraph>
            ) : (
              healthInfo.allergies.map((allergy, index) => (
                <Chip key={index} style={styles.chip}>
                  {allergy}
                </Chip>
              ))
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => console.log('Adicionar alergia')}>
              Adicionar
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Contatos de Emergência</Title>
            {healthInfo.emergencyContacts.length === 0 ? (
              <Paragraph>Nenhum contato de emergência.</Paragraph>
            ) : (
              healthInfo.emergencyContacts.map((contact, index) => (
                <Paragraph key={index}>• {contact}</Paragraph>
              ))
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => console.log('Adicionar contato')}>
              Adicionar
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
});
