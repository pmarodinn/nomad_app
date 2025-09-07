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
export interface NomadProfile {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  currentLocation?: string;
  homeCountry: string;
  languages: string[];
  interests: string[];
  travelStyle: 'budget' | 'mid-range' | 'luxury' | 'mixed';
  isOpenToMeetups: boolean;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  joinedAt: Date;
  lastActive: Date;
  verificationStatus: 'unverified' | 'verified' | 'premium';
  rating: number;
  reviewCount: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorProfile: Pick<NomadProfile, 'displayName' | 'photoURL' | 'currentLocation'>;
  type: 'question' | 'tip' | 'meetup' | 'accommodation' | 'general';
  title: string;
  content: string;
  images?: string[];
  location?: string;
  tags: string[];
  likes: string[]; // Array of user IDs who liked
  comments: CommunityComment[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isPinned: boolean;
}

export interface CommunityComment {
  id: string;
  userId: string;
  authorProfile: Pick<NomadProfile, 'displayName' | 'photoURL'>;
  content: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseShare {
  id: string;
  createdBy: string;
  participants: ExpenseParticipant[];
  title: string;
  description?: string;
  totalAmount: number;
  currency: string;
  category: string;
  location?: string;
  date: Date;
  isSettled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseParticipant {
  userId: string;
  displayName: string;
  photoURL?: string;
  amountOwed: number;
  amountPaid: number;
  isPaid: boolean;
}

export interface Meetup {
  id: string;
  organizerId: string;
  organizerProfile: Pick<NomadProfile, 'displayName' | 'photoURL'>;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  dateTime: Date;
  maxParticipants?: number;
  currentParticipants: string[]; // Array of user IDs
  category: 'dining' | 'sightseeing' | 'nightlife' | 'sports' | 'cultural' | 'work' | 'other';
  isPublic: boolean;
  requirements?: string;
  cost?: number;
  currency?: string;
  images?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

class CommunityService {
  // Collections
  private profilesCollection = collection(db, 'nomadProfiles');
  private postsCollection = collection(db, 'communityPosts');
  private expenseSharesCollection = collection(db, 'expenseShares');
  private meetupsCollection = collection(db, 'meetups');

  // Nomad Profile Methods
  async createProfile(userId: string, profileData: Omit<NomadProfile, 'id' | 'userId' | 'joinedAt' | 'lastActive' | 'rating' | 'reviewCount'>): Promise<string> {
    try {
      const newProfile: Omit<NomadProfile, 'id'> = {
        userId,
        ...profileData,
        joinedAt: new Date(),
        lastActive: new Date(),
        rating: 0,
        reviewCount: 0,
      };

      const docRef = await addDoc(this.profilesCollection, {
        ...newProfile,
        joinedAt: Timestamp.fromDate(newProfile.joinedAt),
        lastActive: Timestamp.fromDate(newProfile.lastActive),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<NomadProfile | null> {
    try {
      const q = query(this.profilesCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        joinedAt: data.joinedAt.toDate(),
        lastActive: data.lastActive.toDate(),
      } as NomadProfile;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId: string, updates: Partial<NomadProfile>): Promise<void> {
    try {
      const profileRef = doc(this.profilesCollection, profileId);
      const updateData = {
        ...updates,
        lastActive: serverTimestamp(),
      };

      await updateDoc(profileRef, updateData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async searchProfiles(filters: {
    location?: string;
    languages?: string[];
    interests?: string[];
    travelStyle?: string;
  }): Promise<NomadProfile[]> {
    try {
      let q = query(this.profilesCollection, orderBy('lastActive', 'desc'), limit(20));

      // Note: Firestore has limitations with complex queries. In a real app,
      // you might want to use Algolia or another search service for advanced filtering
      
      const querySnapshot = await getDocs(q);
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinedAt: doc.data().joinedAt.toDate(),
        lastActive: doc.data().lastActive.toDate(),
      })) as NomadProfile[];

      // Apply client-side filtering (not ideal for large datasets)
      return profiles.filter(profile => {
        if (filters.location && !profile.currentLocation?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
        if (filters.travelStyle && profile.travelStyle !== filters.travelStyle) {
          return false;
        }
        if (filters.languages && !filters.languages.some(lang => profile.languages.includes(lang))) {
          return false;
        }
        if (filters.interests && !filters.interests.some(interest => profile.interests.includes(interest))) {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  }

  // Community Posts Methods
  async createPost(userId: string, postData: Omit<CommunityPost, 'id' | 'userId' | 'authorProfile' | 'likes' | 'comments' | 'createdAt' | 'updatedAt' | 'isActive' | 'isPinned'>): Promise<string> {
    try {
      const userProfile = await this.getProfile(userId);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      const newPost: Omit<CommunityPost, 'id'> = {
        userId,
        authorProfile: {
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
          currentLocation: userProfile.currentLocation,
        },
        ...postData,
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isPinned: false,
      };

      const docRef = await addDoc(this.postsCollection, {
        ...newPost,
        createdAt: Timestamp.fromDate(newPost.createdAt),
        updatedAt: Timestamp.fromDate(newPost.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getPosts(filters?: { type?: string; location?: string; tags?: string[] }): Promise<CommunityPost[]> {
    try {
      let q = query(
        this.postsCollection,
        where('isActive', '==', true),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      let posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as CommunityPost[];

      // Apply filters
      if (filters) {
        posts = posts.filter(post => {
          if (filters.type && post.type !== filters.type) {
            return false;
          }
          if (filters.location && !post.location?.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
          if (filters.tags && !filters.tags.some(tag => post.tags.includes(tag))) {
            return false;
          }
          return true;
        });
      }

      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  async likePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data() as CommunityPost;
      const likes = post.likes || [];
      
      if (!likes.includes(userId)) {
        likes.push(userId);
        await updateDoc(postRef, { likes });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data() as CommunityPost;
      const likes = (post.likes || []).filter(id => id !== userId);
      
      await updateDoc(postRef, { likes });
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  // Expense Sharing Methods
  async createExpenseShare(createdBy: string, expenseData: Omit<ExpenseShare, 'id' | 'createdBy' | 'isSettled' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newExpense: Omit<ExpenseShare, 'id'> = {
        createdBy,
        ...expenseData,
        isSettled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.expenseSharesCollection, {
        ...newExpense,
        date: Timestamp.fromDate(newExpense.date),
        createdAt: Timestamp.fromDate(newExpense.createdAt),
        updatedAt: Timestamp.fromDate(newExpense.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating expense share:', error);
      throw error;
    }
  }

  async getUserExpenseShares(userId: string): Promise<ExpenseShare[]> {
    try {
      // Get expenses where user is creator or participant
      const q1 = query(this.expenseSharesCollection, where('createdBy', '==', userId));
      const q2 = query(this.expenseSharesCollection, where('participants', 'array-contains-any', [userId]));

      const [createdSnapshot, participantSnapshot] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);

      const expenses = new Map();

      // Add created expenses
      createdSnapshot.docs.forEach(doc => {
        const data = doc.data();
        expenses.set(doc.id, {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });

      // Add participant expenses
      participantSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!expenses.has(doc.id)) {
          expenses.set(doc.id, {
            id: doc.id,
            ...data,
            date: data.date.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          });
        }
      });

      return Array.from(expenses.values()) as ExpenseShare[];
    } catch (error) {
      console.error('Error getting user expense shares:', error);
      throw error;
    }
  }

  async markExpenseAsPaid(expenseId: string, participantUserId: string): Promise<void> {
    try {
      const expenseRef = doc(this.expenseSharesCollection, expenseId);
      const expenseDoc = await getDoc(expenseRef);
      
      if (!expenseDoc.exists()) {
        throw new Error('Expense not found');
      }

      const expense = expenseDoc.data() as ExpenseShare;
      const participants = expense.participants.map(p => 
        p.userId === participantUserId ? { ...p, isPaid: true } : p
      );

      const isSettled = participants.every(p => p.isPaid);

      await updateDoc(expenseRef, {
        participants,
        isSettled,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking expense as paid:', error);
      throw error;
    }
  }

  // Meetups Methods
  async createMeetup(organizerId: string, meetupData: Omit<Meetup, 'id' | 'organizerId' | 'organizerProfile' | 'currentParticipants' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const organizerProfile = await this.getProfile(organizerId);
      if (!organizerProfile) {
        throw new Error('Organizer profile not found');
      }

      const newMeetup: Omit<Meetup, 'id'> = {
        organizerId,
        organizerProfile: {
          displayName: organizerProfile.displayName,
          photoURL: organizerProfile.photoURL,
        },
        ...meetupData,
        currentParticipants: [organizerId],
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.meetupsCollection, {
        ...newMeetup,
        dateTime: Timestamp.fromDate(newMeetup.dateTime),
        createdAt: Timestamp.fromDate(newMeetup.createdAt),
        updatedAt: Timestamp.fromDate(newMeetup.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating meetup:', error);
      throw error;
    }
  }

  async getMeetups(location?: string, category?: string): Promise<Meetup[]> {
    try {
      let q = query(
        this.meetupsCollection,
        where('status', '==', 'upcoming'),
        where('isPublic', '==', true),
        orderBy('dateTime', 'asc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      let meetups = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Meetup[];

      // Apply filters
      if (location) {
        meetups = meetups.filter(meetup => 
          meetup.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (category) {
        meetups = meetups.filter(meetup => meetup.category === category);
      }

      return meetups;
    } catch (error) {
      console.error('Error getting meetups:', error);
      throw error;
    }
  }

  async joinMeetup(meetupId: string, userId: string): Promise<void> {
    try {
      const meetupRef = doc(this.meetupsCollection, meetupId);
      const meetupDoc = await getDoc(meetupRef);
      
      if (!meetupDoc.exists()) {
        throw new Error('Meetup not found');
      }

      const meetup = meetupDoc.data() as Meetup;
      
      if (meetup.maxParticipants && meetup.currentParticipants.length >= meetup.maxParticipants) {
        throw new Error('Meetup is full');
      }

      if (!meetup.currentParticipants.includes(userId)) {
        const updatedParticipants = [...meetup.currentParticipants, userId];
        await updateDoc(meetupRef, {
          currentParticipants: updatedParticipants,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error joining meetup:', error);
      throw error;
    }
  }

  async leaveMeetup(meetupId: string, userId: string): Promise<void> {
    try {
      const meetupRef = doc(this.meetupsCollection, meetupId);
      const meetupDoc = await getDoc(meetupRef);
      
      if (!meetupDoc.exists()) {
        throw new Error('Meetup not found');
      }

      const meetup = meetupDoc.data() as Meetup;
      const updatedParticipants = meetup.currentParticipants.filter(id => id !== userId);
      
      await updateDoc(meetupRef, {
        currentParticipants: updatedParticipants,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error leaving meetup:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToRecentPosts(callback: (posts: CommunityPost[]) => void): () => void {
    const q = query(
      this.postsCollection,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as CommunityPost[];

      callback(posts);
    });
  }

  subscribeToUpcomingMeetups(callback: (meetups: Meetup[]) => void): () => void {
    const q = query(
      this.meetupsCollection,
      where('status', '==', 'upcoming'),
      where('isPublic', '==', true),
      orderBy('dateTime', 'asc'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const meetups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Meetup[];

      callback(meetups);
    });
  }

  subscribeToUserExpenseShares(userId: string, callback: (expenses: ExpenseShare[]) => void): () => void {
    // For simplicity, we'll subscribe to created expenses only
    // In a real app, you'd need a more complex query or use cloud functions
    const q = query(
      this.expenseSharesCollection,
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as ExpenseShare[];

      callback(expenses);
    });
  }
}

export const communityService = new CommunityService();
