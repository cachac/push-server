const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "/src/service-worker.js",
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
