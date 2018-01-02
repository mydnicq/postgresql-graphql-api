import getDecorators from "inversify-inject-decorators";
import { Container, inject, injectable } from "inversify";
import * as interfaces from "../interfaces";
import { TYPES } from "./types";
import { Guard } from "../lib/Guard";

const container = new Container({ autoBindInjectable: true });

container.bind<interfaces.Guard>(TYPES.Guard).to(Guard);

let { lazyInject } = getDecorators(container);

export { container, lazyInject, inject, injectable };
