# ✅ Checklist para Publicação na Play Store

## Configuração do Projeto

### 📱 App Básico
- [x] Projeto React Native criado com Expo
- [x] TypeScript configurado
- [x] Navegação com Expo Router
- [x] Configuração mobile-only (sem dependências web)
- [x] Permissões configuradas (localização, câmera, galeria)

### 🔧 Configurações Técnicas
- [x] `app.json` configurado com:
  - [x] Package name único: `com.nomadguide.app`
  - [x] Version code: `1`
  - [x] Ícones adaptáveis
  - [x] Permissões necessárias
  - [x] Target SDK 34
- [x] `eas.json` configurado para builds
- [x] Scripts de build no `package.json`

### 🎨 Assets Visuais
- [ ] Ícone principal (1024x1024) - `./assets/images/icon.png`
- [ ] Ícone adaptável (1024x1024) - `./assets/images/adaptive-icon.png`
- [ ] Splash screen - `./assets/images/splash.png`
- [ ] Screenshots para Play Store (pelo menos 2)

## Funcionalidades Core

### 🔐 Autenticação
- [x] Firebase Auth configurado
- [x] Tela de login funcional
- [x] Context de autenticação
- [ ] **TODO**: Configurar credenciais reais do Firebase

### 🗺️ Mapas e Localização
- [x] Serviço de localização implementado
- [x] Componente de mapa (placeholder)
- [ ] **TODO**: Integrar Google Maps ou Mapbox
- [ ] **TODO**: Implementar busca por lugares próximos

### 📷 Fotos e Mídia
- [x] Expo Image Picker configurado
- [x] Permissões de câmera e galeria
- [ ] **TODO**: Upload de fotos para Firebase Storage
- [ ] **TODO**: Exibição de galeria de fotos

### 💾 Dados
- [x] Firebase Firestore configurado
- [x] Serviço de localização (CRUD básico)
- [ ] **TODO**: Implementar todas as operações CRUD
- [ ] **TODO**: Sincronização offline

## Qualidade e Performance

### 🧪 Testes
- [ ] Testar em dispositivo Android real
- [ ] Testar em diferentes tamanhos de tela
- [ ] Testar permissões
- [ ] Testar funcionalidade offline básica
- [ ] Testar performance (sem vazamentos de memória)

### 📊 Análise
- [ ] Verificar tamanho do bundle (`npx expo bundle-size`)
- [ ] Analisar performance (`npx expo bundle-analyzer`)
- [ ] Verificar configuração (`expo doctor`)

## Preparação para Lançamento

### 🔑 Credenciais e Configuração
- [ ] Conta Google Play Console criada
- [ ] Projeto Firebase configurado para produção
- [ ] Credenciais do Firebase atualizadas em `src/config/firebase.ts`
- [ ] EAS CLI instalado e configurado

### 📄 Documentação Play Store
- [ ] Descrição do app (curta e longa)
- [ ] Palavras-chave relevantes
- [ ] Categoria apropriada
- [ ] Classificação etária
- [ ] Política de privacidade
- [ ] Screenshots e vídeos promocionais

### 🚀 Build e Deploy
- [ ] Build de teste local (`npm run android`)
- [ ] Build de preview (`npm run build:android-preview`)
- [ ] Build de produção (`npm run build:android`)
- [ ] Upload manual ou automático (`npm run submit:android`)

## Comandos Úteis

```bash
# Teste local
npm run android

# Build para teste (APK)
npm run build:android-preview

# Build para produção (AAB)
npm run build:android

# Submit para Play Store
npm run submit:android

# Script completo
npm run build-playstore
```

## Status Atual

✅ **Concluído**: Estrutura básica, configuração mobile, permissões, autenticação básica
🔄 **Em Progresso**: Configuração Firebase, implementação de mapas
❌ **Pendente**: Assets visuais, testes, funcionalidades completas, deploy

## Próximos Passos Prioritários

1. **Configurar Firebase** com credenciais reais
2. **Criar assets visuais** (ícones, splash, screenshots)
3. **Integrar mapas reais** (Google Maps/Mapbox)
4. **Testar em dispositivo real**
5. **Fazer primeiro build de teste**
