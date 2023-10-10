self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("activated");
});

// self.addEventListener("push", (event) => {
//   console.log("push");
//   // const data = JSON.parse(e.data.text());
//   // let push_message = event.data.json();
//   // click_open_url = push_message.notification.data.url;

//   // console.log(data);
// });

// self.addEventListener("push", function (event) {
//   let push_message = event.data.json();
//   // push notification can send event.data.json() as well
//   click_open_url = push_message.notification.data.url;
//   const options = {
//     body: push_message.notification.body,
//     icon: push_message.notification.icon,
//     image: push_message.notification.image,
//     tag: "alert",
//   };
//   event.waitUntil(
//     self.registration.showNotification(push_message.notification.title, options)
//   );
// });
