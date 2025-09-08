# 🔥 Configuração Firebase - NomadGuide

## 📱 Seu App ID Firebase:
```
App ID: 1:1053963071181:android:207a38563eb737d9640384
Package Name: com.nomad.nomadapp
```

## 📁 Passo 1: Colocar o google-services.json

**Coloque o arquivo aqui:**
```
/home/usuario/Documentos/nomad_app/NomadGuide/google-services.json
```

📌 **IMPORTANTE**: O arquivo deve ficar na **raiz** do projeto, no mesmo nível que `package.json`

## 🔧 Passo 2: Pegar as credenciais do google-services.json

Abra seu arquivo `google-services.json` e localize estes valores:

```json
{
  "project_info": {
    "project_id": "SEU_PROJECT_ID_AQUI",
    "firebase_url": "https://SEU_PROJECT_ID_AQUI-default-rtdb.firebaseio.com",
    "project_number": "1053963071181",
    "storage_bucket": "SEU_PROJECT_ID_AQUI.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:1053963071181:android:207a38563eb737d9640384",
        "android_client_info": {
          "package_name": "com.nomad.nomadapp"
        }
      },
      "api_key": [
        {
          "current_key": "SUA_API_KEY_AQUI"
        }
      ]
    }
  ]
}
```

## 🔑 Passo 3: Atualizar src/config/firebase.ts

Substitua os valores no arquivo `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_DO_GOOGLE_SERVICES", // Do campo "current_key"
  authDomain: "SEU_PROJECT_ID.firebaseapp.com", // Use o project_id
  projectId: "SEU_PROJECT_ID", // Do campo "project_id"
  storageBucket: "SEU_PROJECT_ID.appspot.com", // Do campo "storage_bucket"
  messagingSenderId: "1053963071181", // Do campo "project_number"
  appId: "1:1053963071181:android:207a38563eb737d9640384" // Do campo "mobilesdk_app_id"
};
```

## 📦 Passo 4: Instalar dependência (se necessário)

```bash
cd /home/usuario/Documentos/nomad_app/NomadGuide
npm install @react-native-google-signin/google-signin
```

## 🔍 Passo 5: Verificar configuração

Após colocar o `google-services.json` e atualizar as credenciais, execute:

```bash
cd /home/usuario/Documentos/nomad_app/NomadGuide
expo prebuild --clean
```

## 🎯 Checklist de Configuração:

- [ ] `google-services.json` na pasta raiz
- [ ] `apiKey` atualizada no firebase.ts
- [ ] `projectId` atualizada no firebase.ts  
- [ ] `storageBucket` atualizada no firebase.ts
- [ ] Package name correto: `com.nomad.nomadapp`
- [ ] App ID correto: `1:1053963071181:android:207a38563eb737d9640384`

## 🚨 Configurações Necessárias no Firebase Console:

### 1. Authentication
- Vá em Authentication > Sign-in method
- Ative: Email/Password, Google, Anonymous (opcional)

### 2. Firestore Database
- Crie o banco de dados
- Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Storage (opcional)
- Configure para upload de imagens
- Regras de segurança similares

## ✅ Teste da Configuração:

Depois de configurar tudo, teste se está funcionando:

```bash
cd /home/usuario/Documentos/nomad_app/NomadGuide
npm start
```

No app, tente fazer login - se funcionar, o Firebase está configurado! 🎉

---

**❗ Lembre-se**: 
- Nunca commite o `google-services.json` no git (já está no .gitignore)
- Sempre use as credenciais EXATAS do seu arquivo
- O package name deve ser EXATAMENTE: `com.nomad.nomadapp`
