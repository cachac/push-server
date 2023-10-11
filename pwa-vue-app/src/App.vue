<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  mounted() {
    console.log("mounted");

    if ("serviceWorker" in navigator) {
      console.log("service worker is supported");

      navigator.serviceWorker
        .register("/service-worker.js", {
          scope: "/",
          updateViaCache: "all",
          cacheName: "bali-pwa-cache",
          manifest: { url: "/manifest.json" },
        })
        .then((registration) => {
          console.log("Service worker registered");

          registration.pushManager.getSubscription().then((subscription) => {
            if (subscription) {
              console.log("User is subscribed.", subscription);
            } else {
              console.log("User is not subscribed.");
            }
          });

          this.getPublicKey().then((key) => {
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: key,
              })
              .then((res) => res.toJSON())
              .then((suscripcion) => {
                console.log("User subscribed");

                fetch("http://localhost:3000/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(suscripcion),
                })
                  .then((resSubscribe) => {
                    console.log("Response subscribe:", resSubscribe.ok);
                  })
                  .catch(() => {});
              })
              .catch((error) => {
                console.log("Service worker subscription failed:", error);
              });
          });
        });
    }
  },
  methods: {
    getPublicKey() {
      return fetch("http://localhost:3000/key")
        .then((res) => res.arrayBuffer())
        .then((key) => new Uint8Array(key));
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
