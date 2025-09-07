# Configuração do Firebase para NomadGuide

## Passo 1: Criar um Projeto Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nomeie seu projeto como "nomadguide-app" ou similar
4. Siga as instruções para criar o projeto

## Passo 2: Configurar Firebase para Web

1. No console do Firebase, clique no ícone da web (</>)
2. Registre o app com o nome "NomadGuide"
3. Copie as configurações do Firebase

## Passo 3: Atualizar Configurações

Substitua as configurações no arquivo `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-project-id.firebaseapp.com",
  projectId: "seu-project-id",
  storageBucket: "seu-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};
```

## Passo 4: Configurar Serviços do Firebase

### 4.1 Authentication
1. No console, vá para "Authentication" > "Sign-in method"
2. Habilite "Email/Password"
3. Opcionalmente, habilite outros provedores (Google, Facebook, etc.)

### 4.2 Firestore Database
1. No console, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" para desenvolvimento
4. Selecione uma localização próxima

### 4.3 Storage
1. No console, vá para "Storage"
2. Clique em "Começar"
3. Aceite as regras padrão para desenvolvimento

## Passo 5: Configurar Regras de Segurança (Produção)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler e escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Localizações podem ser lidas por todos, escritas apenas por usuários autenticados
    match /locations/{locationId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }
    
    // Avaliações podem ser lidas por todos, escritas apenas pelo próprio usuário
    match /reviews/{reviewId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /location-photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Passo 6: Testar a Configuração

1. Execute o projeto: `npm start`
2. Teste o registro de usuário
3. Teste o login
4. Verifique se os dados estão sendo salvos no Firestore

## Próximos Passos

- [ ] Configurar Google Maps API para mapas reais
- [ ] Implementar notificações push
- [ ] Configurar analytics
- [ ] Adicionar mais provedores de autenticação
- [ ] Configurar backup automático

## Troubleshooting

### Erro de Node.js Version
Se você receber avisos sobre a versão do Node.js, o Firebase v12+ requer Node.js 20+. Para desenvolvimento, você pode:
1. Usar nvm para instalar Node.js 20+
2. Ou usar uma versão anterior do Firebase (v11.x) que suporta Node.js 18

### Erro de Permissões
Se você receber erros de permissão:
1. Verifique se as regras do Firestore estão configuradas corretamente
2. Certifique-se de que o usuário está autenticado
3. Verifique se o projeto Firebase está ativo

### Erro de Localização
Se a localização não funcionar:
1. Teste em um dispositivo físico
2. Verifique se as permissões foram concedidas
3. Para iOS, configure as permissões no Info.plist
