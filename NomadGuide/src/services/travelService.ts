import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore as db } from '../config/firebase';

// Interfaces
export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  destinations: Destination[];
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  isPublic: boolean;
  tags: string[];
  collaborators?: string[]; // User IDs who can edit
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  arrivalDate: Date;
  departureDate: Date;
  accommodations: Accommodation[];
  activities: Activity[];
  transportation?: Transportation[];
  notes?: string;
  budget: number;
  actualSpent?: number;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'guesthouse' | 'camping' | 'other';
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  checkIn: Date;
  checkOut: Date;
  pricePerNight: number;
  currency: string;
  rating?: number;
  bookingUrl?: string;
  bookingReference?: string;
  notes?: string;
  amenities: string[];
  isBooked: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  category: 'sightseeing' | 'adventure' | 'cultural' | 'food' | 'nightlife' | 'shopping' | 'relaxation' | 'other';
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  date: Date;
  duration?: number; // in minutes
  cost?: number;
  currency?: string;
  bookingUrl?: string;
  bookingReference?: string;
  priority: 'must-do' | 'want-to-do' | 'maybe';
  isCompleted: boolean;
  rating?: number;
  notes?: string;
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'other';
  from: string;
  to: string;
  departureTime: Date;
  arrivalTime: Date;
  provider?: string;
  bookingReference?: string;
  cost: number;
  currency: string;
  seatNumber?: string;
  notes?: string;
  isBooked: boolean;
}

export interface FlightDeal {
  id: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  departureDate: Date;
  returnDate?: Date;
  price: number;
  currency: string;
  airline: string;
  duration: string;
  stops: number;
  dealUrl: string;
  validUntil: Date;
  isRoundTrip: boolean;
  createdAt: Date;
}

export interface TravelTip {
  id: string;
  userId: string;
  authorName: string;
  country: string;
  city?: string;
  category: 'visa' | 'transport' | 'accommodation' | 'food' | 'culture' | 'safety' | 'money' | 'general';
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisaRequirement {
  id: string;
  fromCountry: string;
  toCountry: string;
  visaType: 'none' | 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required';
  maxStayDays?: number;
  cost?: number;
  currency?: string;
  processingTimeDays?: number;
  requirements: string[];
  notes?: string;
  lastUpdated: Date;
}

class TravelService {
  // Collections
  private tripsCollection = collection(db, 'trips');
  private flightDealsCollection = collection(db, 'flightDeals');
  private travelTipsCollection = collection(db, 'travelTips');
  private visaRequirementsCollection = collection(db, 'visaRequirements');

  // Trip Management
  async createTrip(userId: string, tripData: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newTrip: Omit<Trip, 'id'> = {
        userId,
        ...tripData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.tripsCollection, {
        ...newTrip,
        startDate: Timestamp.fromDate(newTrip.startDate),
        endDate: Timestamp.fromDate(newTrip.endDate),
        destinations: newTrip.destinations.map(dest => ({
          ...dest,
          arrivalDate: Timestamp.fromDate(dest.arrivalDate),
          departureDate: Timestamp.fromDate(dest.departureDate),
          accommodations: dest.accommodations.map(acc => ({
            ...acc,
            checkIn: Timestamp.fromDate(acc.checkIn),
            checkOut: Timestamp.fromDate(acc.checkOut),
          })),
          activities: dest.activities.map(act => ({
            ...act,
            date: Timestamp.fromDate(act.date),
          })),
          transportation: dest.transportation?.map(trans => ({
            ...trans,
            departureTime: Timestamp.fromDate(trans.departureTime),
            arrivalTime: Timestamp.fromDate(trans.arrivalTime),
          })),
        })),
        createdAt: Timestamp.fromDate(newTrip.createdAt),
        updatedAt: Timestamp.fromDate(newTrip.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    try {
      const q = query(
        this.tripsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          destinations: data.destinations.map((dest: any) => ({
            ...dest,
            arrivalDate: dest.arrivalDate.toDate(),
            departureDate: dest.departureDate.toDate(),
            accommodations: dest.accommodations.map((acc: any) => ({
              ...acc,
              checkIn: acc.checkIn.toDate(),
              checkOut: acc.checkOut.toDate(),
            })),
            activities: dest.activities.map((act: any) => ({
              ...act,
              date: act.date.toDate(),
            })),
            transportation: dest.transportation?.map((trans: any) => ({
              ...trans,
              departureTime: trans.departureTime.toDate(),
              arrivalTime: trans.arrivalTime.toDate(),
            })),
          })),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Trip;
      });
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw error;
    }
  }

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    try {
      const tripRef = doc(this.tripsCollection, tripId);
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Convert dates to Timestamps if they exist in updates
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }

      await updateDoc(tripRef, updateData);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.tripsCollection, tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  async addActivityToTrip(tripId: string, destinationId: string, activity: Omit<Activity, 'id'>): Promise<void> {
    try {
      const tripRef = doc(this.tripsCollection, tripId);
      const tripDoc = await getDoc(tripRef);
      
      if (!tripDoc.exists()) {
        throw new Error('Trip not found');
      }

      const trip = tripDoc.data() as Trip;
      const updatedDestinations = trip.destinations.map(dest => {
        if (dest.id === destinationId) {
          const newActivity: Activity = {
            ...activity,
            id: `activity_${Date.now()}`,
          };
          return {
            ...dest,
            activities: [...dest.activities, newActivity],
          };
        }
        return dest;
      });

      await updateDoc(tripRef, {
        destinations: updatedDestinations,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding activity to trip:', error);
      throw error;
    }
  }

  async markActivityCompleted(tripId: string, destinationId: string, activityId: string, rating?: number, notes?: string): Promise<void> {
    try {
      const tripRef = doc(this.tripsCollection, tripId);
      const tripDoc = await getDoc(tripRef);
      
      if (!tripDoc.exists()) {
        throw new Error('Trip not found');
      }

      const trip = tripDoc.data() as Trip;
      const updatedDestinations = trip.destinations.map(dest => {
        if (dest.id === destinationId) {
          const updatedActivities = dest.activities.map(act => {
            if (act.id === activityId) {
              return {
                ...act,
                isCompleted: true,
                rating,
                notes: notes || act.notes,
              };
            }
            return act;
          });
          return {
            ...dest,
            activities: updatedActivities,
          };
        }
        return dest;
      });

      await updateDoc(tripRef, {
        destinations: updatedDestinations,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking activity as completed:', error);
      throw error;
    }
  }

  // Flight Deals
  async getFlightDeals(from?: string, to?: string, departureDate?: Date): Promise<FlightDeal[]> {
    try {
      let q = query(
        this.flightDealsCollection,
        where('validUntil', '>', new Date()),
        orderBy('validUntil', 'asc'),
        orderBy('price', 'asc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      let deals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        departureDate: doc.data().departureDate.toDate(),
        returnDate: doc.data().returnDate?.toDate(),
        validUntil: doc.data().validUntil.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as FlightDeal[];

      // Apply filters
      if (from) {
        deals = deals.filter(deal => 
          deal.from.toLowerCase().includes(from.toLowerCase()) ||
          deal.fromCode.toLowerCase().includes(from.toLowerCase())
        );
      }

      if (to) {
        deals = deals.filter(deal => 
          deal.to.toLowerCase().includes(to.toLowerCase()) ||
          deal.toCode.toLowerCase().includes(to.toLowerCase())
        );
      }

      if (departureDate) {
        const targetDate = departureDate.toDateString();
        deals = deals.filter(deal => 
          deal.departureDate.toDateString() === targetDate
        );
      }

      return deals;
    } catch (error) {
      console.error('Error getting flight deals:', error);
      throw error;
    }
  }

  // Travel Tips
  async createTravelTip(userId: string, authorName: string, tipData: Omit<TravelTip, 'id' | 'userId' | 'authorName' | 'likes' | 'isVerified' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newTip: Omit<TravelTip, 'id'> = {
        userId,
        authorName,
        ...tipData,
        likes: [],
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.travelTipsCollection, {
        ...newTip,
        createdAt: Timestamp.fromDate(newTip.createdAt),
        updatedAt: Timestamp.fromDate(newTip.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating travel tip:', error);
      throw error;
    }
  }

  async getTravelTips(country?: string, category?: string): Promise<TravelTip[]> {
    try {
      let q = query(
        this.travelTipsCollection,
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      let tips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as TravelTip[];

      // Apply filters
      if (country) {
        tips = tips.filter(tip => 
          tip.country.toLowerCase().includes(country.toLowerCase())
        );
      }

      if (category) {
        tips = tips.filter(tip => tip.category === category);
      }

      return tips;
    } catch (error) {
      console.error('Error getting travel tips:', error);
      throw error;
    }
  }

  async likeTravelTip(tipId: string, userId: string): Promise<void> {
    try {
      const tipRef = doc(this.travelTipsCollection, tipId);
      const tipDoc = await getDoc(tipRef);
      
      if (!tipDoc.exists()) {
        throw new Error('Travel tip not found');
      }

      const tip = tipDoc.data() as TravelTip;
      const likes = tip.likes || [];
      
      if (!likes.includes(userId)) {
        likes.push(userId);
        await updateDoc(tipRef, { likes });
      }
    } catch (error) {
      console.error('Error liking travel tip:', error);
      throw error;
    }
  }

  // Visa Requirements
  async getVisaRequirements(fromCountry: string, toCountry: string): Promise<VisaRequirement | null> {
    try {
      const q = query(
        this.visaRequirementsCollection,
        where('fromCountry', '==', fromCountry),
        where('toCountry', '==', toCountry)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated.toDate(),
      } as VisaRequirement;
    } catch (error) {
      console.error('Error getting visa requirements:', error);
      throw error;
    }
  }

  // Helper methods
  getCurrentTrip(userId: string): Promise<Trip | null> {
    return this.getUserTrips(userId).then(trips => {
      const activeTrip = trips.find(trip => trip.status === 'active');
      if (activeTrip) return activeTrip;
      
      // If no active trip, return the next upcoming trip
      const upcomingTrips = trips
        .filter(trip => trip.status === 'planning' && trip.startDate > new Date())
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      
      return upcomingTrips[0] || null;
    });
  }

  async initializeDefaultTrip(userId: string): Promise<string> {
    try {
      const defaultTrip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        title: 'Minha Primeira Viagem',
        description: 'Planeje sua viagem dos sonhos!',
        destinations: [],
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // 37 days from now
        budget: 5000,
        currency: 'BRL',
        status: 'planning',
        isPublic: false,
        tags: ['primeira-viagem'],
      };

      return await this.createTrip(userId, defaultTrip);
    } catch (error) {
      console.error('Error initializing default trip:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToUserTrips(userId: string, callback: (trips: Trip[]) => void): () => void {
    const q = query(
      this.tripsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const trips = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          destinations: data.destinations.map((dest: any) => ({
            ...dest,
            arrivalDate: dest.arrivalDate.toDate(),
            departureDate: dest.departureDate.toDate(),
            accommodations: dest.accommodations.map((acc: any) => ({
              ...acc,
              checkIn: acc.checkIn.toDate(),
              checkOut: acc.checkOut.toDate(),
            })),
            activities: dest.activities.map((act: any) => ({
              ...act,
              date: act.date.toDate(),
            })),
            transportation: dest.transportation?.map((trans: any) => ({
              ...trans,
              departureTime: trans.departureTime.toDate(),
              arrivalTime: trans.arrivalTime.toDate(),
            })),
          })),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Trip;
      });

      callback(trips);
    });
  }

  subscribeToFlightDeals(callback: (deals: FlightDeal[]) => void): () => void {
    const q = query(
      this.flightDealsCollection,
      where('validUntil', '>', new Date()),
      orderBy('validUntil', 'asc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        departureDate: doc.data().departureDate.toDate(),
        returnDate: doc.data().returnDate?.toDate(),
        validUntil: doc.data().validUntil.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as FlightDeal[];

      callback(deals);
    });
  }
}

export const travelService = new TravelService();
