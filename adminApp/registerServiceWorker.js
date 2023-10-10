import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}sw.js`, {
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
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js", {
      scope: "/",
      // add the path to the manifest.json file
      // so the browser can download the icons
      // specified in the manifest
      updateViaCache: "none",
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
    })
    .catch((error) => {
      console.log("Service worker registration failed:", error);
    });
}
