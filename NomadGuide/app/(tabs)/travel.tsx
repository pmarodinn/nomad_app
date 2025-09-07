import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/AuthContext';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  budget: number;
  currency: string;
  participants: number;
}

interface FlightDeal {
  id: string;
  from: string;
  to: string;
  departure: Date;
  return?: Date;
  price: number;
  currency: string;
  airline: string;
  duration: string;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  priceLevel: number;
  climate: string;
  internetSpeed: number;
  safetyRating: number;
  nomadScore: number;
}

export default function TravelScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'trips' | 'deals' | 'destinations' | 'planning'>('trips');
  const [searchQuery, setSearchQuery] = useState('');

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Work from Lisbon',
      destination: 'Lisboa, Portugal',
      startDate: new Date(2024, 2, 15),
      endDate: new Date(2024, 3, 15),
      status: 'active',
      budget: 2500,
      currency: 'EUR',
      participants: 1,
    },
    {
      id: '2',
      title: 'Bali Retreat',
      destination: 'Bali, Indonésia',
      startDate: new Date(2024, 4, 1),
      endDate: new Date(2024, 5, 1),
      status: 'planned',
      budget: 1800,
      currency: 'USD',
      participants: 2,
    },
    {
      id: '3',
      title: 'Berlin Tech Hub',
      destination: 'Berlim, Alemanha',
      startDate: new Date(2024, 1, 1),
      endDate: new Date(2024, 1, 28),
      status: 'completed',
      budget: 2200,
      currency: 'EUR',
      participants: 1,
    },
  ]);

  const [flightDeals, setFlightDeals] = useState<FlightDeal[]>([
    {
      id: '1',
      from: 'Lisboa',
      to: 'Barcelona',
      departure: new Date(2024, 3, 20),
      return: new Date(2024, 3, 27),
      price: 89,
      currency: 'EUR',
      airline: 'TAP Air',
      duration: '1h 30m',
    },
    {
      id: '2',
      from: 'Porto',
      to: 'Berlim',
      departure: new Date(2024, 4, 5),
      return: new Date(2024, 4, 12),
      price: 156,
      currency: 'EUR',
      airline: 'Ryanair',
      duration: '2h 45m',
    },
  ]);

  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: '1',
      name: 'Madeira',
      country: 'Portugal',
      image: '',
      rating: 4.8,
      priceLevel: 2,
      climate: 'Subtropical',
      internetSpeed: 85,
      safetyRating: 9,
      nomadScore: 8.5,
    },
    {
      id: '2',
      name: 'Canggu',
      country: 'Indonésia',
      image: '',
      rating: 4.6,
      priceLevel: 1,
      climate: 'Tropical',
      internetSpeed: 45,
      safetyRating: 7,
      nomadScore: 8.2,
    },
    {
      id: '3',
      name: 'Tbilisi',
      country: 'Geórgia',
      image: '',
      rating: 4.4,
      priceLevel: 1,
      climate: 'Continental',
      internetSpeed: 78,
      safetyRating: 8,
      nomadScore: 7.9,
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aqui você faria a chamada para a API para atualizar os dados
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#6BCF7F';
      case 'planned': return '#4A90E2';
      case 'completed': return '#999';
      default: return '#E0E0E0';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Em andamento';
      case 'planned': return 'Planejada';
      case 'completed': return 'Concluída';
      default: return 'Desconhecido';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getPriceLevelText = (level: number) => {
    return '€'.repeat(level) + '€'.repeat(3 - level).replace(/€/g, '·');
  };

  const handleCreateTrip = () => {
    Alert.alert('Nova Viagem', 'Funcionalidade em desenvolvimento');
  };

  const handleBookFlight = (dealId: string) => {
    Alert.alert('Reservar Voo', 'Redirecionando para reserva...');
  };

  const renderTripsTab = () => (
    <View style={styles.tabContent}>
      {trips.map((trip) => (
        <View key={trip.id} style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripDestination}>{trip.destination}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
              <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
              <MaterialIcons name="date-range" size={16} color="#666" />
              <Text style={styles.tripDetailText}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
            
            <View style={styles.tripDetailItem}>
              <MaterialIcons name="account-balance-wallet" size={16} color="#666" />
              <Text style={styles.tripDetailText}>
                {trip.budget.toFixed(0)} {trip.currency}
              </Text>
            </View>
            
            <View style={styles.tripDetailItem}>
              <MaterialIcons name="people" size={16} color="#666" />
              <Text style={styles.tripDetailText}>
                {trip.participants} {trip.participants === 1 ? 'pessoa' : 'pessoas'}
              </Text>
            </View>
          </View>

          <View style={styles.tripActions}>
            <TouchableOpacity style={styles.tripActionButton}>
              <MaterialIcons name="edit" size={18} color="#4A90E2" />
              <Text style={styles.tripActionText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.tripActionButton}>
              <MaterialIcons name="share" size={18} color="#4A90E2" />
              <Text style={styles.tripActionText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderDealsTab = () => (
    <View style={styles.tabContent}>
      {flightDeals.map((deal) => (
        <View key={deal.id} style={styles.dealCard}>
          <View style={styles.dealHeader}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>{deal.from} → {deal.to}</Text>
              <Text style={styles.airlineText}>{deal.airline}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.dealPrice}>{deal.price} {deal.currency}</Text>
              <Text style={styles.durationText}>{deal.duration}</Text>
            </View>
          </View>

          <View style={styles.dealDetails}>
            <View style={styles.dealDetailItem}>
              <MaterialIcons name="flight-takeoff" size={16} color="#666" />
              <Text style={styles.dealDetailText}>
                Ida: {formatDate(deal.departure)}
              </Text>
            </View>
            
            {deal.return && (
              <View style={styles.dealDetailItem}>
                <MaterialIcons name="flight-land" size={16} color="#666" />
                <Text style={styles.dealDetailText}>
                  Volta: {formatDate(deal.return)}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBookFlight(deal.id)}
          >
            <Text style={styles.bookButtonText}>Reservar Agora</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderDestinationsTab = () => (
    <View style={styles.tabContent}>
      {destinations.map((destination) => (
        <View key={destination.id} style={styles.destinationCard}>
          <View style={styles.destinationHeader}>
            <View style={styles.destinationImagePlaceholder}>
              <MaterialIcons name="place" size={32} color="#999" />
            </View>
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <Text style={styles.destinationCountry}>{destination.country}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={16} color="#FFD93D" />
                <Text style={styles.destinationRating}>{destination.rating}</Text>
                <Text style={styles.priceLevel}>{getPriceLevelText(destination.priceLevel)}</Text>
              </View>
            </View>
            <View style={styles.nomadScoreContainer}>
              <Text style={styles.nomadScore}>{destination.nomadScore}</Text>
              <Text style={styles.nomadScoreLabel}>Score</Text>
            </View>
          </View>

          <View style={styles.destinationStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="wifi" size={20} color="#4A90E2" />
              <Text style={styles.statValue}>{destination.internetSpeed} Mbps</Text>
              <Text style={styles.statLabel}>Internet</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="security" size={20} color="#6BCF7F" />
              <Text style={styles.statValue}>{destination.safetyRating}/10</Text>
              <Text style={styles.statLabel}>Segurança</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="wb-sunny" size={20} color="#FFD93D" />
              <Text style={styles.statValue}>{destination.climate}</Text>
              <Text style={styles.statLabel}>Clima</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explorar Destino</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderPlanningTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.planningCard}>
        <Text style={styles.sectionTitle}>Planejador de Viagem</Text>
        
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Para onde você quer ir?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.quickFilters}>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>🏖️ Praia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>🏔️ Montanha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>🌆 Cidade</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planningOptions}>
          <TouchableOpacity style={styles.planningOption}>
            <MaterialIcons name="flight" size={24} color="#4A90E2" />
            <Text style={styles.planningOptionText}>Buscar Voos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.planningOption}>
            <MaterialIcons name="hotel" size={24} color="#4A90E2" />
            <Text style={styles.planningOptionText}>Acomodação</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.planningOption}>
            <MaterialIcons name="directions-car" size={24} color="#4A90E2" />
            <Text style={styles.planningOptionText}>Transporte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.planningOption}>
            <MaterialIcons name="event" size={24} color="#4A90E2" />
            <Text style={styles.planningOptionText}>Atividades</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.travelTipsCard}>
        <Text style={styles.sectionTitle}>Dicas de Viagem</Text>
        
        <View style={styles.tipItem}>
          <MaterialIcons name="lightbulb" size={20} color="#FFD93D" />
          <Text style={styles.tipText}>
            Reserve voos com antecedência para melhores preços
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <MaterialIcons name="lightbulb" size={20} color="#FFD93D" />
          <Text style={styles.tipText}>
            Verifique requisitos de visto antes de viajar
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <MaterialIcons name="lightbulb" size={20} color="#FFD93D" />
          <Text style={styles.tipText}>
            Tenha sempre um seguro de viagem ativo
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Viagens</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateTrip}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trips' && styles.activeTab]}
          onPress={() => setActiveTab('trips')}
        >
          <MaterialIcons 
            name="card-travel" 
            size={18} 
            color={activeTab === 'trips' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.activeTabText]}>
            Viagens
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'deals' && styles.activeTab]}
          onPress={() => setActiveTab('deals')}
        >
          <MaterialIcons 
            name="flight" 
            size={18} 
            color={activeTab === 'deals' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'deals' && styles.activeTabText]}>
            Ofertas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'destinations' && styles.activeTab]}
          onPress={() => setActiveTab('destinations')}
        >
          <MaterialIcons 
            name="place" 
            size={18} 
            color={activeTab === 'destinations' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'destinations' && styles.activeTabText]}>
            Destinos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'planning' && styles.activeTab]}
          onPress={() => setActiveTab('planning')}
        >
          <MaterialIcons 
            name="map" 
            size={18} 
            color={activeTab === 'planning' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'planning' && styles.activeTabText]}>
            Planejar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'trips' && renderTripsTab()}
        {activeTab === 'deals' && renderDealsTab()}
        {activeTab === 'destinations' && renderDestinationsTab()}
        {activeTab === 'planning' && renderPlanningTab()}
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  tripCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  tripDetails: {
    marginBottom: 15,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  tripActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  tripActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripActionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  dealCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  airlineText: {
    fontSize: 12,
    color: '#666',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  dealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 10,
    color: '#999',
  },
  dealDetails: {
    marginBottom: 15,
  },
  dealDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#6BCF7F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  destinationCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  destinationImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationRating: {
    marginLeft: 4,
    marginRight: 12,
    fontSize: 14,
    color: '#666',
  },
  priceLevel: {
    fontSize: 14,
    color: '#4A90E2',
  },
  nomadScoreContainer: {
    alignItems: 'center',
  },
  nomadScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  nomadScoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  destinationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  exploreButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  planningCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  quickFilters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  filterText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  planningOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planningOption: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
    borderRadius: 15,
    marginBottom: 10,
  },
  planningOptionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
    textAlign: 'center',
  },
  travelTipsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
