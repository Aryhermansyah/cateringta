const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['expo-router'],
      }
    },
    argv
  );

  config.output = {
    ...config.output,
    publicPath: '/cateringta/',
  };

  // Tambahkan ini untuk menangani masalah MIME type
  config.module.rules.push({
    test: /\.js$/,
    include: path.resolve(__dirname, 'node_modules/expo-router'),
    use: 'babel-loader',
    type: 'javascript/auto',
  });

  return config;
}; 