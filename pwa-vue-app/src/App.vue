<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    noti: {{ userNotifications }}** permission: {{ permission }} //
    <p v-if="this.permission === 'denied'">"Notificaciones Denegadas"</p>
    <button v-else @click="subscribe">
      {{ userSubscriptionStatus }}
    </button>

    <br />
    <br />
    <br />
    <button @click="push">PUSH</button>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      userNotifications: false,
      permission: null, // 'granted', 'denied', or 'default':
      registration: null,
    };
  },
  computed: {
    userSubscriptionStatus() {
      return this.userNotifications
        ? "Desactivar Notificaciones"
        : "Activar Notificaciones";
    },
  },
  mounted() {
    console.log("mounted");

    this.permission = Notification.permission;

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
          this.registration = registration;

          registration.pushManager.getSubscription().then((subscription) => {
            if (subscription) {
              console.log("User is subscribed.");
              this.userNotifications = true;
            } else {
              console.log("User is not subscribed.");
              this.userNotifications = false;
            }
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
    unSubscribe() {
      this.registration.pushManager.getSubscription().then((subscription) => {
        if (subscription)
          subscription
            .unsubscribe()
            .then(() => {
              console.log("User unsubscribed");
              this.userNotifications = false;

              fetch("http://localhost:3000/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  clientid: "123",
                  subscription,
                }),
              })
                .then((resUnsubscribe) => {
                  console.log("Response unsubscribe:", resUnsubscribe.ok);
                })
                .catch(() => {});
            })
            .catch(() => {
              console.log("Unsubscribe failed");
            });
      });
    },
    subscribe() {
      if (this.userNotifications) return this.unSubscribe();

      this.getPublicKey().then((key) => {
        this.registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: key,
          })
          .then((res) => res.toJSON())
          .then((subscription) => {
            console.log("User subscribed");
            this.userNotifications = true;

            fetch("http://localhost:3000/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                clientid: "123",
                subscription,
              }),
            })
              .then((resSubscribe) => {
                console.log("Response subscribe:", resSubscribe.ok);
              })
              .catch(() => {});
          })
          .finally(() => {
            this.permission = Notification.permission;
          })
          .catch((error) => {
            console.log("Service worker subscription failed:", error);
            this.userNotifications = false;
          });
      });
    },
    push() {
      fetch("http://localhost:3000/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientid: "123",
          message: {
            title: "Hello World",
            body: "Random message" + Math.random(),
            url: "https://storylabs.dev",
          },
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("Response push:", res);
        })
        .catch(() => {});
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
