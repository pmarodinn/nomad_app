#!/bin/bash

# Script de Build para Google Play Store
# Execute este script para fazer build do app para produção

echo "🚀 Iniciando build do NomadGuide para Play Store..."

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI não encontrado. Instalando..."
    npm install -g eas-cli
fi

# Verificar login
echo "🔐 Verificando login no Expo..."
if ! eas whoami &> /dev/null; then
    echo "❌ Você precisa fazer login no Expo primeiro:"
    echo "   eas login"
    exit 1
fi

# Limpar cache
echo "🧹 Limpando cache..."
expo r -c

# Verificar configuração
echo "🔍 Verificando configuração do projeto..."
expo doctor

# Fazer build de produção
echo "📱 Iniciando build de produção (AAB para Play Store)..."
eas build --platform android --profile production

echo "✅ Build concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Baixe o arquivo AAB gerado"
echo "2. Faça upload no Google Play Console"
echo "3. Configure as informações da loja"
echo "4. Publique o app!"
echo ""
echo "💡 Para fazer submit automático:"
echo "   eas submit --platform android"
