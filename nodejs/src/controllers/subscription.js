import webpush from "web-push";
import urlsafeBase64 from "urlsafe-base64";
// import vapid from "../../vapid.json"; assert { type: 'json' };

let subscriptions = [];

webpush.setVapidDetails(
  "mailto:info@storylabs.dev",

  "BLVMazKECWEPNJbqCsfa-Y-SUV28E5s80bLaCKOsro5dITdM2ZWtNigTR1DZIM1niiglOPHF3bGZjXpYYO4gQpQ",
  "x5sv6IZ4XWkWjBIC_tPstpDT_EtKrrPhFYxYSrdzJT0"
  // vapid.publicKey,
  // vapid.privateKey
);

export const GET_KEY = async (req, res, next) => {
  try {
    return res.send(
      urlsafeBase64.decode(
        "BLVMazKECWEPNJbqCsfa-Y-SUV28E5s80bLaCKOsro5dITdM2ZWtNigTR1DZIM1niiglOPHF3bGZjXpYYO4gQpQ"
      )
    );
  } catch (error) {
    return next({
      status: 500,
      code: 1001,
      userMessage: "Error en el metodo GET_KEY",
      message: error,
    });
  }
};

export const SUBSCRIBE = async (req, res, next) => {
  try {
    console.log("subscription");
    const subscription = await req.body;

    console.log("subscription", subscription);

    // TODO: GUARDAR EN BD
    subscriptions.push(subscription);

    console.log("subscription array", subscriptions.length);

    res.send({ ok: true });
  } catch (error) {
    return next({
      status: 500,
      code: 1001,
      userMessage: "Error en el metodo SUBSCRIBE",
      message: error,
    });
  }
};

export const UNSUBSCRIBE = async (req, res, next) => {
  try {
    console.log("un subscription");
    const subscription = await req.body;

    // TODO: BUSCAR Y ELIMINAR DE BD
    subscriptions = subscriptions.filter(
      (e) => e.clientid !== subscription.clientid
    );

    console.log("subscription array", subscriptions.length);

    return res.send({ ok: true });
  } catch (error) {
    return next({
      status: 500,
      code: 1001,
      userMessage: "Error en el metodo SUBSCRIBE",
      message: error,
    });
  }
};

export const PUSH = async (req, res, next) => {
  try {
    const { clientid, message } = await req.body;
    console.log("message", message);
    console.log("clientid", clientid);

    const clients = subscriptions.filter((e) => e.clientid === clientid);
    if (!clients.length) {
      return res.send({
        ok: false,
        msg: "invalid clientid",
      });
    }

    const resultNotifications = clients.map(({ clientid, subscription }) => {
      console.log("subscription", subscription);
      return webpush
        .sendNotification(subscription, JSON.stringify(message))
        .then((res) => {
          console.log("Notificacion enviada ", res.statusCode);

          return {
            clientid,
            ok: true,
          };
        })
        .catch((err) => {
          console.error("Notificación falló", err);

          return {
            clientid,
            ok: false,
            subscription,
            delete: err.statusCode === 410,
          };
        });
    });

    // TODO: eliminar suscripciones sin cliente (410).
    return Promise.all(resultNotifications).then((response) => {
      response.forEach((e) => {
        if (e.delete) {
          subscriptions = subscriptions.filter(
            (sub) => sub.subscription.endpoint !== e.subscription.endpoint
          );
        }
      });

      console.log("subscriptions.length", subscriptions.length);
      return res.send({ response });
    });
  } catch (error) {
    return next({
      status: 500,
      code: 1001,
      userMessage: "Error en el metodo PUSH",
      message: error,
    });
  }
};
