## 🔥 Como Configurar Firebase Console

### 1. Aplicar Regras de Segurança do Firestore

1. **Acesse o Firebase Console:** https://console.firebase.google.com/
2. **Selecione seu projeto:** nomadguide-5ea09  
3. **Vá para Firestore Database:**
   - No menu lateral esquerdo, clique em "Firestore Database"
   - Clique na aba "Rules" (Regras)

4. **Copie o conteúdo do arquivo:** `FIRESTORE_SECURITY_RULES.txt`
5. **Cole as regras** na área de edição do Firebase Console
6. **Clique em "Publish"** para aplicar as regras

### 2. Habilitar Autenticação

1. **No Firebase Console, vá para "Authentication"**
2. **Clique em "Get started"**
3. **Na aba "Sign-in method", habilite:**
   - Email/Password
   - Google (opcional)

### 3. Configurar Firestore Database

1. **Se ainda não criou o Firestore:**
   - Vá para "Firestore Database"
   - Clique em "Create database"
   - Escolha "Start in test mode" (temporário)
   - Selecione uma localização (nam5 - us-central)

### 4. Testar Configuração

1. **No seu terminal, execute:**
   ```bash
   npm start
   ```

2. **Abra o app no dispositivo via QR Code**

3. **Teste funcionalidades:**
   - Criar conta / fazer login
   - Adicionar dados de saúde
   - Criar viagens
   - Interagir com comunidade

### 5. Verificar se tudo está funcionando

✅ **Sinais de sucesso:**
- App inicia sem erros
- Login/registro funciona
- Dados são salvos no Firestore
- Não há erros de API key

❌ **Se ainda houver problemas:**
- Verifique se as credenciais do google-services.json estão corretas
- Confirme se o Firestore foi criado
- Verifique se a autenticação está habilitada

### Configuração Atual do Firebase:
- **Project ID:** nomadguide-5ea09
- **API Key:** AIzaSyC_IVGhFgR5AwyyYEi6lYiLOZtd8fFjrEg
- **App ID:** 1:1053963071181:android:207a38563eb737d9640384
- **Package:** com.nomad.nomadapp
