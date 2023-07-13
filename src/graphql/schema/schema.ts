import { Product } from '../../models/Product';
import { Document, HydratedDocument, ObjectId, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { IUser, User } from '../../models/User';
import { errorNameType, errorType } from '../../constants/ErrorTypes';

import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
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

// Size type

const SizeType = new GraphQLEnumType({
  name: 'SizeType',
  values: {
    S: {
      value: 'S',
    },
    M: {
      value: 'M',
    },
    L: {
      value: 'L',
    },
    XL: {
      value: 'XL',
    },
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
    color: { type: GraphQLString },
    imageLink: { type: GraphQLString },
    price: { type: PriceType },
    size: { type: SizeType },
  }),
});

// User type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

// AuthData type

const AuthDataType = new GraphQLObjectType({
  name: 'AuthData',
  fields: () => ({
    token: { type: GraphQLString },
    userId: { type: GraphQLString },
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
    featuredProducts: {
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
    products: {
      type: new GraphQLList(ProductType),
      args: {
        productsIds: { type: new GraphQLList(GraphQLID) },
      },
      resolve(parent, args) {
        const searchArr = args.productsIds.map(
          (el: string) => new Types.ObjectId(el)
        );

        return Product.find().where('_id').in(searchArr);
      },
    },

    login: {
      type: AuthDataType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, context) {
        const email = args.email as string;
        const password = args.password as string;
        let userFound: HydratedDocument<IUser>;
        return User.findOne({ email })
          .then(user => {
            if (!user) {
              throw new Error(errorNameType.EMAIL_NOT_FOUND);
            }

            userFound = user;

            return bcrypt.compare(password, user.password);
          })
          .then(isEqual => {
            if (!isEqual) {
              throw new Error(errorNameType.PASSWORD_IS_INCORRECT);
            }
            const token = jwt.sign(
              {
                userId: userFound._id.toString(),
                email: userFound.email.toString(),
              },
              process.env.JWT_SECRET!,
              { expiresIn: '1h' }
            );
            return { token, userId: userFound._id.toString() };
          });
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: GraphQLNonNull(UserType),
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, context) {
        // TODO: Implement args validation functionality
        const email = args.email as string;
        const password = args.password as string;
        return bcrypt.hash(password, 12).then(hashedPw => {
          const user = new User({
            email,
            password: hashedPw,
          });
          return user.save();
        });
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
