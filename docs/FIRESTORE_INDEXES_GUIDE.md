# Guia de Configuração dos Índices do Firestore

## Problema
O erro "The query requires an index" ocorre quando o Firestore precisa de índices compostos para consultas que envolvem múltiplos campos com filtros where() e orderBy().

## Índices Necessários

### 1. Coleção `budgets`

#### Índice 1: userId + createdAt
- **Campos**: `userId` (ASC), `createdAt` (DESC)
- **Uso**: Buscar orçamentos do usuário ordenados por data de criação
- **Consulta**: `getUserBudgets()`

#### Índice 2: userId + startDate + endDate + createdAt
- **Campos**: `userId` (ASC), `startDate` (ASC), `endDate` (ASC), `createdAt` (DESC)
- **Uso**: Buscar orçamento atual do usuário baseado em período
- **Consulta**: `getCurrentBudget()` e `subscribeToCurrentBudget()`

### 2. Coleção `expenses`

#### Índice 1: userId + date (DESC)
- **Campos**: `userId` (ASC), `date` (DESC)
- **Uso**: Buscar gastos do usuário ordenados por data (mais recentes primeiro)
- **Consultas**: `getUserExpenses()`, `subscribeToRecentExpenses()`

#### Índice 2: userId + date (ASC)
- **Campos**: `userId` (ASC), `date` (ASC)
- **Uso**: Buscar gastos em período específico
- **Consulta**: `getUserExpenses()` com filtro de data

### 3. Coleção `medications`

#### Índice: userId + createdAt
- **Campos**: `userId` (ASC), `createdAt` (DESC)
- **Uso**: Buscar medicamentos do usuário
- **Consulta**: Health service

### 4. Coleção `healthMetrics`

#### Índice: userId + recordedAt
- **Campos**: `userId` (ASC), `recordedAt` (DESC)
- **Uso**: Buscar métricas de saúde do usuário
- **Consulta**: Health service

## Como Aplicar os Índices

### Opção 1: Firebase Console (Recomendado)
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Firestore Database** > **Indexes**
4. Clique em **Add Index**
5. Configure cada índice conforme especificado acima

### Opção 2: Firebase CLI
```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Fazer login
firebase login

# 3. Inicializar no projeto
firebase init firestore

# 4. Usar o arquivo firestore.indexes.json criado
firebase deploy --only firestore:indexes
```

### Opção 3: Aguardar Links dos Logs
Quando você executa a aplicação, o Firebase gera automaticamente links nos logs do console para criar os índices necessários. Procure por mensagens como:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

## URLs dos Índices Específicos

### Budgets - userId + createdAt
```
https://console.firebase.google.com/project/[PROJECT_ID]/firestore/indexes/add?field=userId&order=ASCENDING&field=createdAt&order=DESCENDING&collection=budgets
```

### Budgets - userId + startDate + endDate + createdAt
```
https://console.firebase.google.com/project/[PROJECT_ID]/firestore/indexes/add?field=userId&order=ASCENDING&field=startDate&order=ASCENDING&field=endDate&order=ASCENDING&field=createdAt&order=DESCENDING&collection=budgets
```

### Expenses - userId + date (DESC)
```
https://console.firebase.google.com/project/[PROJECT_ID]/firestore/indexes/add?field=userId&order=ASCENDING&field=date&order=DESCENDING&collection=expenses
```

## Status da Criação
- ⏳ **Building**: Índice sendo criado (pode levar alguns minutos)
- ✅ **Ready**: Índice pronto para uso
- ❌ **Error**: Erro na criação (verificar configuração)

## Verificação
Após criar os índices, teste as funcionalidades da aplicação:
1. Tela de Orçamento
2. Adicionar gastos
3. Visualizar histórico
4. Métricas de saúde

Se ainda houver erros, verifique os logs do console para novos links de índices.
