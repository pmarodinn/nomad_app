import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Switch,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (trip: any) => void;
}

const CreateTripModal: React.FC<CreateTripModalProps> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !startDate || !endDate) {
      Alert.alert('Erro', 'Preencha pelo menos o título e as datas da viagem');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: budget ? parseFloat(budget) : 0,
      currency: 'BRL',
      status: 'planning',
      isPublic,
    });

    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setIsPublic(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Nova Viagem</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título da Viagem</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Eurotrip 2024"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva sua viagem..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Data de Início</Text>
              <TextInput
                style={styles.textInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>Data de Fim</Text>
              <TextInput
                style={styles.textInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Orçamento Total (R$)</Text>
            <TextInput
              style={styles.textInput}
              value={budget}
              onChangeText={setBudget}
              placeholder="5000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.inputLabel}>Viagem Pública</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor="#f4f3f4"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default function TravelScreen() {
  const [activeTab, setActiveTab] = useState<'trips' | 'deals' | 'tips' | 'visa'>('trips');
  const [showTripModal, setShowTripModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCreateTrip = async (tripData: any) => {
    try {
      // Simular criação de viagem
      const newTrip = {
        id: Date.now().toString(),
        ...tripData,
        destinations: [],
        createdAt: new Date(),
      };
      setTrips(prev => [newTrip, ...prev]);
      Alert.alert('Sucesso', 'Viagem criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a viagem');
      console.error('Error creating trip:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#3498DB';
      case 'active': return '#2ECC71';
      case 'completed': return '#95A5A6';
      case 'cancelled': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planejando';
      case 'active': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const renderTripsTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="airplane" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>Nenhuma viagem planejada</Text>
          <Text style={styles.emptyStateText}>Comece a planejar sua próxima aventura!</Text>
        </View>
      ) : (
        trips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripName}>{trip.title}</Text>
              <View style={styles.tripStatus}>
                <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
                  {getStatusText(trip.status)}
                </Text>
              </View>
            </View>
            
            {trip.description && (
              <Text style={styles.tripDescription}>{trip.description}</Text>
            )}
            
            <View style={styles.tripMeta}>
              <View style={styles.tripMetaItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.tripMetaText}>
                  {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.tripMetaItem}>
                <Ionicons name="wallet-outline" size={16} color="#666" />
                <Text style={styles.tripMetaText}>
                  {trip.currency} {trip.budget.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.tripMetaItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.tripMetaText}>
                  {trip.destinations?.length || 0} destino(s)
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderDealsTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.emptyState}>
        <Ionicons name="pricetag" size={64} color="#ccc" />
        <Text style={styles.emptyStateTitle}>Nenhuma oferta disponível</Text>
        <Text style={styles.emptyStateText}>Volte mais tarde para conferir as promoções!</Text>
      </View>
    </ScrollView>
  );

  const renderTipsTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.emptyState}>
        <Ionicons name="bulb" size={64} color="#ccc" />
        <Text style={styles.emptyStateTitle}>Nenhuma dica disponível</Text>
        <Text style={styles.emptyStateText}>Estamos preparando dicas incríveis para você!</Text>
      </View>
    </ScrollView>
  );

  const renderVisaTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.emptyState}>
        <Ionicons name="document-text" size={64} color="#ccc" />
        <Text style={styles.emptyStateTitle}>Nenhuma informação de visto</Text>
        <Text style={styles.emptyStateText}>Informações de visto serão carregadas em breve!</Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Viagens</Text>
        <Text style={styles.subtitle}>Planeje sua próxima aventura</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trips' && styles.activeTab]}
          onPress={() => setActiveTab('trips')}
        >
          <Ionicons 
            name={activeTab === 'trips' ? 'airplane' : 'airplane-outline'} 
            size={20} 
            color={activeTab === 'trips' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.activeTabText]}>
            Viagens
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'deals' && styles.activeTab]}
          onPress={() => setActiveTab('deals')}
        >
          <Ionicons 
            name={activeTab === 'deals' ? 'pricetag' : 'pricetag-outline'} 
            size={20} 
            color={activeTab === 'deals' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'deals' && styles.activeTabText]}>
            Ofertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Ionicons 
            name={activeTab === 'tips' ? 'bulb' : 'bulb-outline'} 
            size={20} 
            color={activeTab === 'tips' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            Dicas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'visa' && styles.activeTab]}
          onPress={() => setActiveTab('visa')}
        >
          <Ionicons 
            name={activeTab === 'visa' ? 'document-text' : 'document-text-outline'} 
            size={20} 
            color={activeTab === 'visa' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'visa' && styles.activeTabText]}>
            Vistos
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'trips' && renderTripsTab()}
      {activeTab === 'deals' && renderDealsTab()}
      {activeTab === 'tips' && renderTipsTab()}
      {activeTab === 'visa' && renderVisaTab()}

      {activeTab === 'trips' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowTripModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}

      <CreateTripModal
        visible={showTripModal}
        onClose={() => setShowTripModal(false)}
        onSave={handleCreateTrip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  tripStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tripMeta: {
    gap: 8,
  },
  tripMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripMetaText: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
