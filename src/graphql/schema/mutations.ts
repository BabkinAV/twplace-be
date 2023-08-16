import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { Product } from '../../models/Product';

import { User } from '../../models/User';

import { Request } from 'express';
import {
	GraphQLError,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import { errorNameType } from '../../constants/ErrorTypes';
import sanitizeTextInput from '../../helpers/sanitizeTextInput';
import { Order } from '../../models/Order';
import { AuthDataType } from './types';

const RootMutation = new GraphQLObjectType<unknown, Request>({
  name: 'Mutation',
  fields: {
    signup: {
      type: AuthDataType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        passwordConfirmation: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, context) {
        const email = sanitizeTextInput(args.email as string);
        const password = sanitizeTextInput(args.password as string);
				if (!validator.isEmail(email)) {
					throw new GraphQLError(errorNameType.EMAIL_IS_INCORRECT)
				}
				if (!validator.isLength(password, {min: 6})) {
					throw new GraphQLError(errorNameType.PASSWORD_LENGTH_IS_INCORRECT)
				}
				const passwordConfirmation = sanitizeTextInput(args.passwordConfirmation as string);

				if (password !== passwordConfirmation) {
					throw new GraphQLError(errorNameType.PASSWORDS_DO_NOT_MATCH)
				}



        return bcrypt
          .hash(password, 12)
          .then(hashedPw => {
            const user = new User({
              email,
              password: hashedPw,
            });
            return user.save();
          })
          .then(user => {
            const token = jwt.sign(
              {
                userId: user._id.toString(),
                email: user.email.toString(),
              },
              process.env.JWT_SECRET!,
              { expiresIn: '1d' }
            );
            return { token, userId: user._id.toString() };
          })
          .catch(err => {
            if (err?.code === 11000) {
              throw new GraphQLError(errorNameType.USER_EMAIL_EXISTS);
            } else throw new GraphQLError(errorNameType.COULD_NOT_PROCESS);
          });
      },
    },
    placeOrder: {
      type: new GraphQLObjectType({
        name: 'PlaceOrderType',
        fields: {
          orderId: { type: new GraphQLNonNull(GraphQLString) },
        },
      }),
      args: {
        orderContents: {
          type: GraphQLNonNull(
            GraphQLList(
              GraphQLNonNull(
                new GraphQLInputObjectType({
                  name: 'placedItemType',
                  fields: () => ({
                    productId: { type: new GraphQLNonNull(GraphQLString) },
                    quantity: { type: new GraphQLNonNull(GraphQLInt) },
                  }),
                })
              )
            )
          ),
        },
      },
      resolve: (parent, args, ctx) => {
        if (!ctx.isAuth) {
          throw new GraphQLError(errorNameType.NOT_AUTHORIZED);
        }
        const orderContents = JSON.parse(
          JSON.stringify(args.orderContents)
        ) as { productId: string; quantity: number }[];
        if (!orderContents.length)
          throw new GraphQLError('Incorrect input data');
        const productIds = orderContents.map(el => el.productId);
        return Product.find()
          .where('_id')
          .in(productIds)
          .exec()
          .then(productItems => {
            const dbInputArr = {
              products: orderContents.map(el => {
                const foundItem = productItems.find(item => {
                  return item._id.toString() === el.productId;
                });
                if (foundItem) {
                  const { _id, ...productProperties } = foundItem._doc;
                  return {
                    product: productProperties,
                    refProductId: _id,
                    quantity: el.quantity,
                  };
                } else {
                  throw new GraphQLError('Cart item not found');
                }
              }),
              userId: ctx.userId,
            };
            return Order.create(dbInputArr);
          })
          .then(savedDocument => {
            let response = { orderId: savedDocument._id };
            return response;
          })
          .catch(err => {
            console.log(err);
            throw new GraphQLError('Incorrect input data');
          });
      },
    },
  },
});

export default RootMutation;
