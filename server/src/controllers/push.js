const urlsafeBase64 = require("urlsafe-base64");

export const GET_KEY = (c, next) => {
    console.log('get key')
    const url = urlsafeBase64.decode(vapid.publicKey)
    console.log('url', url)

    return c.send(url)
}