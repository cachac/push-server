/* eslint-disable*/
// importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");
// importScripts("/precache-manifest.3a4b1d8b9e6f8e6c9a0c3c5e6c9a0c3.js");

import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.__precacheManifest = [].concat(self.__precacheManifest || []);

// workbox.setConfig({
//   debug: true,
// });

self.addEventListener("install", (e) => {
  console.log("installed test");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("activated test");
});

//Web Push Notifications//
let click_open_url;
self.addEventListener("push", function (event) {
  const push_message = JSON.parse(event.data.text());
  console.log("push_message", push_message);
  // push notification can send event.data.json() as well
  click_open_url = push_message.url;
  const options = {
    body: push_message.body,
    // icon: push_message.icon,
    // image: push_message.image,
    tag: "alert",
  };
  event.waitUntil(
    self.registration.showNotification(push_message.title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  if (click_open_url) {
    const promiseChain = clients.openWindow(click_open_url);
    event.waitUntil(promiseChain);
  }
});
