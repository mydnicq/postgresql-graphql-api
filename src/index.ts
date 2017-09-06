import App from "./app";
import Server from "./server";
(async () => {
  const appInstance = await new App().start();
  const http = await new Server(appInstance).start();
  console.log(http);
})().catch(err => {
  console.error("ERROR:", err);
});
