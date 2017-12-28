import App from "../app";
import { graphql } from "graphql";

let appInstance: App;

beforeAll(async () => {
  // Jest will wait for this promise to resolve before running tests.
  appInstance = await new App().start({ monitorSQL: false });
});

afterAll(() => {
  appInstance.stop();
});

describe("Testing Query - 'Users'", () => {
  test("Should get an array of users", async () => {
    const query = `
      query users {
        users{
          edges{
            node{
              name
            }
          }
        }
      }
    `;

    const { data } = await graphql(
      appInstance.graphqlSchema,
      query,
      {},
      appInstance.ctx
    );
    expect(data.users.edges.length).toBeGreaterThan(0);
  });
});

describe("Testing Query - 'User'", () => {
  test("Should get a userr", async () => {
    const query = `
      query user {
        user(user_id: 1) {
          name id books {
            name author_id
          }
        }
      }
    `;

    const { data } = await graphql(
      appInstance.graphqlSchema,
      query,
      {},
      appInstance.ctx
    );

    expect(data).toMatchObject({
      user: {
        name: expect.any(String),
        id: expect.any(Number),
        books: expect.any(Array)
      }
    });
  });
});
