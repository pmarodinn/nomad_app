import { auth, firestore } from '../config/firebase';
import { signOut } from 'firebase/auth';

export const checkFirebaseConnection = async () => {
  try {
    console.log('=== Verificando configuração do Firebase ===');
    console.log('Auth configurado:', !!auth);
    console.log('Firestore configurado:', !!firestore);
    console.log('Usuario atual:', auth.currentUser?.uid || 'Nenhum');
    // Não forçar getIdToken aqui (evita auth/invalid-user-token)
    return true;
  } catch (error) {
    console.error('Erro ao verificar Firebase:', error);
    return false;
  }
};

export const clearAuthState = async () => {
  try {
    if (auth.currentUser) {
      await signOut(auth);
      console.log('Logout normal realizado');
    }
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Estado de autenticação completamente limpo');
  } catch (error: any) {
    console.log('Erro ao fazer logout (ignorando):', error.code);
  }
};

export const forceAuthReset = async () => {
  try {
    console.log('=== Forçando reset completo de autenticação ===');
    for (let i = 0; i < 2; i++) {
      try {
        if (auth.currentUser) {
          await signOut(auth);
          console.log(`Tentativa ${i + 1}: Logout realizado`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error: any) {
        console.log(`Tentativa ${i + 1}: Erro ignorado -`, error.code);
      }
    }
    const isClean = !auth.currentUser;
    console.log('Auth completamente limpo:', isClean);
    return isClean;
  } catch (error) {
    console.error('Erro no reset forçado:', error);
    return false;
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
