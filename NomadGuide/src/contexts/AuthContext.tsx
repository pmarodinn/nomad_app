import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import { User } from '../types';
import { checkFirebaseConnection, clearAuthState } from '../utils/firebaseUtils';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar conexão do Firebase no início
    checkFirebaseConnection();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid || 'No user');
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Verificar se o token é válido
          const token = await firebaseUser.getIdToken(false);
          console.log('Token obtido com sucesso');
          
          // Buscar dados do usuário no Firestore
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userData.displayName || firebaseUser.displayName || '',
              profilePicture: userData.profilePicture || firebaseUser.photoURL || '',
              createdAt: userData.createdAt?.toDate() || new Date(),
              updatedAt: userData.updatedAt?.toDate() || new Date(),
            });
          } else {
            // Criar documento do usuário se não existir
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              profilePicture: firebaseUser.photoURL || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            await setDoc(doc(firestore, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error: any) {
          console.error('Erro ao buscar dados do usuário:', error);
          
          // Se o erro for de token inválido, fazer logout
          if (error.code === 'auth/invalid-user-token' || 
              error.code === 'auth/user-token-expired' ||
              error.code === 'auth/user-disabled') {
            console.log('Token inválido, fazendo logout...');
            await signOut(auth);
            setUser(null);
            setFirebaseUser(null);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      console.log('=== Iniciando processo de registro ===');
      console.log('Email:', email);
      console.log('DisplayName:', displayName);
      
      // Verificar se o Firebase está configurado corretamente
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Problema de conexão com o Firebase');
      }
      
      // Limpar qualquer estado de autenticação anterior de forma segura
      if (auth.currentUser) {
        try {
          console.log('Usuário anterior detectado, fazendo logout...');
          await clearAuthState();
        } catch (clearError: any) {
          console.log('Erro ao limpar estado anterior (ignorando):', clearError.code);
          // Continuar mesmo se houver erro ao limpar
        }
      }
      
      console.log('Criando usuário no Firebase Auth...');
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✓ Usuário criado no Firebase Auth:', firebaseUser.uid);
      
      // Atualizar perfil do Firebase Auth
      console.log('Atualizando perfil...');
      await updateProfile(firebaseUser, { displayName });
      console.log('✓ Perfil atualizado no Firebase Auth');
      
      // Criar documento do usuário no Firestore
      console.log('Criando documento no Firestore...');
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName,
        profilePicture: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(firestore, 'users', firebaseUser.uid), newUser);
      console.log('✓ Documento criado no Firestore');
      console.log('=== Registro concluído com sucesso ===');
      
    } catch (error: any) {
      console.error('=== Erro no registro ===');
      console.error('Código do erro:', error.code);
      console.error('Mensagem:', error.message);
      
      // Não tentar limpar estado aqui para evitar loops
      console.error('Erro detalhado no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date(),
      };
      
      // Atualizar no Firestore
      await setDoc(doc(firestore, 'users', user.id), updatedUser, { merge: true });
      
      // Atualizar estado local
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erro ao enviar email de reset:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    return login(email, password);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    resetPassword,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
