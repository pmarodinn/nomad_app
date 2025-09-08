import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar } from 'react-native-paper';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerContent}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Title style={styles.headerTitle}>Perfil</Title>
        </View>
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            {user?.profilePicture ? (
              <Avatar.Image 
                size={80} 
                source={{ uri: user.profilePicture }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Image 
                size={80} 
                source={require('@/assets/images/icon.png')}
                style={styles.avatar}
              />
            )}
            <Title style={styles.name}>{user?.displayName || 'Usuário'}</Title>
            <Paragraph style={styles.email}>{user?.email}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Configurações</Title>
            <Paragraph>Personalize sua experiência no NomadGuide</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => console.log('Configurações')}>
              Acessar Configurações
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Estatísticas</Title>
            <Paragraph>• Viagens planejadas: 0</Paragraph>
            <Paragraph>• Orçamentos criados: 0</Paragraph>
            <Paragraph>• Membro desde: {user?.createdAt?.toLocaleDateString()}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
});
