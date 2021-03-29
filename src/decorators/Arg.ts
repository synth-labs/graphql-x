import 'reflect-metadata';
import { GraphQLNonNull } from 'graphql';

import Class from '../types/Class';
import TypeFunction from '../types/TypeFunction';
import ArgMap from '../types/ArgMap';

function Arg(typeFunction: TypeFunction, argName: string, description?: string, optional = false) {
    return (target: Class, key: string) => {
        const args: ArgMap = <ArgMap>Reflect.getMetadata('graphQLArgs', target.constructor) || {};

        if (args[key]) {
            args[key][argName] = {
                type: optional ? typeFunction() : GraphQLNonNull(typeFunction()),
                description
            };
        } else {
            args[key] = {
                [argName]: {
                    type: optional ? typeFunction() : GraphQLNonNull(typeFunction()),
                    description
                }
            };
        }

        Reflect.defineMetadata('graphQLArgs', args, target.constructor);
    };
}

export default Arg;