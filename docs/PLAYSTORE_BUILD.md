# Guia de Build para Google Play Store

## Configuração para Produção

### 1. Configuração do EAS Build

Instale o EAS CLI:
```bash
npm install -g eas-cli
```

Faça login no Expo:
```bash
eas login
```

Configure o projeto:
```bash
eas build:configure
```

### 2. Arquivo eas.json (será criado automaticamente)

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Build para Google Play Store

Para build de produção (AAB):
```bash
eas build --platform android --profile production
```

Para build de teste (APK):
```bash
eas build --platform android --profile preview
```

### 4. Configurações Importantes para Play Store

#### app.json - Configurações obrigatórias:
- `android.package`: Identificador único (ex: com.nomadguide.app)
- `android.versionCode`: Número da versão (inteiro)
- `version`: Versão legível (ex: 1.0.0)
- `android.permissions`: Permissões necessárias

#### Ícones necessários:
- `icon`: Ícone principal (1024x1024)
- `android.adaptiveIcon.foregroundImage`: Ícone adaptativo (1024x1024)

### 5. Antes do Build

1. **Teste em dispositivo real**:
   ```bash
   npm run android
   ```

2. **Verifique permissões**:
   - Localização
   - Câmera
   - Galeria

3. **Configure Firebase para produção**:
   - Atualize as credenciais em `src/config/firebase.ts`
   - Configure regras de segurança no Firestore

### 6. Submit para Play Store

Depois do build, faça o submit:
```bash
eas submit --platform android
```

### 7. Checklist de Qualidade

- [ ] App funciona offline (funcionalidades básicas)
- [ ] Todas as permissões estão documentadas
- [ ] Ícones e splash screen configurados
- [ ] Testado em diferentes tamanhos de tela
- [ ] Performance otimizada
- [ ] Não há vazamentos de memória
- [ ] Firebase configurado para produção

### 8. Configurações de Release

No Google Play Console:
- Configure as capturas de tela
- Adicione descrição e palavras-chave
- Configure a classificação etária
- Adicione política de privacidade
- Configure preços e distribuição

## Comandos Úteis

```bash
# Verificar configuração
expo doctor

# Limpar cache
expo r -c

# Build local para teste
npx expo run:android

# Verificar tamanho do bundle
npx expo bundle-size

# Analisar bundle
npx expo bundle-analyzer
```
