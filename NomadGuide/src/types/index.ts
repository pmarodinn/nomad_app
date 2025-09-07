// Tipos base para o usuário
export interface User {
  id: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para localização
export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: LocationCategory;
  rating: number;
  photos: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LocationCategory {
  RESTAURANT = 'restaurant',
  ATTRACTION = 'attraction',
  ACCOMMODATION = 'accommodation',
  TRANSPORT = 'transport',
  SHOPPING = 'shopping',
  NIGHTLIFE = 'nightlife',
  NATURE = 'nature',
  CULTURAL = 'cultural'
}

// Tipos para viagem
export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  locations: string[]; // IDs das localizações
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para avaliação
export interface Review {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para navegação
export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
  Search: undefined;
  TripDetails: { tripId: string };
  LocationDetails: { locationId: string };
  AddLocation: undefined;
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  MapTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};
