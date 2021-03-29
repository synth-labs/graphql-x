import 'reflect-metadata';

import Class from '../types/Class';
import JoinMatchingMap from '../types/JoinMatchingMap';


function Unjoin(field1: string, argument1: string, field2: string, argument2: string) {
    return (target: Class, key: string) => {
        const fields: JoinMatchingMap = <JoinMatchingMap>Reflect.getMetadata('graphQLUnjoinData', target.constructor) || {};

        fields[key] = {
            field1,
            argument1,
            field2,
            argument2
        }

        Reflect.defineMetadata('graphQLUnjoinData', fields, target.constructor);
    }
}

export default Unjoin;