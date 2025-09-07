import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { healthService, HealthMetric, Medication } from '../services/healthService';
import { budgetService, BudgetData, Expense } from '../services/budgetService';

interface AppData {
  // Health data
  healthMetrics: HealthMetric[];
  medications: Medication[];
  
  // Budget data
  currentBudget: BudgetData | null;
  recentExpenses: Expense[];
  
  // Loading states
  healthLoading: boolean;
  budgetLoading: boolean;
  
  // Methods
  refreshHealthData: () => Promise<void>;
  refreshBudgetData: () => Promise<void>;
  markMedicationTaken: (medicationId: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
}

const AppDataContext = createContext<AppData | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: React.ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const { firebaseUser } = useAuth();
  
  // Health state
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [healthLoading, setHealthLoading] = useState(true);
  
  // Budget state
  const [currentBudget, setCurrentBudget] = useState<BudgetData | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [budgetLoading, setBudgetLoading] = useState(true);

  // Health data subscriptions
  useEffect(() => {
    if (!firebaseUser) {
      setHealthMetrics([]);
      setMedications([]);
      setHealthLoading(false);
      return;
    }

    setHealthLoading(true);

    // Subscribe to health metrics
    const healthUnsubscribe = healthService.subscribeToHealthMetrics(
      firebaseUser.uid,
      (metrics) => {
        setHealthMetrics(metrics);
        setHealthLoading(false);
      }
    );

    // Subscribe to medications
    const medicationsUnsubscribe = healthService.subscribeToMedications(
      firebaseUser.uid,
      (meds) => {
        const updatedMeds = meds.map(med => ({
          ...med,
          timeLeft: healthService.calculateMedicationTimeLeft(med.nextDose)
        }));
        setMedications(updatedMeds);
      }
    );

    // Initialize default health data if none exists
    const initializeHealthData = async () => {
      try {
        const existingMetrics = await healthService.getHealthMetrics(firebaseUser.uid);
        if (existingMetrics.length === 0) {
          await healthService.initializeDefaultHealthMetrics(firebaseUser.uid);
        }
      } catch (error) {
        console.error('Error initializing health data:', error);
      }
    };

    initializeHealthData();

    return () => {
      healthUnsubscribe();
      medicationsUnsubscribe();
    };
  }, [firebaseUser]);

  // Budget data subscriptions
  useEffect(() => {
    if (!firebaseUser) {
      setCurrentBudget(null);
      setRecentExpenses([]);
      setBudgetLoading(false);
      return;
    }

    setBudgetLoading(true);

    // Subscribe to current budget
    const budgetUnsubscribe = budgetService.subscribeToCurrentBudget(
      firebaseUser.uid,
      (budget) => {
        setCurrentBudget(budget);
        setBudgetLoading(false);
      }
    );

    // Subscribe to recent expenses
    const expensesUnsubscribe = budgetService.subscribeToRecentExpenses(
      firebaseUser.uid,
      (expenses) => {
        setRecentExpenses(expenses);
      }
    );

    // Initialize default budget if none exists
    const initializeBudgetData = async () => {
      try {
        const existingBudget = await budgetService.getCurrentBudget(firebaseUser.uid);
        if (!existingBudget) {
          await budgetService.initializeDefaultBudget(firebaseUser.uid);
        }
      } catch (error) {
        console.error('Error initializing budget data:', error);
      }
    };

    initializeBudgetData();

    return () => {
      budgetUnsubscribe();
      expensesUnsubscribe();
    };
  }, [firebaseUser]);

  // Update medication time left every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (medications.length > 0) {
        const updatedMeds = medications.map(med => ({
          ...med,
          timeLeft: healthService.calculateMedicationTimeLeft(med.nextDose)
        }));
        setMedications(updatedMeds);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [medications]);

  // Methods
  const refreshHealthData = async () => {
    if (!firebaseUser) return;

    try {
      const [metrics, meds] = await Promise.all([
        healthService.getHealthMetrics(firebaseUser.uid),
        healthService.getMedications(firebaseUser.uid)
      ]);
      
      setHealthMetrics(metrics);
      setMedications(meds.map(med => ({
        ...med,
        timeLeft: healthService.calculateMedicationTimeLeft(med.nextDose)
      })));
    } catch (error) {
      console.error('Error refreshing health data:', error);
      throw error;
    }
  };

  const refreshBudgetData = async () => {
    if (!firebaseUser) return;

    try {
      const [budget, expenses] = await Promise.all([
        budgetService.getCurrentBudget(firebaseUser.uid),
        budgetService.getUserExpenses(firebaseUser.uid)
      ]);
      
      setCurrentBudget(budget);
      setRecentExpenses(expenses);
    } catch (error) {
      console.error('Error refreshing budget data:', error);
      throw error;
    }
  };

  const markMedicationTaken = async (medicationId: string) => {
    if (!firebaseUser) return;

    try {
      await healthService.markMedicationTaken(medicationId);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      throw error;
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!firebaseUser) return;

    try {
      await budgetService.addExpense(firebaseUser.uid, expense);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const value: AppData = {
    // Health data
    healthMetrics,
    medications,
    
    // Budget data
    currentBudget,
    recentExpenses,
    
    // Loading states
    healthLoading,
    budgetLoading,
    
    // Methods
    refreshHealthData,
    refreshBudgetData,
    markMedicationTaken,
    addExpense,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
