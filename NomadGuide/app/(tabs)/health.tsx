import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, TextInput, Dialog, Portal, List } from 'react-native-paper';

export default function HealthScreen() {
  const [medications, setMedications] = useState<string[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newMedication, setNewMedication] = useState('');

  const addMedication = () => {
    if (newMedication.trim().length === 0) return;
    setMedications(prev => [...prev, newMedication.trim()]);
    setNewMedication('');
    setDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Medicamentos" />
        <Appbar.Action icon="plus" onPress={() => setDialogVisible(true)} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
            <Card.Content>
              <Title>Lista de Medicamentos</Title>
              {medications.length === 0 ? (
                <Paragraph>Nenhum medicamento registrado.</Paragraph>
              ) : (
                medications.map((med, i) => (
                  <List.Item
                    key={i}
                    title={med}
                    left={props => <List.Icon {...props} icon="pill" />}
                  />
                ))
              )}
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setDialogVisible(true)}>Adicionar</Button>
            </Card.Actions>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Novo Medicamento</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome"
              value={newMedication}
              onChangeText={setNewMedication}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button onPress={addMedication}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
});
