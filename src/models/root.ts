import { Model } from 'rawmodel'
// import User from './user'

export default class Root extends Model {
  async hello (data, ctx): Promise<any> {
    return await ctx.db.users.find()
  }
  // async getUsers (data, ctx): Promise<any> {
  //   return await ctx.db.users.find()
  // }
}
