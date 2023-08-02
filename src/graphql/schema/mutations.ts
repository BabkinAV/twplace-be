import bcrypt from 'bcryptjs';
import { Product } from '../../models/Product';

import { User } from '../../models/User';

import {
	GraphQLError,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserType } from './types';
import { Order } from '../../models/Order';

const RootMutation = new GraphQLObjectType({
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
      resolve: (parent, args, context) => {
        const orderContents = JSON.parse(
          JSON.stringify(args.orderContents)
        ) as { productId: string; quantity: number }[];
        console.log(orderContents);
        const productIds = orderContents.map(el => el.productId);
        return Product.find()
          .where('_id')
          .in(productIds)
          .exec()
          .then(productItems => {
            console.log(productItems);
            const dbInputArr = {
              products: orderContents.map(el => {
                const foundItem = productItems.find(item => {
                  return item._id.toString() === el.productId;
                });
								if (foundItem) {
				

									const {_id, ...productProperties} = foundItem._doc;
									console.log('Product properties: ', productProperties)
									return {
										product: productProperties,
										refId: _id,
										quantity: el.quantity,
									};
								}
								else {
									throw new GraphQLError('Object not found')
								}
              }),
            };
            console.log('db Input arr: ', dbInputArr);
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
