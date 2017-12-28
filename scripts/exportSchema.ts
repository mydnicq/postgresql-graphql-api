import * as path from "path";
import * as fse from "fs-extra";
import App from "../src/app";
import { GraphQLSchema, graphql } from "graphql";
import { introspectionQuery } from "graphql/utilities";

/*
Generates schema.json by querying server's introspection system.
This file is then used by 'graphql-code-generator' to generate typescript Interfaces for graphql types.
The Interfaces are usually used in test files for type assertion of query variables.
*/
(async function() {
  let app = new App();
  let graphqlSchema = new GraphQLSchema(await app.createSchema());
  const query = introspectionQuery;

  const fileContent = await graphql(graphqlSchema, query);

  await fse.writeFile(
    path.resolve("./src/schema/schema.json"),
    JSON.stringify(fileContent, null, 2)
  );
})();
