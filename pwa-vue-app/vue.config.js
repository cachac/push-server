const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "/src/service-worker.js",
      skipWaiting: true, // To ensure the new service worker is activated immediately
      clientsClaim: true, // To take control of open tabs without a hard refresh
    },
  },
});

// module.exports = {
//   // options...
//   pwa: {
//     workboxPluginMode: "InjectManifest",
//     workboxOptions: {
//       swSrc: "./src/sw.js",
//     },
//   },
// };
