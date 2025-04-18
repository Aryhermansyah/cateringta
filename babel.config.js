module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Tambahkan ini untuk memastikan expo-router dikompilasi dengan benar
      '@babel/plugin-transform-export-namespace-from',
      'react-native-reanimated/plugin',
      require.resolve('expo-router/babel'),
    ],
  };
}; 