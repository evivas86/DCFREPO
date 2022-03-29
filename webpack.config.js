module.exports = (config) => {
  config.resolve.fallback = {
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify")
  }
  return config;
};
