export default {
    port: process.env.PORT ?? 4000,
    clientId: process.env.CLIENT_ID_SPOTIFY ?? '',
    clientSecret: process.env.CLIENT_SECRET_SPOTIFY ?? '',
    callBackURL: process.env.CALLBACK_URL ?? ''
}