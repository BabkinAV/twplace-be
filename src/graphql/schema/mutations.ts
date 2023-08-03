import bcrypt from 'bcryptjs';
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
import { Order } from '../../models/Order';
import { UserType } from './types';

const RootMutation = new GraphQLObjectType<unknown, Request>({
  name: 'Mutation',
  fields: {
    signup: {
      type: GraphQLNonNull(UserType),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
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
    placeOrder: {
      type: new GraphQLObjectType({
        name: 'PlaceOrderType',
        fields: {
          orderId: { type: new GraphQLNonNull(GraphQLString) },
        },
      }),
      args: {
        orderContents: {
          type: GraphQLList(
            new GraphQLInputObjectType({
              name: 'placedItemType',
              fields: () => ({
                productId: { type: new GraphQLNonNull(GraphQLString) },
                quantity: { type: new GraphQLNonNull(GraphQLInt) },
              }),
            })
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
				

									const {_id, ...productProperties} = foundItem._doc;
									return {
										product: productProperties,
										refProductId: _id,
										quantity: el.quantity,
									};
								}
								else {
									throw new GraphQLError('Cart item not found')
								}
              }),
							userId: ctx.userId
            };
            return Order.create(dbInputArr);
          })
          .then(savedDocument => {
            let response = { orderId: savedDocument._id };
            return response;
          })
          .catch(err => {
						console.log(err);
						throw new GraphQLError('Incorrect input data')
          });
      },
    },
  },
});

export default RootMutation;
