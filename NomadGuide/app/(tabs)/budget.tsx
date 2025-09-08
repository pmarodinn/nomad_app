import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useAuth } from '@/src/contexts/AuthContext';

export default function BudgetScreen() {
  const { user } = useAuth();
  const [budgets] = useState<any[]>([]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerContent}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Title style={styles.headerTitle}>Orçamento</Title>
        </View>
        <Appbar.Action icon="plus" onPress={() => console.log('Novo orçamento')} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {budgets.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>Nenhum orçamento criado</Title>
              <Paragraph>
                Crie seu primeiro orçamento de viagem para controlar seus gastos.
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => console.log('Criar orçamento')}>
                Criar Orçamento
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          budgets.map((budget, index) => (
            <Card key={index} style={styles.budgetCard}>
              <Card.Content>
                <Title>{budget.name}</Title>
                <Paragraph>Total: R$ {budget.total}</Paragraph>
                <Paragraph>Gasto: R$ {budget.spent}</Paragraph>
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
  emptyCard: {
    marginTop: 50,
    marginHorizontal: 16,
  },
  budgetCard: {
    marginBottom: 16,
  },
});
