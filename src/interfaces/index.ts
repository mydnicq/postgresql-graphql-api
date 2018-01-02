export * from "./Request";
export * from "./Route";
export * from "./Middleware";
export * from "./Guard";

export interface Constructable<T> {
  new (...args: any[]): T;
}
