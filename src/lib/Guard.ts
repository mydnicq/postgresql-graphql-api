import { PermissionError } from "../errors";

export enum Roles {
  Everyone,
  Admin,
  Owner
}

class Guard {
  public static decorator(roles: Roles[], viewerIDKey: string) {
    if (roles.includes(Roles.Owner) && !viewerIDKey) {
      throw new Error(
        "Owner permission role was set but no viewerIDKey defined."
      );
    }
    return function(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      let resolveFn = descriptor.value;
      let proxy = new Proxy(resolveFn, {
        apply: function(target, thisArg, argumentsList) {
          return Guard.check(
            target,
            thisArg,
            argumentsList,
            viewerIDKey,
            roles
          );
        }
      });
      descriptor.value = proxy;
      return descriptor;
    };
  }

  public static check(target, thisArg, argumentsList, viewerIDKey, roles) {
    let [obj, args, ctx] = argumentsList;
    const resolve = () => target.apply(thisArg, argumentsList);

    if (ctx.isValidCsrf === false) {
      throw new PermissionError("Invalid CSRF token.");
    }

    if (roles.includes(Roles.Everyone)) {
      return resolve();
    }

    if (!ctx.viewer) {
      let errMessage =
        "Insufficient permissions - viewer is not authenticated.";
      throw new PermissionError(errMessage);
    }

    if (roles.includes(Roles.Admin) && !ctx.viewer.admin) {
      let errorMessage = "viewer has no admin role.";
      throw new PermissionError(errorMessage);
    }

    if (roles.includes(Roles.Owner)) {
      if (
        obj &&
        typeof obj[viewerIDKey] === "undefined" &&
        typeof args[viewerIDKey] === "undefined"
      ) {
        let errorMessage = `to get this value, you need to provide viewerId key '${viewerIdKey}'`;
        throw new PermissionError(errorMessage);
      } else if (ctx.viewer.id === Guard.getViewerID(obj, args, viewerIDKey)) {
        return resolve();
      } else {
        let errorMessage = "viewer is not the owner.";
        throw new PermissionError(errorMessage);
      }
    }
  }

  public static getViewerID(obj, args, viewerIDKey) {
    if (obj && typeof obj[viewerIDKey] !== "undefined") {
      return obj[viewerIDKey];
    } else {
      return Number(args[viewerIDKey]);
    }
  }
}

export function allowedFor(roles: Roles[], viewerIDKey?: string) {
  return Guard.decorator(roles, viewerIDKey);
}
