import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { budgetService } from '../services/budgetService';
import { useAuth } from '../contexts/AuthContext';

export default function FirestoreDebugScreen() {
  const { firebaseUser } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const testQueries = async () => {
    if (!firebaseUser) return;
    
    setLoading(true);
    setErrors([]);
    const errorList: string[] = [];

    // Test 1: getUserBudgets
    try {
      console.log('Testing getUserBudgets...');
      await budgetService.getUserBudgets(firebaseUser.uid);
      console.log('✅ getUserBudgets: OK');
    } catch (error: any) {
      const errorMsg = `❌ getUserBudgets: ${error.message}`;
      console.error(errorMsg);
      errorList.push(errorMsg);
      
      // Extract index URL if available
      if (error.message.includes('console.firebase.google.com')) {
        const urlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
        if (urlMatch) {
          errorList.push(`🔗 Create index: ${urlMatch[0]}`);
        }
      }
    }

    // Test 2: getCurrentBudget
    try {
      console.log('Testing getCurrentBudget...');
      await budgetService.getCurrentBudget(firebaseUser.uid);
      console.log('✅ getCurrentBudget: OK');
    } catch (error: any) {
      const errorMsg = `❌ getCurrentBudget: ${error.message}`;
      console.error(errorMsg);
      errorList.push(errorMsg);
      
      if (error.message.includes('console.firebase.google.com')) {
        const urlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
        if (urlMatch) {
          errorList.push(`🔗 Create index: ${urlMatch[0]}`);
        }
      }
    }

    // Test 3: getUserExpenses
    try {
      console.log('Testing getUserExpenses...');
      await budgetService.getUserExpenses(firebaseUser.uid);
      console.log('✅ getUserExpenses: OK');
    } catch (error: any) {
      const errorMsg = `❌ getUserExpenses: ${error.message}`;
      console.error(errorMsg);
      errorList.push(errorMsg);
      
      if (error.message.includes('console.firebase.google.com')) {
        const urlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
        if (urlMatch) {
          errorList.push(`🔗 Create index: ${urlMatch[0]}`);
        }
      }
    }

    setErrors(errorList);
    setLoading(false);

    if (errorList.length > 0) {
      Alert.alert(
        'Firestore Index Required',
        'Some queries require indexes. Check console for creation URLs.',
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      testQueries();
    }
  }, [firebaseUser]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Firestore Index Debug
      </Text>
      
      {loading && <Text>Testing queries...</Text>}
      
      <ScrollView>
        {errors.map((error, index) => (
          <Text 
            key={index} 
            style={{ 
              marginBottom: 10, 
              fontSize: 12, 
              color: error.includes('❌') ? 'red' : error.includes('🔗') ? 'blue' : 'black'
            }}
          >
            {error}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
