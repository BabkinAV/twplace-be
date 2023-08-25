import {
	GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
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
		featured: {type: GraphQLBoolean}
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

// OrderedItemType

const OrderedItemType = new GraphQLObjectType({
  name: 'OrderedProductType',
  fields: () => ({
    product: { type: ProductType },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    _id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
		updatedAt: {type: GraphQLString},
    total: { type: GraphQLFloat },
    products: {
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'orderItem',
          fields: () => ({
            product: { type: ProductType },
						refProductId: {type: GraphQLID},
						totalProductPrice: {type: GraphQLInt},
            quantity:{type: GraphQLInt},
          }),
        })
      ),
    },
  }),
});

export {
  PriceType,
  SizeType,
  ProductType,
  UserType,
  AuthDataType,
  OrderedItemType,
	OrderType
};
