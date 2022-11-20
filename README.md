# Web push technology demo

this simple example demonstrates how to implement push notifications in a Web Application. It uses
[node.js](https://nodejs.org/en/) for the server side and [web-push npm package](https://www.npmjs.com/package/web-push) in order to hide complex logic of [WebPushProtocolRequest](https://web.dev/push-notifications-web-push-protocol/) creation.

### ⚠️ Additionally ⚠️

in this version functionality of sending push messages has been extracted to a separate Admin Panel (path: `/admin`) where you can define `title`, `body`, `url` and send push messages to all your subscribers with these values (`url` is a URL to which user will be redirected after clicking on a notification).

The Admin panel is secured with HTTP-Basic-Auth. Credentials for the Admin panel are set as environment variables(**_.env_** file) : `ADMIN_LOGIN` and `ADMIN_PASSWORD`.

## What you will need

- Node.js
- Npm
- MongoDB instance + connection string

## How to run locally

1. Create **_.env_** file in the root of the project (you can also rename already provided **_.env.example_** file)
2. Generate [VAPID keys](https://web.dev/push-notifications-web-push-protocol/#application-server-keys) by running `npx web-push generate-vapid-keys` in the console
3. Place generate keys in the **_.env_** file under `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` keys respectively
4. Add MongoDB connection string in the **_.env_** file as `MONGO_DB_CONNECTION_URL`
5. Add `PORT` in the **_.env_** file (if you used **_.env.example_** then `PORT` is set to `3333`)
6. ⚠️ Add admin credentials: `ADMIN_LOGIN` and `ADMIN_PASSWORD` in the **_.env_** file (if you used **_.env.example_** make sure these values are changed 🔴)
7. In the root of the project run `npm install`
8. In the root of the project run `node ./server.js`
9. Open browser on `localhost:{PORT}` (if you used **_.env.example_** then `localhost:3333`)
