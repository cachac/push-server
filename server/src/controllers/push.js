import webpush from 'web-push'
import urlsafeBase64 from "urlsafe-base64";
import vapid from '../../vapid.json';

const subscriptions = []

export const GET_KEY = (c, next) => {
    console.log('get key')
    const url = urlsafeBase64.decode(vapid.publicKey)

    return c.text(url)
}

export const SUBSCRIBE = async (c, next) => {
    const subscription = await c.req.json()
    console.log('subscription', subscription)

    // TODO: GUARDAR EN BD
    subscriptions.push(subscription)

    return c.json({ ok: true });
}

export const PUSH = async (c, next) => {
    // clientid: 123, message: xyz

    const { clientid, message } = await c.req.json()
    console.log('message', message)

    const sentNotifications = []

    // TODO: enviar solo al cliente correspondiente.
    const client = subscriptions.filter()

    const resultNotifications = client.map(subscription => {
        console.log('subscription', subscription)
        const pushProm = webpush.sendNotification(subscription, JSON.stringify(message))
            .then(console.log("Notificacion enviada "))
            .catch((err) => {
                console.error("Notificación falló");

                if (err.statusCode === 410)
                    return {}
            });

        return {}
    })


    // TODO: eliminar suscripciones con error.
    await Promise.all(resultNotifications).then((res) => {
        console.log('resultNotifications', res)
    })


    return c.json({ ok: true });
}
