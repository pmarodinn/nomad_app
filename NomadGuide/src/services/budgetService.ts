import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

export interface BudgetData {
  id: string;
  userId: string;
  totalBudget: number;
  spent: number;
  currency: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  categories: BudgetCategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  userId: string;
  budgetId: string;
  amount: number;
  currency: string;
  category: string;
  categoryId: string;
  description: string;
  location?: string;
  date: Date;
  paymentMethod: 'card' | 'cash' | 'transfer' | 'other';
  isRecurring: boolean;
  tags: string[];
  createdAt: Date;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

class BudgetService {
  private budgetsCollection = 'budgets';
  private expensesCollection = 'expenses';
  private currencyRatesCollection = 'currencyRates';

  // Budget Methods
  async createBudget(userId: string, budget: Omit<BudgetData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, this.budgetsCollection), {
        ...budget,
        userId,
        startDate: Timestamp.fromDate(budget.startDate),
        endDate: Timestamp.fromDate(budget.endDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  async getUserBudgets(userId: string): Promise<BudgetData[]> {
    try {
      const q = query(
        collection(firestore, this.budgetsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as BudgetData[];
    } catch (error) {
      console.error('Error getting user budgets:', error);
      throw error;
    }
  }

  async getCurrentBudget(userId: string): Promise<BudgetData | null> {
    try {
      const now = new Date();
      const q = query(
        collection(firestore, this.budgetsCollection),
        where('userId', '==', userId),
        where('startDate', '<=', Timestamp.fromDate(now)),
        where('endDate', '>=', Timestamp.fromDate(now)),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as BudgetData;
    } catch (error) {
      console.error('Error getting current budget:', error);
      throw error;
    }
  }

  async updateBudget(budgetId: string, updates: Partial<BudgetData>): Promise<void> {
    try {
      const docRef = doc(firestore, this.budgetsCollection, budgetId);
      const updateData: any = { 
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  // Expense Methods
  async addExpense(userId: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, this.expensesCollection), {
        ...expense,
        userId,
        date: Timestamp.fromDate(expense.date),
        createdAt: Timestamp.now(),
      });

      // Update budget spent amount
      if (expense.budgetId) {
        await this.updateBudgetSpent(expense.budgetId, expense.amount, 'add');
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  async getUserExpenses(userId: string, startDate?: Date, endDate?: Date): Promise<Expense[]> {
    try {
      let q = query(
        collection(firestore, this.expensesCollection),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      if (startDate && endDate) {
        q = query(
          collection(firestore, this.expensesCollection),
          where('userId', '==', userId),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate)),
          orderBy('date', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Expense[];
    } catch (error) {
      console.error('Error getting user expenses:', error);
      throw error;
    }
  }

  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void> {
    try {
      const docRef = doc(firestore, this.expensesCollection, expenseId);
      const updateData: any = { ...updates };
      
      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async deleteExpense(expenseId: string): Promise<void> {
    try {
      // Get expense data before deletion
      const expenseDoc = await getDoc(doc(firestore, this.expensesCollection, expenseId));
      if (expenseDoc.exists()) {
        const expense = expenseDoc.data() as Expense;
        
        // Update budget spent amount
        if (expense.budgetId) {
          await this.updateBudgetSpent(expense.budgetId, expense.amount, 'subtract');
        }
      }

      await deleteDoc(doc(firestore, this.expensesCollection, expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  // Helper method to update budget spent amount
  private async updateBudgetSpent(budgetId: string, amount: number, operation: 'add' | 'subtract'): Promise<void> {
    try {
      const budgetDoc = await getDoc(doc(firestore, this.budgetsCollection, budgetId));
      if (budgetDoc.exists()) {
        const budget = budgetDoc.data() as BudgetData;
        const newSpent = operation === 'add' 
          ? budget.spent + amount 
          : budget.spent - amount;
        
        await updateDoc(doc(firestore, this.budgetsCollection, budgetId), {
          spent: Math.max(0, newSpent),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error updating budget spent:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToCurrentBudget(userId: string, callback: (budget: BudgetData | null) => void): () => void {
    const now = new Date();
    const q = query(
      collection(firestore, this.budgetsCollection),
      where('userId', '==', userId),
      where('startDate', '<=', Timestamp.fromDate(now)),
      where('endDate', '>=', Timestamp.fromDate(now)),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(null);
        return;
      }

      const doc = querySnapshot.docs[0];
      const budget = {
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as BudgetData;
      
      callback(budget);
    });
  }

  subscribeToRecentExpenses(userId: string, callback: (expenses: Expense[]) => void): () => void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const q = query(
      collection(firestore, this.expensesCollection),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Expense[];
      
      callback(expenses);
    });
  }

  // Currency conversion
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount;

    try {
      // Try to get rate from Firestore cache first
      const rateDoc = await getDoc(doc(firestore, this.currencyRatesCollection, `${fromCurrency}_${toCurrency}`));
      
      if (rateDoc.exists()) {
        const rateData = rateDoc.data();
        const lastUpdated = rateData.lastUpdated.toDate();
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        // Use cached rate if it's less than 1 hour old
        if (lastUpdated > oneHourAgo) {
          return amount * rateData.rate;
        }
      }

      // If no cached rate or it's too old, you would fetch from an API here
      // For now, return a mock conversion rate
      const mockRates: { [key: string]: number } = {
        'EUR_USD': 1.08,
        'USD_EUR': 0.92,
        'EUR_BRL': 5.5,
        'BRL_EUR': 0.18,
        'USD_BRL': 5.1,
        'BRL_USD': 0.20,
      };

      const rateKey = `${fromCurrency}_${toCurrency}`;
      const rate = mockRates[rateKey] || 1;

      // Cache the rate
      await setDoc(doc(firestore, this.currencyRatesCollection, rateKey), {
        from: fromCurrency,
        to: toCurrency,
        rate,
        lastUpdated: Timestamp.now(),
      });

      return amount * rate;
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount; // Return original amount if conversion fails
    }
  }

  // Initialize default budget for new users
  async initializeDefaultBudget(userId: string): Promise<void> {
    const defaultCategories: BudgetCategory[] = [
      { id: '1', name: 'Acomodação', allocated: 800, spent: 0, color: '#4A90E2', icon: 'hotel' },
      { id: '2', name: 'Alimentação', allocated: 400, spent: 0, color: '#6BCF7F', icon: 'restaurant' },
      { id: '3', name: 'Transporte', allocated: 200, spent: 0, color: '#FFD93D', icon: 'directions-bus' },
      { id: '4', name: 'Entretenimento', allocated: 150, spent: 0, color: '#FF9800', icon: 'movie' },
      { id: '5', name: 'Outros', allocated: 150, spent: 0, color: '#9C27B0', icon: 'shopping-cart' },
    ];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const defaultBudget: Omit<BudgetData, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      totalBudget: 1700,
      spent: 0,
      currency: 'EUR',
      period: 'monthly',
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: defaultCategories,
    };

    try {
      await this.createBudget(userId, defaultBudget);
    } catch (error) {
      console.error('Error initializing default budget:', error);
      throw error;
    }
  }

  // Analytics methods
  async getExpensesByCategory(userId: string, budgetId: string): Promise<{ [category: string]: number }> {
    try {
      const q = query(
        collection(firestore, this.expensesCollection),
        where('userId', '==', userId),
        where('budgetId', '==', budgetId)
      );
      
      const querySnapshot = await getDocs(q);
      const expensesByCategory: { [category: string]: number } = {};
      
      querySnapshot.docs.forEach(doc => {
        const expense = doc.data() as Expense;
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
      });
      
      return expensesByCategory;
    } catch (error) {
      console.error('Error getting expenses by category:', error);
      throw error;
    }
  }
}

export const budgetService = new BudgetService();
