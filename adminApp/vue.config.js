module.exports = {
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./sw.js",
    },
  },
};