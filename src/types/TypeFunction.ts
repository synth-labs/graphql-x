import { GraphQLType } from 'graphql';

type TypeFunction = (t?: void) => GraphQLType;

export default TypeFunction;