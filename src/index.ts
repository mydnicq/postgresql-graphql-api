// import "reflect-metadata";
// import { container } from "./ioc";
import { CreateApp } from "./core";

(async () => {
  await CreateApp.start();
})().catch(err => {
  console.error("ERROR:", err);
});
