/* tslint:disable */

export interface Query {
  user?: User; 
  users?: UserConnection; 
}

export interface User {
  id?: number; 
  name?: string; 
  books?: Book[]; 
}

export interface Book {
  id?: number; 
  name?: string; 
  author_id?: number; 
  comments?: Comment[]; 
  numBooks?: number; 
}

export interface Comment {
  id?: number; 
  comment?: string; 
  author?: User; 
}
/* A connection to a list of items. */
export interface UserConnection {
  pageInfo: PageInfo; /* Information to aid in pagination. */
  edges?: UserEdge[]; /* A list of edges. */
  total?: number; 
}
/* Information about pagination in a connection. */
export interface PageInfo {
  hasNextPage: boolean; /* When paginating forwards, are there more items? */
  hasPreviousPage: boolean; /* When paginating backwards, are there more items? */
  startCursor?: string; /* When paginating backwards, the cursor to continue. */
  endCursor?: string; /* When paginating forwards, the cursor to continue. */
}
/* An edge in a connection. */
export interface UserEdge {
  node?: User; /* The item at the end of the edge */
  cursor: string; /* A cursor for use in pagination */
}

export interface Mutation {
  createBook?: Book; 
  updateBook?: Book; /* Update a book by id. */
  createComment?: Comment; 
  createUser?: User; 
  updateUser?: User; /* Update a user by id. */
  forceLogout?: User; /* Force logout a user. */
}

export interface BookInput {
  name: string; 
  user_id: number; 
}

export interface CommentInput {
  comment: string; 
  user_id: number; 
  book_id: number; 
}

export interface UserInput {
  name: string; 
  password?: string; 
}
export interface UserQueryArgs {
  user_id: number; 
}
export interface UsersQueryArgs {
  after?: string; 
  first?: number; 
  before?: string; 
  last?: number; 
}
export interface CreateBookMutationArgs {
  input?: BookInput; 
}
export interface UpdateBookMutationArgs {
  id: number; 
  input?: BookInput; 
}
export interface CreateCommentMutationArgs {
  input?: CommentInput; 
}
export interface CreateUserMutationArgs {
  input?: UserInput; 
}
export interface UpdateUserMutationArgs {
  id: number; 
  input?: UserInput; 
}
export interface ForceLogoutMutationArgs {
  id: number; 
}
