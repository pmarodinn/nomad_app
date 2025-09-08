#!/bin/bash

# Script para criar índices do Firestore automaticamente
# Execute este script após configurar o Firebase CLI

echo "🔥 Configurando índices do Firestore para NomadGuide..."

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado. Instalando..."
    npm install -g firebase-tools
fi

# Fazer login no Firebase (se necessário)
echo "📱 Verificando autenticação..."
firebase login --no-localhost

# Inicializar Firestore no projeto (se necessário)
echo "🏗️ Inicializando Firestore..."
firebase init firestore --project nomadguide-5ea09

# Aplicar índices
echo "📊 Criando índices necessários..."
firebase deploy --only firestore:indexes --project nomadguide-5ea09

echo "✅ Índices do Firestore configurados com sucesso!"
echo "🔍 Verifique o status em: https://console.firebase.google.com/project/nomadguide-5ea09/firestore/indexes"

echo ""
echo "📋 Índices criados:"
echo "   • budgets: userId + createdAt"
echo "   • budgets: userId + startDate + endDate + createdAt"
echo "   • expenses: userId + date (DESC)"
echo "   • expenses: userId + date (ASC)"
echo "   • medications: userId + createdAt"
echo "   • healthMetrics: userId + recordedAt"
echo ""
echo "⏳ Aguarde alguns minutos para os índices ficarem prontos..."
