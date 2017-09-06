import App from '../app/index'
import {graphql} from 'graphql'

let appInstance: App

beforeAll(async () => {
  // Jest will wait for this promise to resolve before running tests.
  appInstance = await new App().start({monitorSQL: false})
})

afterAll(() => {
  appInstance.stop()
})

describe ('Testing userRepository', () => {
  test('Should get an array of users', async () => {
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
    `

    const {data} = await graphql(appInstance.graphqlSchema, query, {}, appInstance.context)
    expect(data.users.edges.length).toBeGreaterThan(0)
  })
})
