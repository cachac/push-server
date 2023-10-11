/* eslint-disable*/
import { register } from "register-service-worker";
/*
if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated() {
      console.log("New content is available; please refresh.");
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}*/

const getPublicKey = () => {
  return fetch("http://localhost:3000/key")
    .then((res) => res.arrayBuffer())
    .then((key) => new Uint8Array(key));
};

// function urlB64ToUint8Array(base64String) {
//   console.log(base64String);
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding)
//     .replace(/\-/g, "+")
//     .replace(/_/g, "/");

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }

//   console.log(outputArray);

//   return outputArray;
// }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js", {
      scope: "/",
      // add the path to the manifest.json file
      // so the browser can download the icons
      // specified in the manifest
      updateViaCache: "all",
      cacheName: "bali-pwa-cache",
      manifest: {
        url: "/manifest.json",
      },
    })
    .then((registration) => {
      console.log("Service worker registered:", registration);

      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          console.log("User is subscribed.", subscription);
        } else {
          console.log("User is not subscribed.");
        }
      });

      getPublicKey().then((key) => {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: key,
          })
          .then((res) => res.toJSON())
          .then((suscripcion) => {
            console.log(suscripcion);
            // TODO: Guardar suscripción
            // fetch("api/subscribe", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(suscripcion),
            // })
            //   .then(verificaSuscripcion)
            //   .catch(cancelarSuscripcion);
          })
          .catch((error) => {
            console.log("Service worker registration failed:", error);
          });
      });
    })
    .catch((error) => {
      console.log("Service worker registration failed:", error);
    });

  // let reg = null;

  // navigator.serviceWorker.ready
  //   .then(function (registration) {
  //     console.log("service worker is ready");
  //     reg = registration;
  //     getPublicKey().then((key) => {
  //       setTimeout(() => {
  //         reg.pushManager
  //           .subscribe({
  //             userVisibleOnly: true,
  //             applicationServerKey: key,
  //           })
  //           .then((res) => res.toJSON());
  //       }, 5000);
  //     });
  //   })
  //   .then(function (subscription) {
  //     console.log("Push notification subscription successful:", subscription);
  //   })
  //   .catch(function (error) {
  //     console.error("Push notification subscription failed:", error);
  //   });
}
