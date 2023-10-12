import webpush from "web-push";
import urlsafeBase64 from "urlsafe-base64";
// import vapid from "../../vapid.json";

let subscriptions = [];

webpush.setVapidDetails(
  "mailto:info@storylabs.dev",

  "BLVMazKECWEPNJbqCsfa-Y-SUV28E5s80bLaCKOsro5dITdM2ZWtNigTR1DZIM1niiglOPHF3bGZjXpYYO4gQpQ",
  "x5sv6IZ4XWkWjBIC_tPstpDT_EtKrrPhFYxYSrdzJT0"
  // vapid.publicKey,
  // vapid.privateKey
);

export const GET_KEY = (c, next) => {
  try {
    return c.text(
      urlsafeBase64.decode(
        "BLVMazKECWEPNJbqCsfa-Y-SUV28E5s80bLaCKOsro5dITdM2ZWtNigTR1DZIM1niiglOPHF3bGZjXpYYO4gQpQ"
      )
    );
  } catch (error) {
    c.error = {
      status: 500,
      code: 2002,
      message: `URL get error`,
      userMessage: `Internal Server Error...`,
    };
    return next();
  }
};

export const SUBSCRIBE = async (c, next) => {
  try {
    console.log("subscription");
    const subscription = await c.req.json();

    console.log("subscription", subscription);

    // TODO: save to DB
    subscriptions.push(subscription);

    return c.json({ ok: true });
  } catch (error) {
    c.error = {
      status: 500,
      code: 2001,
      message: `Subscription Error`,
      userMessage: `Internal Server Error...`,
    };
    return next();
  }
};

export const UNSUBSCRIBE = async (c, next) => {
  try {
    console.log("un-subscribe");
    const subscription = await c.req.json();

    // TODO: delete BD
    subscriptions = subscriptions.filter(
      (e) => e.clientid !== subscription.clientid
    );

    return c.json({ ok: true });
  } catch (error) {
    c.error = {
      status: 500,
      code: 2001,
      message: `Subscription Error`,
      userMessage: `Internal Server Error...`,
    };
    return next();
  }
};

export const PUSH = async (c, next) => {
  const { clientid, message } = await c.req.json();
  console.log("message", message);
  console.log("clientid", clientid);

  const clients = subscriptions.filter((e) => e.clientid === clientid);
  if (!clients.length) {
    return c.json({
      ok: false,
      msg: "invalid clientid",
    });
  }

  const resultNotifications = clients.map(({ clientid, subscription }) => {
    console.log("subscription", subscription);
    return webpush
      .sendNotification(subscription, JSON.stringify(message))
      .then((res) => {
        console.log("Notification sent ", res.statusCode);

        return {
          clientid,
          ok: true,
        };
      })
      .catch((err) => {
        console.error("Notification fails", err);

        return {
          clientid,
          ok: false,
          subscription,
          delete: err.statusCode === 410,
        };
      });
  });

  // TODO: delete subscription if statusCode === (410).
  return Promise.all(resultNotifications).then((res) => {
    res.forEach((e) => {
      if (e.delete) {
        subscriptions = subscriptions.filter(
          (sub) => sub.subscription.endpoint !== e.subscription.endpoint
        );
      }
    });

    return c.json({ res });
  });
};
