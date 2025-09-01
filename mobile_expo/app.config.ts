import { ExpoConfig } from 'expo/config';

export default ({ config }: { config: ExpoConfig }) => ({
  name: 'NomadGuide',
  slug: 'nomadguide',
  scheme: 'nomadguide',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: { supportsTablet: true },
  android: {
    package: 'com.nomad.nomadapp',
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' }
  },
  web: { bundler: 'metro', output: 'static', favicon: './assets/favicon.png' },
  experiments: { typedRoutes: true },
  extra: {
    firebase: {
      apiKey: 'AIzaSyC_IVGhFgR5AwyyYEi6lYiLOZtd8fFjrEg',
      authDomain: 'nomadguide-5ea09.firebaseapp.com',
      projectId: 'nomadguide-5ea09',
      storageBucket: 'nomadguide-5ea09.firebasestorage.app',
      messagingSenderId: '1053963071181',
      appId: '1:1053963071181:web:207a38563eb737d9640384'
    }
  }
});
