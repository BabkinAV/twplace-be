
import { Product } from '../../models/Product';

import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

// Price type

const PriceType = new GraphQLObjectType({
  name: 'PriceType',
  fields: {
    priceCurrent: { type: GraphQLInt },
    priceOld: { type: GraphQLInt },
    discount: { type: GraphQLInt },
  },
});

// Product type
const ProductType = new GraphQLObjectType<
  { parameter1: string },
  { parameter2: string }
>({
  name: 'Product',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    size: { type: GraphQLString },
    imageLink: { type: GraphQLString },
    price: { type: PriceType },
  }),
});

// Generic parameter for GraphqQLObjectType:

// 1st parameter: type for parent object in resolver function

// 2nd parameter: type for context object in resolver function

// see https://graphql.org/learn/execution/#root-fields-resolvers

const RootQuery = new GraphQLObjectType<
  { parameter3: string },
  { parameter4: string }
>({
  name: 'RootQueryType',
  fields: {
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find();
      },
    },
    product: {
      type: ProductType,
      args: {
        _id: { type: GraphQLID },
      },
      resolve(parent, args, context, info) {
        return Product.findById(args._id);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
