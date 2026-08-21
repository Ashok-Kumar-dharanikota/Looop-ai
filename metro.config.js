const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (!config.resolver.sourceExts.includes('mjs')) {
  config.resolver.sourceExts.push('mjs');
}
if (!config.resolver.sourceExts.includes('sql')) {
  config.resolver.sourceExts.push('sql');
}
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

const nativeOnlyModules = [
  '@react-native-firebase/app',
  '@react-native-firebase/auth',
  '@react-native-firebase/app-check',
  '@react-native-firebase/ai',
  'react-native-nitro-google-signin',
  'react-native-nitro-modules',
  'react-native-purchases',
  'react-native-purchases-ui',
  'react-native-keyboard-controller',
  'react-native-mmkv',
  'expo-sqlite',
  'expo-speech-recognition',
  'expo-background-task',
  'expo-drizzle-studio-plugin',
  'vexo-analytics',
  '@shopify/react-native-skia',
];

const webStubPath = path.resolve(__dirname, 'src/stubs/web-native-stub.js');
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (
      nativeOnlyModules.some(
        (pkg) => moduleName === pkg || moduleName.startsWith(`${pkg}/`)
      )
    ) {
      return {
        type: 'sourceFile',
        filePath: webStubPath,
      };
    }
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

