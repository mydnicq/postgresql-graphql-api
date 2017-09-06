import Roles from "./roles";
import createFunction from "./factory";

export default function GuardField(roles: Roles[], viewer_id_key?: string) {
  if (roles.includes(Roles.Owner) && !viewer_id_key) {
    throw new Error(
      "Owner permission role was set but no viewer id key defined."
    );
  }
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let originalFn = descriptor.value;
    let newFn = createFunction(
      "Field",
      roles,
      viewer_id_key,
      originalFn,
      target
    );
    descriptor.value = newFn;
    return descriptor;
  };
}
