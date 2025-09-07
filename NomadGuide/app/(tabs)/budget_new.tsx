import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/AuthContext';
import { budgetService, BudgetData, Expense } from '@/src/services/budgetService';

interface BudgetSummary {
  totalBudget: number;
  spent: number;
  remaining: number;
  dailyLimit: number;
  todaySpent: number;
  currency: string;
}

export default function BudgetScreen() {
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetData | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  // Load data from Firebase on component mount
  useEffect(() => {
    if (!firebaseUser) return;

    let budgetUnsubscribe: () => void;
    let expensesUnsubscribe: () => void;

    const loadData = async () => {
      try {
        setLoading(true);

        // Subscribe to current budget updates
        budgetUnsubscribe = budgetService.subscribeToCurrentBudget(
          firebaseUser.uid,
          (budget) => {
            setCurrentBudget(budget);
            if (budget) {
              calculateBudgetSummary(budget);
            }
          }
        );

        // Subscribe to recent expenses updates
        expensesUnsubscribe = budgetService.subscribeToRecentExpenses(
          firebaseUser.uid,
          (expenses) => {
            setRecentExpenses(expenses.slice(0, 10)); // Show only last 10 expenses
            if (currentBudget) {
              calculateTodaySpent(expenses, currentBudget);
            }
          }
        );

      } catch (error) {
        console.error('Error loading budget data:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do orçamento');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Cleanup subscriptions on unmount
    return () => {
      if (budgetUnsubscribe) budgetUnsubscribe();
      if (expensesUnsubscribe) expensesUnsubscribe();
    };
  }, [firebaseUser]);

  const calculateBudgetSummary = (budget: BudgetData) => {
    const remaining = budget.totalBudget - budget.spent;
    const daysInPeriod = Math.ceil((budget.endDate.getTime() - budget.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyLimit = budget.totalBudget / daysInPeriod;

    setBudgetSummary({
      totalBudget: budget.totalBudget,
      spent: budget.spent,
      remaining,
      dailyLimit,
      todaySpent: 0, // Will be calculated separately
      currency: budget.currency,
    });
  };

  const calculateTodaySpent = (expenses: Expense[], budget: BudgetData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayExpenses = expenses.filter(expense => 
      expense.date >= today && expense.date < tomorrow
    );

    const todaySpent = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    setBudgetSummary(prev => prev ? { ...prev, todaySpent } : null);
  };

  const onRefresh = async () => {
    if (!firebaseUser) return;
    
    setRefreshing(true);
    try {
      // Reload data from Firebase
      const [budget, expenses] = await Promise.all([
        budgetService.getCurrentBudget(firebaseUser.uid),
        budgetService.getUserExpenses(firebaseUser.uid)
      ]);
      
      setCurrentBudget(budget);
      setRecentExpenses(expenses.slice(0, 10));
      
      if (budget) {
        calculateBudgetSummary(budget);
        calculateTodaySpent(expenses, budget);
      }
    } catch (error) {
      console.error('Error refreshing budget data:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    } finally {
      setRefreshing(false);
    }
  };

  const addExpense = () => {
    Alert.alert('Adicionar Gasto', 'Funcionalidade em desenvolvimento');
  };

  const initializeBudget = async () => {
    if (!firebaseUser) return;

    try {
      await budgetService.initializeDefaultBudget(firebaseUser.uid);
    } catch (error) {
      console.error('Error initializing budget:', error);
      Alert.alert('Erro', 'Não foi possível criar orçamento inicial');
    }
  };

  // Initialize budget for new users
  useEffect(() => {
    if (firebaseUser && !currentBudget && !loading) {
      initializeBudget();
    }
  }, [firebaseUser, currentBudget, loading]);

  const budgetHealthColor = () => {
    if (!budgetSummary) return '#E0E0E0';
    const percentage = (budgetSummary.spent / budgetSummary.totalBudget) * 100;
    if (percentage > 80) return '#FF6B6B';
    if (percentage > 60) return '#FFD93D';
    return '#6BCF7F';
  };

  const dailyBudgetHealthColor = () => {
    if (!budgetSummary) return '#E0E0E0';
    const percentage = (budgetSummary.todaySpent / budgetSummary.dailyLimit) * 100;
    if (percentage > 100) return '#FF6B6B';
    if (percentage > 80) return '#FFD93D';
    return '#6BCF7F';
  };

  const formatCurrency = (amount: number) => {
    const currency = budgetSummary?.currency || 'USD';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Acomodação': 'hotel',
      'Alimentação': 'restaurant',
      'Transporte': 'directions-bus',
      'Entretenimento': 'movie',
      'Outros': 'shopping-cart',
      'Food': 'restaurant',
      'Transport': 'directions-bus',
      'Entertainment': 'movie',
      'Shopping': 'shopping-cart',
      'Accommodation': 'hotel',
    };
    return icons[category] || 'attach-money';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando orçamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!budgetSummary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="account-balance-wallet" size={64} color="#E0E0E0" />
          <Text style={styles.emptyText}>Nenhum orçamento encontrado</Text>
          <Text style={styles.emptySubtext}>Criando seu primeiro orçamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Orçamento</Text>
          <TouchableOpacity onPress={addExpense} style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Budget Overview */}
        <View style={styles.budgetCard}>
          <Text style={styles.sectionTitle}>Orçamento Total</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Total</Text>
              <Text style={styles.budgetValue}>{formatCurrency(budgetSummary.totalBudget)}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Gasto</Text>
              <Text style={[styles.budgetValue, { color: budgetHealthColor() }]}>
                {formatCurrency(budgetSummary.spent)}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Restante</Text>
              <Text style={styles.budgetValue}>{formatCurrency(budgetSummary.remaining)}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min((budgetSummary.spent / budgetSummary.totalBudget) * 100, 100)}%`,
                    backgroundColor: budgetHealthColor()
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {((budgetSummary.spent / budgetSummary.totalBudget) * 100).toFixed(1)}% usado
            </Text>
          </View>
        </View>

        {/* Daily Budget */}
        <View style={styles.dailyBudgetCard}>
          <Text style={styles.sectionTitle}>Orçamento Diário</Text>
          <View style={styles.dailyBudgetRow}>
            <View style={styles.dailyBudgetItem}>
              <Text style={styles.dailyBudgetLabel}>Limite Diário</Text>
              <Text style={styles.dailyBudgetValue}>{formatCurrency(budgetSummary.dailyLimit)}</Text>
            </View>
            <View style={styles.dailyBudgetItem}>
              <Text style={styles.dailyBudgetLabel}>Gasto Hoje</Text>
              <Text style={[styles.dailyBudgetValue, { color: dailyBudgetHealthColor() }]}>
                {formatCurrency(budgetSummary.todaySpent)}
              </Text>
            </View>
          </View>

          {/* Daily Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min((budgetSummary.todaySpent / budgetSummary.dailyLimit) * 100, 100)}%`,
                    backgroundColor: dailyBudgetHealthColor()
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {((budgetSummary.todaySpent / budgetSummary.dailyLimit) * 100).toFixed(1)}% do limite diário
            </Text>
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.expensesCard}>
          <Text style={styles.sectionTitle}>Gastos Recentes</Text>
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseIcon}>
                  <MaterialIcons 
                    name={getCategoryIcon(expense.category) as any} 
                    size={24} 
                    color="#4A90E2" 
                  />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                  <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                </View>
                <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyExpenses}>
              <MaterialIcons name="receipt" size={32} color="#E0E0E0" />
              <Text style={styles.emptyText}>Nenhum gasto registrado</Text>
              <Text style={styles.emptySubtext}>Comece adicionando seus primeiros gastos</Text>
            </View>
          )}
        </View>

        {/* Budget Categories */}
        {currentBudget && currentBudget.categories && (
          <View style={styles.categoriesCard}>
            <Text style={styles.sectionTitle}>Por Categoria</Text>
            {currentBudget.categories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <MaterialIcons 
                      name={category.icon as any} 
                      size={20} 
                      color={category.color} 
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                  </Text>
                </View>
                <View style={styles.categoryProgressBackground}>
                  <View 
                    style={[
                      styles.categoryProgressFill, 
                      { 
                        width: `${Math.min((category.spent / category.allocated) * 100, 100)}%`,
                        backgroundColor: category.color
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={addExpense}>
            <MaterialIcons name="add-circle" size={24} color="#4A90E2" />
            <Text style={styles.actionText}>Adicionar Gasto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="analytics" size={24} color="#4A90E2" />
            <Text style={styles.actionText}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="settings" size={24} color="#4A90E2" />
            <Text style={styles.actionText}>Configurar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 5,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  budgetCard: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  dailyBudgetCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  dailyBudgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dailyBudgetItem: {
    alignItems: 'center',
  },
  dailyBudgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dailyBudgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  expensesCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 10,
    color: '#999',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  emptyExpenses: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  categoriesCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  categoryAmount: {
    fontSize: 12,
    color: '#666',
  },
  categoryProgressBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
});
