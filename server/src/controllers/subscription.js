import webpush from "web-push";
import urlsafeBase64 from "urlsafe-base64";
import vapid from "../../vapid.json";

let subscriptions = [];

export const GET_KEY = (c, next) => {
  try {
    return c.text(urlsafeBase64.decode(vapid.publicKey));
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

    // TODO: GUARDAR EN BD
    subscriptions.push(subscription);

    console.log("subscription array", subscriptions.length);

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
    console.log("un subscription");
    const subscription = await c.req.json();

    // TODO: BUSCAR Y ELIMINAR DE BD
    subscriptions = subscriptions.filter(
      (e) => e.endpoint !== subscription.endpoint
    );

    console.log("subscription array", subscriptions.length);

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
  // clientid: 123, message: xyz

  const { clientid, message } = await c.req.json();
  console.log("message", message);

  const sentNotifications = [];

  // TODO: enviar solo al cliente correspondiente.
  const client = subscriptions.filter();

  const resultNotifications = client.map((subscription) => {
    console.log("subscription", subscription);
    const pushProm = webpush
      .sendNotification(subscription, JSON.stringify(message))
      .then(console.log("Notificacion enviada "))
      .catch((err) => {
        console.error("Notificación falló");

        if (err.statusCode === 410) return {};
      });

    return {};
  });

  // TODO: eliminar suscripciones con error.
  await Promise.all(resultNotifications).then((res) => {
    console.log("resultNotifications", res);
  });

  return c.json({ ok: true });
};
