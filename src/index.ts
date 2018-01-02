import "reflect-metadata";
import { CreateApp } from "./core";

(async () => {
  await CreateApp.start();
})().catch(err => {
  console.error("ERROR:", err);
});
