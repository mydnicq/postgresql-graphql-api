import { Model } from "rawmodel";

export default class User extends Model {
  created_at?: string;
  updated_at?: string;

  id: number;
  name: string;
  password: string;

  constructor(data = {}) {
    super(data);

    // this.defineField('id',
    //   {
    //     handle: [
    //       {
    //         handler: 'block',
    //         block (error, recipe) {
    //           let errorCode = Number(error.code)
    //           if (errorCode !== 23505) return false
    //           recipe.message = error.message
    //           recipe.code = errorCode
    //           return true
    //         }
    //       }
    //     ]
    //   }
    // )

    this.defineField("id");

    this.defineField("name", {
      type: "String",
      validate: [
        {
          validator: "presence",
          message: "must be present"
        }
      ]
    });

    this.defineField("password");

    this.populate(data);
  }

  createTimestamps() {
    const now = new Date().toUTCString();
    this.created_at = now;
    this.updated_at = now;
  }

  updateTimestamps() {
    const now = new Date().toUTCString();
    this.updated_at = now;
  }
}
