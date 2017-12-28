import Roles from "./roles";
import PermissionError from "../../errors/permissionError";

export default function(operation, roles, viewerIdKey, originalFn, target) {
  return function() {
    let errorMessage;
    let obj = arguments[0];
    let args = arguments[1];
    let ctx = arguments[2];

    if (operation === "Mutation" && ctx.viewer && ctx.isValidCsrf === false) {
      throw new PermissionError("Invalid CSRF token.");
    }

    if (roles.includes(Roles.Everyone)) {
      return originalFn.apply(target, arguments);
    }

    if (!ctx.viewer) {
      let errMessage = "Insufficient permissions - viewer is not authenicated.";
      if (operation === "Field") {
        return errMessage;
      }
      throw new PermissionError(errMessage);
    }

    if (roles.includes(Roles.Admin)) {
      if (ctx.viewer.admin) {
        return originalFn.apply(target, arguments);
      } else {
        errorMessage = "viewer has no admin role.";
      }
    }

    if (roles.includes(Roles.Owner)) {
      if (
        obj &&
        typeof obj[viewerIdKey] === "undefined" &&
        typeof args[viewerIdKey] === "undefined"
      ) {
        errorMessage = `to get this value, you need to provide viewerId key '${viewerIdKey}'`;
      } else if (
        operation === "Field" &&
        typeof obj[viewerIdKey] === "undefined"
      ) {
        errorMessage = `to get this value, you need to provide viewerId key '${viewerIdKey}'`;
      } else if (ctx.viewer.id === getViewerId(obj, args, viewerIdKey)) {
        return originalFn.apply(target, arguments);
      } else {
        errorMessage = "viewer is not the owner.";
      }
    }

    if (operation === "Field") {
      return `Insufficient permissions - ${errorMessage}`;
    }
    throw new PermissionError(`Insufficient permissions - ${errorMessage}`);
  };
}

function getViewerId(obj, args, viewerIdKey) {
  if (obj && typeof obj[viewerIdKey] !== "undefined") {
    return obj[viewerIdKey];
  } else {
    return args[viewerIdKey];
  }
}
