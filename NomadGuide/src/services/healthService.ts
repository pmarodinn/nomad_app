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

export interface HealthMetric {
  id: string;
  userId: string;
  type: 'medication' | 'exercise' | 'sleep' | 'water' | 'weight';
  title: string;
  value: string;
  target?: string;
  status: 'good' | 'warning' | 'danger';
  lastUpdate: Date;
  createdAt: Date;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
  timeLeft: string;
  isActive: boolean;
  createdAt: Date;
}

export interface HealthGoal {
  id: string;
  userId: string;
  name: string;
  type: 'exercise' | 'water' | 'sleep' | 'weight';
  target: number;
  unit: string;
  currentProgress: number;
  weeklyProgress: number;
  isActive: boolean;
  createdAt: Date;
}

class HealthService {
  private healthMetricsCollection = 'healthMetrics';
  private medicationsCollection = 'medications';
  private healthGoalsCollection = 'healthGoals';

  // Health Metrics Methods
  async createHealthMetric(userId: string, metric: Omit<HealthMetric, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, this.healthMetricsCollection), {
        ...metric,
        userId,
        lastUpdate: Timestamp.fromDate(metric.lastUpdate),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating health metric:', error);
      throw error;
    }
  }

  async getHealthMetrics(userId: string): Promise<HealthMetric[]> {
    try {
      const q = query(
        collection(firestore, this.healthMetricsCollection),
        where('userId', '==', userId),
        orderBy('lastUpdate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdate: doc.data().lastUpdate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as HealthMetric[];
    } catch (error) {
      console.error('Error getting health metrics:', error);
      throw error;
    }
  }

  async updateHealthMetric(metricId: string, updates: Partial<HealthMetric>): Promise<void> {
    try {
      const docRef = doc(firestore, this.healthMetricsCollection, metricId);
      const updateData: any = { ...updates };
      
      if (updates.lastUpdate) {
        updateData.lastUpdate = Timestamp.fromDate(updates.lastUpdate);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating health metric:', error);
      throw error;
    }
  }

  async deleteHealthMetric(metricId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, this.healthMetricsCollection, metricId));
    } catch (error) {
      console.error('Error deleting health metric:', error);
      throw error;
    }
  }

  // Medication Methods
  async createMedication(userId: string, medication: Omit<Medication, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, this.medicationsCollection), {
        ...medication,
        userId,
        nextDose: Timestamp.fromDate(medication.nextDose),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating medication:', error);
      throw error;
    }
  }

  async getMedications(userId: string): Promise<Medication[]> {
    try {
      const q = query(
        collection(firestore, this.medicationsCollection),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('nextDose', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        nextDose: doc.data().nextDose.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Medication[];
    } catch (error) {
      console.error('Error getting medications:', error);
      throw error;
    }
  }

  async updateMedication(medicationId: string, updates: Partial<Medication>): Promise<void> {
    try {
      const docRef = doc(firestore, this.medicationsCollection, medicationId);
      const updateData: any = { ...updates };
      
      if (updates.nextDose) {
        updateData.nextDose = Timestamp.fromDate(updates.nextDose);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  }

  async markMedicationTaken(medicationId: string): Promise<void> {
    try {
      const docRef = doc(firestore, this.medicationsCollection, medicationId);
      const medicationDoc = await getDoc(docRef);
      
      if (medicationDoc.exists()) {
        const medicationData = medicationDoc.data();
        const currentNextDose = medicationData.nextDose instanceof Timestamp 
          ? medicationData.nextDose.toDate() 
          : new Date(medicationData.nextDose);
        
        // Calculate next dose time (24 hours later for daily medications)
        const newNextDose = new Date(currentNextDose.getTime() + 24 * 60 * 60 * 1000);
        
        await updateDoc(docRef, {
          nextDose: Timestamp.fromDate(newNextDose),
          timeLeft: this.calculateTimeLeft(newNextDose),
        });
      }
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      throw error;
    }
  }

  // Health Goals Methods
  async createHealthGoal(userId: string, goal: Omit<HealthGoal, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, this.healthGoalsCollection), {
        ...goal,
        userId,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating health goal:', error);
      throw error;
    }
  }

  async getHealthGoals(userId: string): Promise<HealthGoal[]> {
    try {
      const q = query(
        collection(firestore, this.healthGoalsCollection),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as HealthGoal[];
    } catch (error) {
      console.error('Error getting health goals:', error);
      throw error;
    }
  }

  async updateHealthGoal(goalId: string, updates: Partial<HealthGoal>): Promise<void> {
    try {
      const docRef = doc(firestore, this.healthGoalsCollection, goalId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating health goal:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToHealthMetrics(userId: string, callback: (metrics: HealthMetric[]) => void): () => void {
    const q = query(
      collection(firestore, this.healthMetricsCollection),
      where('userId', '==', userId),
      orderBy('lastUpdate', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const metrics = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdate: doc.data().lastUpdate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as HealthMetric[];
      
      callback(metrics);
    });
  }

  subscribeToMedications(userId: string, callback: (medications: Medication[]) => void): () => void {
    const q = query(
      collection(firestore, this.medicationsCollection),
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('nextDose', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const medications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        nextDose: doc.data().nextDose.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Medication[];
      
      callback(medications);
    });
  }

  // Helper methods
  private calculateTimeLeft(nextDose: Date): string {
    const now = new Date();
    const timeDiff = nextDose.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Agora';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  calculateMedicationTimeLeft(nextDose: Date): string {
    return this.calculateTimeLeft(nextDose);
  }

  // Initialize default health metrics for new users
  async initializeDefaultHealthMetrics(userId: string): Promise<void> {
    const defaultMetrics: Omit<HealthMetric, 'id' | 'userId' | 'createdAt'>[] = [
      {
        type: 'sleep',
        title: 'Sono',
        value: '0h',
        target: '8h',
        status: 'warning',
        lastUpdate: new Date(),
      },
      {
        type: 'water',
        title: 'Hidratação',
        value: '0L',
        target: '2.5L',
        status: 'warning',
        lastUpdate: new Date(),
      },
      {
        type: 'exercise',
        title: 'Exercício',
        value: '0 min',
        target: '60 min',
        status: 'warning',
        lastUpdate: new Date(),
      },
    ];

    try {
      for (const metric of defaultMetrics) {
        await this.createHealthMetric(userId, metric);
      }
    } catch (error) {
      console.error('Error initializing default health metrics:', error);
      throw error;
    }
  }
}

export const healthService = new HealthService();
