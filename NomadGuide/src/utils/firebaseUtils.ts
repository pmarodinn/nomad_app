import { auth, firestore } from '../config/firebase';
import { signOut } from 'firebase/auth';

export const checkFirebaseConnection = async () => {
  try {
    console.log('=== Verificando configuração do Firebase ===');
    console.log('Auth configurado:', !!auth);
    console.log('Firestore configurado:', !!firestore);
    console.log('Usuario atual:', auth.currentUser?.uid || 'Nenhum');
    
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(false);
        console.log('Token válido obtido');
        return true;
      } catch (tokenError: any) {
        console.error('Erro ao obter token:', tokenError);
        if (tokenError.code === 'auth/invalid-user-token' || 
            tokenError.code === 'auth/user-token-expired') {
          console.log('Token inválido, fazendo logout...');
          await signOut(auth);
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar Firebase:', error);
    return false;
  }
};

export const clearAuthState = async () => {
  try {
    await signOut(auth);
    console.log('Estado de autenticação limpo');
  } catch (error) {
    console.error('Erro ao limpar estado:', error);
  }
};

export const getDetailedAuthState = () => {
  const user = auth.currentUser;
  if (!user) {
    return { status: 'not-authenticated' };
  }
  
  return {
    status: 'authenticated',
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    }
  };
};
