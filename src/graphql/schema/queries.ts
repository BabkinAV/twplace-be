import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../models/Product';

import { errorNameType } from '../../constants/ErrorTypes';
import { User } from '../../models/User';
import { IUser } from '../../types';

import { Request } from 'express';

import {
  GraphQLError,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { AuthDataType, OrderType, ProductType } from './types';
import { Order } from '../../models/Order';

//INFO: Generic parameter for GraphqQLObjectType:

// 1st parameter: type for parent object in resolver function

// 2nd parameter: type for context object in resolver function

// see https://graphql.org/learn/execution/#root-fields-resolvers

const RootQuery = new GraphQLObjectType<{ parameter3: string }, Request>({
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
      resolve(parent, args, ctx) {
        const searchArr = args.productsIds.map(
          (el: string) => new Types.ObjectId(el)
        );

        return Product.find().where('_id').in(searchArr);
      },
    },
    //NOTE:  PROTECTED QUERY EXAMPLE
    user: {
      type: GraphQLString,
      resolve(parent, args, ctx) {
        if (!ctx.isAuth) {
          throw new GraphQLError(errorNameType.NOT_AUTHORIZED);
        }

        return 'UserID: ' + ctx.userId;
      },
    },

    login: {
      type: AuthDataType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, context) {
        const email = args.email as string;
        const password = args.password as string;
        let userFound: HydratedDocument<IUser>;
        return User.findOne({ email })
          .then(user => {
            if (!user) {
              throw new GraphQLError(errorNameType.EMAIL_NOT_FOUND);
            }

            userFound = user;

            return bcrypt.compare(password, user.password);
          })
          .then(isEqual => {
            if (!isEqual) {
              throw new GraphQLError(errorNameType.PASSWORD_IS_INCORRECT);
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
    orderHistory: {
      type: new GraphQLList(OrderType),
      resolve(parent, args, ctx) {
        if (!ctx.isAuth) {
          throw new GraphQLError(errorNameType.NOT_AUTHORIZED);
        }
        // TODO: write a Mongoose query here...
        return Order.find({ userId: ctx.userId })
          .exec()
          .then(dataArr =>
            dataArr.map(el => {
              let totalOrderPrice = el.products.reduce(
                (total, currProduct) =>
                  total + currProduct.product.price.priceCurrent * currProduct.quantity,
                0
              );
              return Object.assign(el, { total: totalOrderPrice });
            })
          );
      },
    },
  },
});

export default RootQuery;
