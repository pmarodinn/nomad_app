import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  profession: string;
  location: string;
  joinDate: Date;
  nomadLevel: 'Beginner' | 'Intermediate' | 'Expert' | 'Veteran';
  tripsCompleted: number;
  countriesVisited: number;
}

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'switch' | 'navigation' | 'action';
  icon: string;
  value?: boolean;
  action?: () => void;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    profession: 'Desenvolvedor Full Stack',
    location: 'Lisboa, Portugal',
    joinDate: new Date(2023, 5, 15),
    nomadLevel: 'Intermediate',
    tripsCompleted: 12,
    countriesVisited: 8,
  });

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
    location: true,
    budget: true,
    health: true,
    community: false,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Aqui você faria a chamada para a API para atualizar os dados
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
          }
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Conta',
      items: [
        {
          id: 'edit-profile',
          title: 'Editar Perfil',
          description: 'Alterar informações pessoais',
          type: 'navigation' as const,
          icon: 'edit',
          action: () => Alert.alert('Editar Perfil', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'change-password',
          title: 'Alterar Senha',
          type: 'navigation' as const,
          icon: 'lock',
          action: () => Alert.alert('Alterar Senha', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'privacy',
          title: 'Privacidade',
          type: 'navigation' as const,
          icon: 'privacy-tip',
          action: () => Alert.alert('Privacidade', 'Funcionalidade em desenvolvimento'),
        },
      ],
    },
    {
      title: 'Notificações',
      items: [
        {
          id: 'push-notifications',
          title: 'Notificações Push',
          description: 'Receber notificações no dispositivo',
          type: 'switch' as const,
          icon: 'notifications',
          value: notifications.push,
        },
        {
          id: 'email-notifications',
          title: 'Notificações por Email',
          type: 'switch' as const,
          icon: 'email',
          value: notifications.email,
        },
        {
          id: 'location-alerts',
          title: 'Alertas de Localização',
          description: 'Notificações baseadas na sua localização',
          type: 'switch' as const,
          icon: 'location-on',
          value: notifications.location,
        },
        {
          id: 'budget-alerts',
          title: 'Alertas de Orçamento',
          type: 'switch' as const,
          icon: 'account-balance-wallet',
          value: notifications.budget,
        },
      ],
    },
    {
      title: 'Aplicativo',
      items: [
        {
          id: 'language',
          title: 'Idioma',
          description: 'Português (Brasil)',
          type: 'navigation' as const,
          icon: 'language',
          action: () => Alert.alert('Idioma', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'currency',
          title: 'Moeda Padrão',
          description: 'EUR (Euro)',
          type: 'navigation' as const,
          icon: 'attach-money',
          action: () => Alert.alert('Moeda', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'theme',
          title: 'Tema',
          description: 'Claro',
          type: 'navigation' as const,
          icon: 'palette',
          action: () => Alert.alert('Tema', 'Funcionalidade em desenvolvimento'),
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          id: 'help',
          title: 'Central de Ajuda',
          type: 'navigation' as const,
          icon: 'help',
          action: () => Alert.alert('Ajuda', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'feedback',
          title: 'Enviar Feedback',
          type: 'navigation' as const,
          icon: 'feedback',
          action: () => Alert.alert('Feedback', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'about',
          title: 'Sobre o App',
          description: 'Versão 1.0.0',
          type: 'navigation' as const,
          icon: 'info',
          action: () => Alert.alert('Sobre', 'NomadGuide v1.0.0\nSeu companheiro de viagem digital'),
        },
      ],
    },
  ];

  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#6BCF7F';
      case 'Intermediate': return '#4A90E2';
      case 'Expert': return '#FF9800';
      case 'Veteran': return '#9C27B0';
      default: return '#E0E0E0';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Beginner': return 'eco';
      case 'Intermediate': return 'flight';
      case 'Expert': return 'star';
      case 'Veteran': return 'workspace-premium';
      default: return 'person';
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={40} color="#999" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialIcons name="camera-alt" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            <Text style={styles.profileProfession}>{userProfile.profession}</Text>
            
            <View style={styles.levelContainer}>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(userProfile.nomadLevel) }]}>
                <MaterialIcons 
                  name={getLevelIcon(userProfile.nomadLevel) as any} 
                  size={16} 
                  color="#FFF" 
                />
                <Text style={styles.levelText}>{userProfile.nomadLevel}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.tripsCompleted}</Text>
            <Text style={styles.statLabel}>Viagens</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.countriesVisited}</Text>
            <Text style={styles.statLabel}>Países</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.floor((new Date().getTime() - userProfile.joinDate.getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.statLabel}>Dias</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.settingsCard}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.settingItem}
                    onPress={item.type === 'navigation' ? item.action : undefined}
                    disabled={item.type === 'switch'}
                  >
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIcon}>
                        <MaterialIcons name={item.icon as any} size={20} color="#4A90E2" />
                      </View>
                      <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>{item.title}</Text>
                        {item.description && (
                          <Text style={styles.settingDescription}>{item.description}</Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.settingRight}>
                      {item.type === 'switch' ? (
                        <Switch
                          value={item.value}
                          onValueChange={(value) => {
                            const key = item.id.replace('-notifications', '').replace('-alerts', '').replace('push-', 'push').replace('email-', 'email').replace('location-', 'location').replace('budget-', 'budget');
                            handleNotificationToggle(key, value);
                          }}
                          trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
                          thumbColor={item.value ? '#FFF' : '#FFF'}
                        />
                      ) : (
                        <MaterialIcons name="chevron-right" size={20} color="#999" />
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.settingDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout and Delete Account */}
        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <MaterialIcons name="delete-forever" size={20} color="#999" />
            <Text style={styles.deleteText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>NomadGuide v1.0.0</Text>
          <Text style={styles.versionSubtext}>Feito com ❤️ para nômades digitais</Text>
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
  profileHeader: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileProfession: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 10,
  },
  levelContainer: {
    marginTop: 5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    paddingVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  settingRight: {
    marginLeft: 10,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 75,
  },
  dangerSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  deleteText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 10,
    color: '#999',
  },
});
