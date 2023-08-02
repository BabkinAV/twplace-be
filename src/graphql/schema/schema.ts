import { GraphQLSchema } from "graphql";
import RootMutation from "./mutations";
import RootQuery from "./queries";


export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
