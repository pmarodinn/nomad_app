import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/AuthContext';

interface EmergencyContact {
  id: string;
  name: string;
  type: 'police' | 'medical' | 'fire' | 'embassy' | 'personal';
  phone: string;
  location: string;
  available24h: boolean;
}

interface EmergencyService {
  id: string;
  name: string;
  category: 'hospital' | 'pharmacy' | 'police' | 'embassy';
  address: string;
  phone: string;
  distance: string;
  rating: number;
  isOpen: boolean;
}

interface SafetyAlert {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  source: string;
}

export default function EmergencyScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState('Lisboa, Portugal');

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Polícia Nacional',
      type: 'police',
      phone: '112',
      location: 'Portugal',
      available24h: true,
    },
    {
      id: '2',
      name: 'INEM (Emergência Médica)',
      type: 'medical',
      phone: '112',
      location: 'Portugal',
      available24h: true,
    },
    {
      id: '3',
      name: 'Bombeiros',
      type: 'fire',
      phone: '112',
      location: 'Portugal',
      available24h: true,
    },
    {
      id: '4',
      name: 'Embaixada do Brasil',
      type: 'embassy',
      phone: '+351 21 724 0400',
      location: 'Lisboa, Portugal',
      available24h: false,
    },
  ]);

  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([
    {
      id: '1',
      name: 'Hospital Curry Cabral',
      category: 'hospital',
      address: 'R. da Beneficência 8, 1069-166 Lisboa',
      phone: '+351 21 792 4100',
      distance: '2.3 km',
      rating: 4.2,
      isOpen: true,
    },
    {
      id: '2',
      name: 'Farmácia Central do Chiado',
      category: 'pharmacy',
      address: 'Rua do Carmo 42A, 1200-094 Lisboa',
      phone: '+351 21 347 3291',
      distance: '0.8 km',
      rating: 4.5,
      isOpen: true,
    },
    {
      id: '3',
      name: 'Esquadra da PSP - Chiado',
      category: 'police',
      address: 'Largo do Chiado 16, 1200-108 Lisboa',
      phone: '+351 21 346 1141',
      distance: '0.5 km',
      rating: 4.0,
      isOpen: true,
    },
  ]);

  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      level: 'medium',
      title: 'Manifestação no Centro',
      description: 'Manifestação pacífica prevista para hoje no Rossio. Possíveis constrangimentos no trânsito.',
      location: 'Rossio, Lisboa',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      source: 'Câmara Municipal',
    },
    {
      id: '2',
      level: 'low',
      title: 'Obras na Rua Augusta',
      description: 'Obras de requalificação em curso. Via parcialmente condicionada.',
      location: 'Rua Augusta, Lisboa',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      source: 'Município',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aqui você faria a chamada para a API para atualizar os dados
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'police': return 'local-police';
      case 'medical': return 'local-hospital';
      case 'fire': return 'local-fire-department';
      case 'embassy': return 'account-balance';
      case 'personal': return 'person';
      default: return 'phone';
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'hospital': return 'local-hospital';
      case 'pharmacy': return 'local-pharmacy';
      case 'police': return 'local-police';
      case 'embassy': return 'account-balance';
      default: return 'place';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'low': return '#6BCF7F';
      case 'medium': return '#FFD93D';
      case 'high': return '#FF9800';
      case 'critical': return '#FF6B6B';
      default: return '#E0E0E0';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'low': return 'info';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'dangerous';
      default: return 'info';
    }
  };

  const handleCall = (phone: string) => {
    Alert.alert(
      'Fazer Ligação',
      `Ligar para ${phone}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Ligar', 
          onPress: () => Linking.openURL(`tel:${phone}`)
        },
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert(
      'SOS - Emergência',
      'Esta funcionalidade irá notificar seus contatos de emergência e ligar para o número de emergência local.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'ATIVAR SOS', 
          style: 'destructive',
          onPress: () => {
            // Aqui você implementaria a lógica de SOS
            Linking.openURL('tel:112');
          }
        },
      ]
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Emergência</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.locationText}>{userLocation}</Text>
          </View>
        </View>

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <MaterialIcons name="emergency" size={40} color="#FFF" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          <Text style={styles.sosDescription}>
            Mantenha pressionado em caso de emergência
          </Text>
        </View>

        {/* Quick Emergency Contacts */}
        <View style={styles.quickContactsCard}>
          <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
          
          {emergencyContacts.slice(0, 3).map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              style={styles.quickContact}
              onPress={() => handleCall(contact.phone)}
            >
              <View style={styles.contactIcon}>
                <MaterialIcons 
                  name={getContactIcon(contact.type) as any} 
                  size={24} 
                  color="#FFF" 
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <View style={styles.contactBadges}>
                {contact.available24h && (
                  <View style={styles.badge24h}>
                    <Text style={styles.badge24hText}>24h</Text>
                  </View>
                )}
                <MaterialIcons name="phone" size={20} color="#4A90E2" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Alerts */}
        {safetyAlerts.length > 0 && (
          <View style={styles.alertsCard}>
            <Text style={styles.sectionTitle}>Alertas de Segurança</Text>
            
            {safetyAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertHeader}>
                  <View style={[styles.alertIcon, { backgroundColor: getAlertColor(alert.level) }]}>
                    <MaterialIcons 
                      name={getAlertIcon(alert.level) as any} 
                      size={16} 
                      color="#FFF" 
                    />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                    <Text style={styles.alertMeta}>
                      📍 {alert.location} • {formatTimeAgo(alert.timestamp)} • {alert.source}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Nearby Emergency Services */}
        <View style={styles.servicesCard}>
          <Text style={styles.sectionTitle}>Serviços Próximos</Text>
          
          {emergencyServices.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceIcon}>
                <MaterialIcons 
                  name={getServiceIcon(service.category) as any} 
                  size={24} 
                  color="#4A90E2" 
                />
              </View>
              
              <View style={styles.serviceInfo}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.serviceStatus}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: service.isOpen ? '#6BCF7F' : '#FF6B6B' }
                    ]} />
                    <Text style={styles.statusText}>
                      {service.isOpen ? 'Aberto' : 'Fechado'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.serviceAddress}>{service.address}</Text>
                
                <View style={styles.serviceDetails}>
                  <View style={styles.serviceDetail}>
                    <MaterialIcons name="star" size={14} color="#FFD93D" />
                    <Text style={styles.serviceDetailText}>{service.rating}</Text>
                  </View>
                  
                  <View style={styles.serviceDetail}>
                    <MaterialIcons name="place" size={14} color="#666" />
                    <Text style={styles.serviceDetailText}>{service.distance}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.serviceActions}>
                <TouchableOpacity 
                  style={styles.serviceActionButton}
                  onPress={() => handleCall(service.phone)}
                >
                  <MaterialIcons name="phone" size={20} color="#4A90E2" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.serviceActionButton}>
                  <MaterialIcons name="directions" size={20} color="#4A90E2" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency Checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.sectionTitle}>Lista de Verificação</Text>
          
          <View style={styles.checklistItem}>
            <MaterialIcons name="check-circle" size={20} color="#6BCF7F" />
            <Text style={styles.checklistText}>Documentos importantes salvos na nuvem</Text>
          </View>
          
          <View style={styles.checklistItem}>
            <MaterialIcons name="check-circle" size={20} color="#6BCF7F" />
            <Text style={styles.checklistText}>Seguro de viagem ativo</Text>
          </View>
          
          <View style={styles.checklistItem}>
            <MaterialIcons name="radio-button-unchecked" size={20} color="#E0E0E0" />
            <Text style={[styles.checklistText, { color: '#999' }]}>
              Contatos de emergência atualizados
            </Text>
          </View>
          
          <View style={styles.checklistItem}>
            <MaterialIcons name="radio-button-unchecked" size={20} color="#E0E0E0" />
            <Text style={[styles.checklistText, { color: '#999' }]}>
              Medicamentos de emergência disponíveis
            </Text>
          </View>
        </View>

        {/* Emergency Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>Dicas de Segurança</Text>
          
          <View style={styles.tipItem}>
            <MaterialIcons name="security" size={20} color="#4A90E2" />
            <Text style={styles.tipText}>
              Mantenha sempre cópias digitais dos seus documentos
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <MaterialIcons name="phone" size={20} color="#4A90E2" />
            <Text style={styles.tipText}>
              Salve números de emergência locais no seu telefone
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <MaterialIcons name="location-on" size={20} color="#4A90E2" />
            <Text style={styles.tipText}>
              Compartilhe sua localização com pessoas de confiança
            </Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  sosContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  sosButton: {
    backgroundColor: '#FF6B6B',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
  },
  sosText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sosDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  quickContactsCard: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
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
  quickContact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  contactBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge24h: {
    backgroundColor: '#6BCF7F',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  badge24hText: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '600',
  },
  alertsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  alertItem: {
    marginBottom: 15,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  alertMeta: {
    fontSize: 10,
    color: '#999',
  },
  servicesCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  serviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
  serviceAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceDetailText: {
    marginLeft: 2,
    fontSize: 12,
    color: '#666',
  },
  serviceActions: {
    flexDirection: 'row',
  },
  serviceActionButton: {
    marginLeft: 8,
    padding: 8,
  },
  checklistCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checklistText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  tipsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
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
