import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/AuthContext';

interface NomadProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  profession: string;
  languages: string[];
  rating: number;
  isOnline: boolean;
  distance: string;
}

interface CommunityPost {
  id: string;
  author: NomadProfile;
  content: string;
  images?: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  category: 'tip' | 'question' | 'event' | 'meetup';
}

interface ExpenseShare {
  id: string;
  title: string;
  amount: number;
  currency: string;
  participants: NomadProfile[];
  status: 'pending' | 'settled';
  dueDate: Date;
}

export default function CommunityScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'nomads' | 'expenses'>('feed');
  
  const [nearbyNomads, setNearbyNomads] = useState<NomadProfile[]>([
    {
      id: '1',
      name: 'Maria Silva',
      avatar: '',
      location: 'Lisboa, Portugal',
      profession: 'Designer UI/UX',
      languages: ['Português', 'Inglês', 'Espanhol'],
      rating: 4.8,
      isOnline: true,
      distance: '0.5km',
    },
    {
      id: '2',
      name: 'John Parker',
      avatar: '',
      location: 'Lisboa, Portugal',
      profession: 'Desenvolvedor Full Stack',
      languages: ['Inglês', 'Português'],
      rating: 4.9,
      isOnline: false,
      distance: '1.2km',
    },
    {
      id: '3',
      name: 'Ana Costa',
      avatar: '',
      location: 'Porto, Portugal',
      profession: 'Marketing Digital',
      languages: ['Português', 'Francês', 'Inglês'],
      rating: 4.7,
      isOnline: true,
      distance: '2.1km',
    },
  ]);

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: nearbyNomads[0],
      content: 'Alguém conhece um bom café com WiFi em Príncipe Real? Preciso de um lugar tranquilo para trabalhar hoje.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 12,
      comments: 8,
      isLiked: false,
      category: 'question',
    },
    {
      id: '2',
      author: nearbyNomads[1],
      content: 'Organizando um meetup de nômades digitais no Timeout Market amanhã às 19h. Quem topa?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 25,
      comments: 15,
      isLiked: true,
      category: 'meetup',
    },
  ]);

  const [expenseShares, setExpenseShares] = useState<ExpenseShare[]>([
    {
      id: '1',
      title: 'Jantar no Ramiro',
      amount: 85.50,
      currency: 'EUR',
      participants: [nearbyNomads[0], nearbyNomads[1]],
      status: 'pending',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Uber para o aeroporto',
      amount: 12.30,
      currency: 'EUR',
      participants: [nearbyNomads[0], nearbyNomads[2]],
      status: 'settled',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aqui você faria a chamada para a API para atualizar os dados
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleConnect = (nomadId: string) => {
    Alert.alert('Conectar', 'Solicitação de conexão enviada!');
  };

  const handleLikePost = (postId: string) => {
    setCommunityPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tip': return 'lightbulb';
      case 'question': return 'help';
      case 'event': return 'event';
      case 'meetup': return 'group';
      default: return 'chat';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tip': return '#FFD93D';
      case 'question': return '#4A90E2';
      case 'event': return '#FF6B6B';
      case 'meetup': return '#6BCF7F';
      default: return '#E0E0E0';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const renderFeedTab = () => (
    <View style={styles.tabContent}>
      {communityPosts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={24} color="#999" />
              </View>
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <Text style={styles.postTime}>{formatTimeAgo(post.timestamp)}</Text>
              </View>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
              <MaterialIcons 
                name={getCategoryIcon(post.category) as any} 
                size={12} 
                color="#FFF" 
              />
            </View>
          </View>
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLikePost(post.id)}
            >
              <MaterialIcons 
                name={post.isLiked ? "favorite" : "favorite-border"} 
                size={20} 
                color={post.isLiked ? "#FF6B6B" : "#999"} 
              />
              <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                {post.likes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="chat-bubble-outline" size={20} color="#999" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="share" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderNomadsTab = () => (
    <View style={styles.tabContent}>
      {nearbyNomads.map((nomad) => (
        <View key={nomad.id} style={styles.nomadCard}>
          <View style={styles.nomadHeader}>
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={32} color="#999" />
            </View>
            <View style={styles.nomadInfo}>
              <View style={styles.nomadNameRow}>
                <Text style={styles.nomadName}>{nomad.name}</Text>
                {nomad.isOnline && (
                  <View style={styles.onlineIndicator} />
                )}
              </View>
              <Text style={styles.nomadProfession}>{nomad.profession}</Text>
              <Text style={styles.nomadLocation}>📍 {nomad.location} • {nomad.distance}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={16} color="#FFD93D" />
                <Text style={styles.rating}>{nomad.rating}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => handleConnect(nomad.id)}
            >
              <MaterialIcons name="person-add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.languageContainer}>
            {nomad.languages.map((language, index) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      {expenseShares.map((expense) => (
        <View key={expense.id} style={styles.expenseCard}>
          <View style={styles.expenseHeader}>
            <Text style={styles.expenseTitle}>{expense.title}</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: expense.status === 'settled' ? '#6BCF7F' : '#FFD93D' }
            ]}>
              <Text style={styles.statusText}>
                {expense.status === 'settled' ? 'Pago' : 'Pendente'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.expenseAmount}>
            {expense.amount.toFixed(2)} {expense.currency}
          </Text>
          
          <View style={styles.participantsRow}>
            <Text style={styles.participantsLabel}>Participantes:</Text>
            <View style={styles.participantsList}>
              {expense.participants.map((participant, index) => (
                <Text key={index} style={styles.participantName}>
                  {participant.name}
                  {index < expense.participants.length - 1 && ', '}
                </Text>
              ))}
            </View>
          </View>
          
          {expense.status === 'pending' && (
            <TouchableOpacity style={styles.settleButton}>
              <Text style={styles.settleButtonText}>Marcar como Pago</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade</Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <MaterialIcons 
            name="dynamic-feed" 
            size={20} 
            color={activeTab === 'feed' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Feed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'nomads' && styles.activeTab]}
          onPress={() => setActiveTab('nomads')}
        >
          <MaterialIcons 
            name="people" 
            size={20} 
            color={activeTab === 'nomads' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'nomads' && styles.activeTabText]}>
            Nômades
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <MaterialIcons 
            name="receipt" 
            size={20} 
            color={activeTab === 'expenses' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'feed' && renderFeedTab()}
        {activeTab === 'nomads' && renderNomadsTab()}
        {activeTab === 'expenses' && renderExpensesTab()}
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
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  categoryBadge: {
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#999',
  },
  likedText: {
    color: '#FF6B6B',
  },
  nomadCard: {
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
  nomadHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  nomadInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nomadNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nomadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6BCF7F',
  },
  nomadProfession: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nomadLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  connectButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  languageText: {
    fontSize: 10,
    color: '#4A90E2',
    fontWeight: '500',
  },
  expenseCard: {
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  participantsRow: {
    marginBottom: 15,
  },
  participantsLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participantName: {
    fontSize: 14,
    color: '#666',
  },
  settleButton: {
    backgroundColor: '#6BCF7F',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  settleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
