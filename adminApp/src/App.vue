<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

const swReg = ref(null);

// window.addEventListener("load", function () {
//   console.log("event listener push");
//   navigator.serviceWorker.register("/sw.js").then(function (reg) {
//     swReg = reg;
//     swReg.pushManager.getSubscription(); // .then(verificaSuscripcion);
//   });
// });

const allow = () => {
  if (!swReg.value) return console.log("No hay registro de SW");

  getPublicKey().then((key) => {
    console.log("key", key);
    console.log("swReg.value", swReg.value);

    swReg.value.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      })
      .then((sub) => {
        console.log("sub", sub);
      })
      .catch((e) => {
        console.log("e", e);
      });
  });
};

const getPublicKey = () => {
  return fetch("http://localhost:3000/key")
    .then((res) => res.arrayBuffer())
    .then((key) => new Uint8Array(key));
};

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// onMounted(async () => {
//   navigator.serviceWorker
//     .register("./sw.js")
//     .then((registration) => {
//       swReg.value = registration;
//       console.log("registrated", registration);

//       const subscribeOptions = {
//         userVisibleOnly: true,
//         applicationServerKey: urlB64ToUint8Array(
//           "BLVMazKECWEPNJbqCsfa-Y-SUV28E5s80bLaCKOsro5dITdM2ZWtNigTR1DZIM1niiglOPHF3bGZjXpYYO4gQpa"
//         ),
//       };

//       return registration.pushManager.subscribe(subscribeOptions);
//     })
//     .then(function (pushSubscription) {
//       console.log("PushSubscription: ", JSON.stringify(pushSubscription));
//       //post to our subscriptions service
//       //http://localhost:3030/subscriptions
//       return pushSubscription;
//     });

//   //

//   //   // swReg.value = reg;
//   //   // reg.pushManager.getSubscription().then((subs) => {
//   //   //   console.log("subs", subs);
//   //   // }); // .then(verificaSuscripcion);
//   // });
// });
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <button @click="allow">Allow Notifications</button>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
