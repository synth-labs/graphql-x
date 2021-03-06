import 'reflect-metadata';

import Class from '../types/Class';
import TypeFunction from '../types/TypeFunction';
import FieldMap from '../types/FieldMap';

function Field(typeFunction: TypeFunction, optional = false) {
    return (target: Class, key: string) => {
        const fields: FieldMap = <FieldMap>Reflect.getMetadata('graphQLFields', target.constructor) || {};

        if (fields[key] !== undefined) {
            fields[key].type = typeFunction;
            fields[key].optional = optional;
        } else {
            fields[key] = {
                type: typeFunction,
                optional
            };
        }

        Reflect.defineMetadata('graphQLFields', fields, target.constructor);
    };
}

export default Field;