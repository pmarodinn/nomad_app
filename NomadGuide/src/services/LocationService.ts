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
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../config/firebase';
import { Location, LocationCategory } from '../types';

export class LocationService {
  private static readonly COLLECTION_NAME = 'locations';
  private static readonly STORAGE_PATH = 'location-photos';

  // Criar nova localização
  static async createLocation(locationData: Omit<Location, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, this.COLLECTION_NAME), {
        ...locationData,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar localização:', error);
      throw error;
    }
  }

  // Buscar localização por ID
  static async getLocationById(id: string): Promise<Location | null> {
    try {
      const docRef = doc(firestore, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Location;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      throw error;
    }
  }

  // Buscar localizações próximas
  static async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    category?: LocationCategory
  ): Promise<Location[]> {
    try {
      // Calcular bounds aproximados para otimizar a consulta
      const latDelta = radiusKm / 111.12; // 1 grau ≈ 111.12 km

      let q = query(
        collection(firestore, this.COLLECTION_NAME),
        where('latitude', '>=', latitude - latDelta),
        where('latitude', '<=', latitude + latDelta),
        orderBy('latitude'),
        limit(50)
      );

      if (category) {
        q = query(q, where('category', '==', category));
      }

      const querySnapshot = await getDocs(q);
      const locations: Location[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const location = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Location;

        // Filtrar por longitude e distância real
        const distance = this.calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );

        if (distance <= radiusKm) {
          locations.push(location);
        }
      });

      return locations.sort((a, b) => {
        const distA = this.calculateDistance(latitude, longitude, a.latitude, a.longitude);
        const distB = this.calculateDistance(latitude, longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    } catch (error) {
      console.error('Erro ao buscar localizações próximas:', error);
      throw error;
    }
  }

  // Buscar localizações por categoria
  static async getLocationsByCategory(
    category: LocationCategory,
    limitCount: number = 20
  ): Promise<Location[]> {
    try {
      const q = query(
        collection(firestore, this.COLLECTION_NAME),
        where('category', '==', category),
        orderBy('rating', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const locations: Location[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locations.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Location);
      });

      return locations;
    } catch (error) {
      console.error('Erro ao buscar localizações por categoria:', error);
      throw error;
    }
  }

  // Atualizar localização
  static async updateLocation(id: string, updates: Partial<Location>): Promise<void> {
    try {
      const docRef = doc(firestore, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      throw error;
    }
  }

  // Deletar localização
  static async deleteLocation(id: string): Promise<void> {
    try {
      // Primeiro, buscar a localização para obter as fotos
      const location = await this.getLocationById(id);
      
      if (location && location.photos.length > 0) {
        // Deletar fotos do Storage
        await Promise.all(
          location.photos.map(async (photoUrl) => {
            try {
              const photoRef = ref(storage, photoUrl);
              await deleteObject(photoRef);
            } catch (error) {
              console.warn('Erro ao deletar foto:', error);
            }
          })
        );
      }

      // Deletar documento do Firestore
      const docRef = doc(firestore, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar localização:', error);
      throw error;
    }
  }

  // Upload de foto
  static async uploadPhoto(file: Blob, locationId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${locationId}_${timestamp}`;
      const photoRef = ref(storage, `${this.STORAGE_PATH}/${fileName}`);
      
      await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(photoRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      throw error;
    }
  }

  // Calcular distância entre dois pontos (Haversine formula)
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Buscar localizações por texto
  static async searchLocations(searchTerm: string): Promise<Location[]> {
    try {
      // Firestore não tem busca full-text nativa, então fazemos múltiplas consultas
      const searchLower = searchTerm.toLowerCase();
      
      const q = query(
        collection(firestore, this.COLLECTION_NAME),
        orderBy('name'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const locations: Location[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const location = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Location;

        // Filtrar localmente por nome e descrição
        if (
          location.name.toLowerCase().includes(searchLower) ||
          location.description.toLowerCase().includes(searchLower)
        ) {
          locations.push(location);
        }
      });

      return locations;
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      throw error;
    }
  }
}
