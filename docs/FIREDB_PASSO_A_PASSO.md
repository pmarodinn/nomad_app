# FireDB (Firestore) – Passo a passo muito detalhado

Última atualização: 2025-08-30

Objetivo: Deixar o Firestore pronto para o app NomadGuide, com regras de segurança corretas e índices. Vamos fazer tudo pelo site do Firebase (console). Você só vai clicar, copiar e colar.

Importante antes de começar
- Firestore = banco de dados do Firebase (chamaremos de FireDB).
- Vamos salvar somente textos (strings) e números (float).
- Não vamos salvar localização exata (nada de lat/lng). Apenas a cidade (ex.: "Lisboa").
- Já existe um arquivo de regras pronto em `docs/firestore.rules`.

O que você vai fazer (resumo)
1) Criar um projeto Firebase.
2) Ativar o Firestore no modo produção.
3) Colar as regras (copiar e colar nosso arquivo) e publicar.
4) Criar os índices (3 índices compostos).
5) Ativar Autenticação (Email/Password).
6) Testar as regras no Playground (para ver Allow/Deny).
7) Registrar o app Android e baixar `google-services.json` (para me enviar).

Vamos lá, passo a passo

1) Criar o projeto no Firebase
1. Abra: https://console.firebase.google.com (faça login com sua conta Google).
2. Clique em "Add project" (Adicionar projeto).
3. Nome do projeto: NomadGuide (pode ser outro nome se quiser).
4. Clique em "Continue" (Continuar).
5. Google Analytics: pode Desativar por enquanto. Clique em "Create project" (Criar projeto).
6. Espere a barrinha terminar e clique em "Continue".

2) Ativar o Firestore (o banco de dados)
1. No menu lateral, clique em "Build" > "Firestore Database".
2. Clique no botão azul "Create database".
3. Escolha "Start in production mode" (modo produção). Clique em "Next".
4. Escolha a região (ex.: europe-west). Clique em "Enable" (Habilitar).

3) Colar as Regras de Segurança (importantíssimo)
1. Ainda em "Firestore Database", vá na aba "Rules" (Regras) no topo.
2. Você verá um editor de texto com regras.
3. No seu computador, abra o arquivo `docs/firestore.rules` do projeto.
4. Selecione tudo (Ctrl+A) e copie (Ctrl+C).
5. Volte para o editor de regras do Firebase e apague o que estiver lá.
6. Cole (Ctrl+V) o conteúdo do nosso `firestore.rules`.
7. Clique no botão azul "Publish" (Publicar).

O que essas regras fazem
- Só o usuário logado pode ler/gravar seus próprios dados.
- Bloqueiam campos proibidos como "lat", "lng", "latitude", "longitude", "geohash" (não queremos geolocalização).
- Validam tamanhos de texto e formatos (datas como "YYYY-MM-DD", horários "HH:MM").
- Estrutura esperada:
  - `users/{uid}` (documento do perfil do usuário – campos como displayName, baseCurrency, currentCity, timezone)
  - Subcoleções: `budgets`, `transactions`, `recurring`, `medicines`, `timezones`.

4) Criar os Índices (para buscas rápidas)
1. Vá em "Firestore Database" > aba "Indexes".
2. Seção "Composite indexes" (Índices Compostos).
3. Clique em "Create index" (Criar índice) e crie estes três:
   - Índice 1 (para transactions):
     - Collection ID: transactions
     - Fields:
       - date – Descending
       - type – Ascending
     - Query scope: Collection
     - Clique em Save
   - Índice 2 (para transactions):
     - Collection ID: transactions
     - Fields:
       - currency – Ascending
       - date – Descending
     - Query scope: Collection
     - Save
   - Índice 3 (para recurring):
     - Collection ID: recurring
     - Fields:
       - active – Ascending
       - frequencyDays – Ascending
     - Query scope: Collection
     - Save

Dica: você também tem o arquivo `docs/firestore.indexes.json` com a definição. Se preferir, pode criar manualmente como acima (é rápido).

5) Ativar Autenticação (para ter usuários)
1. Menu lateral: "Build" > "Authentication".
2. Clique em "Get started" (Começar).
3. Aba "Sign-in method" > clique em "Email/Password" > Enable (habilitar) > Save.
4. (Opcional) Ative "Google" também, se quiser login com Google.

6) Testar as Regras (Playground)
1. Vá em "Firestore Database" > aba "Rules".
2. Clique em "Rules Playground" (geralmente um botão no topo direito da aba Rules).
3. Em "Authentication", preencha um UID de teste (ex.: 123testuser). Isso simula um usuário logado.
4. Em "Path", coloque: `/databases/(default)/documents/users/123testuser`
5. Escolha a ação "Write" (ou Create/Update).
6. No corpo (Body), cole este JSON (exemplo VÁLIDO):
```json
{
  "displayName": "Ana",
  "baseCurrency": "EUR",
  "currentCity": "Lisboa",
  "currentCountry": "Portugal",
  "timezone": "Europe/Lisbon"
}
```
7. Clique em "Run" (Executar). Deve aparecer "Allow".
8. Agora teste um JSON com campo proibido (para ver "Deny"):
```json
{
  "displayName": "Ana",
  "currentCity": "Lisboa",
  "lat": 38.72
}
```
9. Clique em "Run". Deve aparecer "Deny" (bloqueado). Perfeito!

7) Registrar o App Android (para gerar o arquivo do app)
1. Vá no topo esquerdo (ao lado do nome do projeto) e clique na engrenagem "Project Settings".
2. Aba "General" > seção "Your apps".
3. Clique no ícone Android.
4. Android package name (nome do pacote): use algo como `com.nomadguide.app` (anote isso).
5. Clique em "Register app".
6. Baixe o arquivo `google-services.json` que o site vai oferecer.
7. Guarde esse arquivo e me envie (eu integro no app Android).

Perguntas frequentes (rápidas)
- Posso criar ambiente de desenvolvimento e produção?
  - Sim. Crie outro projeto (ex.: nomadguide-dev). Repita tudo acima. Você terá dois `google-services.json` (um dev, um prod).
- Onde coloco chaves de APIs de cidade/IP (GeoDB Cities, ipapi.co)?
  - Essas chaves vão no app (Android), não no Firestore. Eu configuro para não aparecer no repositório público (arquivos locais/segredos).
- Posso escrever dados pelo Console do Firestore?
  - Pode, mas o Console ignora as regras. Use o Rules Playground para testar regras de verdade.

Pronto! Seu FireDB está configurado.
- Se algo der errado, volte à aba Rules e confira se você realmente colou o conteúdo do `docs/firestore.rules` e clicou em Publish.
- Envie o `google-services.json` quando estiver pronto. Eu sigo com o app.
