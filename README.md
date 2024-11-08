src/
├── assets/                   # Static assets (images, fonts, etc.)
│   ├── images/
│   ├── icons/
│   └── styles/
│       └── tailwind.css
├── components/               # Reusable components (UI elements)
│   ├── Button.tsx
│   ├── Navbar.tsx
│   └── PostCard.tsx
├── config/                   # Configuration files (API, Firebase, etc.)
│   ├── apolloClient.ts       # Apollo GraphQL client
│   └── firebaseConfig.ts     # Firebase configuration
├── constants/                # App-wide constants
│   ├── routes.ts             # Route paths
│   └── actionTypes.ts        # Redux action types
├── features/                 # Feature-specific logic
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── services/
│   │   │   ├── authService.ts  # Firebase Auth logic
│   │   └── store/
│   │       └── authSlice.ts    # Redux slice for auth
│   ├── feed/
│   │   ├── components/
│   │   │   ├── NewsFeed.tsx
│   │   │   └── PostForm.tsx
│   │   ├── services/
│   │   │   └── feedService.ts  # GraphQL API calls
│   │   └── store/
│   │       └── feedSlice.ts    # Redux slice for feed
│   └── profile/
│       ├── components/
│       │   └── ProfileCard.tsx
│       ├── services/
│       │   └── profileService.ts
│       └── store/
│           └── profileSlice.ts
├── hooks/                    # Reusable custom hooks
│   ├── useAuth.ts            # Hook for authentication logic
│   ├── useFeed.ts            # Hook for fetching feed data
│   └── useProfile.ts         # Hook for profile management
├── layouts/                  # Layout components
│   ├── AuthLayout.tsx        # Layout for authentication pages
│   └── MainLayout.tsx        # Layout for main application
├── pages/                    # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   └── NewsFeed.tsx
├── store/                    # Global Redux store configuration
│   ├── store.ts              # Redux store setup
│   └── rootReducer.ts        # Combine all reducers
├── types/                    # TypeScript interfaces and types
│   ├── userTypes.ts          # User-related types
│   ├── postTypes.ts          # Post-related types
│   └── apiResponse.ts        # API response formats
├── utils/                    # Helper functions
│   ├── formatDate.ts         # Format dates consistently
│   ├── validateInput.ts      # Input validation functions
│   └── logger.ts             # Centralized logging utility
├── App.tsx                   # Main app entry point
├── main.tsx                  # Application root
└── index.css                 # Global styles
