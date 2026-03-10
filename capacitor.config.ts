import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.manga.tracker',
  appName: 'Koma.',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
