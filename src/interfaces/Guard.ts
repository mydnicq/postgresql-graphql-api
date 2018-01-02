import Roles from "../lib/guard/roles";

export interface Guard {
  set(target: any, viewerKey: string, roles: Roles[]): void;
}
