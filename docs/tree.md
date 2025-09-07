nomadguide/
├── backend/                  # Código do servidor em Go (Golang)
│   ├── api/                  # Definição de rotas e middlewares
│   │   ├── middleware.go
│   │   └── router.go
│   ├── config/               # Configurações do ambiente e do app
│   │   └── config.go
│   ├── handlers/             # Lógica para lidar com as requisições HTTP
│   │   ├── auth_handler.go
│   │   ├── budget_handler.go
│   │   ├── health_handler.go
│   │   ├── location_handler.go
│   │   ├── transaction_handler.go
│   │   └── user_handler.go
│   ├── models/               # Estruturas (structs) de dados que espelham o Firestore
│   │   ├── budget.go
│   │   ├── health.go
│   │   ├── transaction.go
│   │   └── user.go
│   ├── services/             # Lógica de negócio principal da aplicação
│   │   ├── budget_service.go
│   │   ├── currency_service.go
│   │   └── health_service.go
│   ├── store/                # Camada de acesso ao banco de dados (Firestore)
│   │   ├── firestore.go      # Inicialização do cliente Firestore
│   │   ├── budget_store.go
│   │   └── user_store.go
│   ├── utils/                # Funções utilitárias (formatação, validação)
│   │   └── formatter.go
│   ├── go.mod                # Gerenciador de dependências do Go
│   ├── go.sum
│   └── main.go               # Ponto de entrada da aplicação backend
│
├── mobile/                   # Código do cliente em React Native
│   ├── android/              # Pasta com arquivos nativos do Android
│   ├── ios/                  # Pasta com arquivos nativos do iOS
│   ├── src/
│   │   ├── assets/           # Imagens, fontes, etc.
│   │   │   └── styles/       # Estilos globais (se necessário)
│   │   │       └── globalStyles.js
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── common/       # Botões, Inputs, Modais
│   │   │   ├── layout/       # Navbar, Sidebar, Footer
│   │   │   ├── budget/       # Componentes para a seção de orçamento
│   │   │   └── health/       # Componentes para a seção de saúde
│   │   ├── context/          # Gerenciamento de estado global (Auth, User)
│   │   │   ├── AuthContext.js
│   │   │   └── UserContext.js
│   │   ├── hooks/            # Hooks customizados (ex: useFetch, useAuth)
│   │   │   └── useAuth.js
│   │   ├── navigation/       # Configuração das rotas/navegação do App
│   │   │   └── AppNavigator.js
│   │   ├── screens/          # As "páginas" do seu aplicativo
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── BudgetScreen.jsx
│   │   │   ├── HealthScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   └── SettingsScreen.jsx
│   │   ├── services/         # Lógica de chamada à API do backend Go
│   │   │   ├── api.js        # Configuração do cliente HTTP (ex: Axios)
│   │   │   ├── budgetService.js
│   │   │   └── authService.js
│   │   └── App.js            # Componente raiz que carrega o AppNavigator
│   ├── .env                  # Variáveis de ambiente
│   ├── app.json              # Arquivo de configuração do App (nome, ícone, etc.)
│   └── package.json          # Dependências e scripts do frontend
│
├── docs/                     # Documentação original do projeto
│   ├── NomadGuide_Database_Architecture.md
│   ├── NomadGuide_Product_Specification.md
│   └── README.md             # (O README original do NomadWallet)
│
├── .gitignore                # Arquivos e pastas a serem ignorados pelo Git
└── README.md                 # README principal do projeto (atualizado para a nova stack)
