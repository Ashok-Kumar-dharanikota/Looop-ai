import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_VARIANT = process.env.APP_VARIANT || 'development';

  const isDev = APP_VARIANT === 'development';
  const isPreview = APP_VARIANT === 'preview';
  const isProd = APP_VARIANT === 'production';

  const getPackageName = () => {
    if (isDev) return 'com.cornerstonestudio.looopai.dev';
    if (isPreview) return 'com.cornerstonestudio.looopai.preview';
    return 'com.cornerstonestudio.looopai';
  };

  const getAppName = () => {
    if (isDev) return 'Looop (Dev)';
    if (isPreview) return 'Looop (Preview)';
    return 'Looop';
  };

  const getGoogleServicesFile = () => {
    return process.env.GOOGLE_SERVICES_JSON || './firebase/google-services.json';
  };

  return {
    ...config,
    name: getAppName(),
    slug: 'Looop',
    version: '1.0.0',
    scheme: isProd ? 'looop' : `looop-${APP_VARIANT}`,
    orientation: 'portrait',
    icon: './assets/appicons/logo.png',
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: getPackageName(),
      icon: './assets/appicons/logo.png',
    },
    android: {
      package: getPackageName(),
      googleServicesFile: getGoogleServicesFile(),
      adaptiveIcon: {
        backgroundColor: '#FAF9F6',
        foregroundImage: './assets/appicons/logo.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/appicons/logo.png',
    },
    updates: {
      url: 'https://u.expo.dev/2929675f-fa56-4984-8e52-3a425e713acd',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#FAF9F6',
          image: './assets/appicons/logo.png',
          imageWidth: 120,
        },
      ],
      'expo-background-task',
      'expo-sqlite',
      'expo-localization',
      'expo-notifications',
      "expo-speech-recognition",
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      [
        'react-native-nitro-google-signin',
        {
          androidGoogleServicesFile: getGoogleServicesFile(),
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
          },
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '2929675f-fa56-4984-8e52-3a425e713acd',
      },
      appVariant: APP_VARIANT,
      previewDebugToken: '90C2C9E8-5F63-4A15-88E1-216179365622',
    },
    owner: 'ashdpauls-team',
  };
};
