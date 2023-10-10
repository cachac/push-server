self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("activated");
});

self.addEventListener("push", (event) => {
  console.log("push");
  const data = JSON.parse(e.data.text());
  let push_message = event.data.json();
  click_open_url = push_message.notification.data.url;

  console.log(data);
});
