import 'reflect-metadata';

import Class from '../types/Class';
import JunctionMap from '../types/JunctionMap';

function Junction(junctionTable: string, firstTableField: string, secondTableField: string) {
    return (target: Class, key: string) => {
        const fields: JunctionMap = <JunctionMap>Reflect.getMetadata('graphQLJunctions', target.constructor) || {};

        fields[key] = {
            junctionTable,
            firstTableField,
            secondTableField
        };

        Reflect.defineMetadata('graphQLJunctions', fields, target.constructor);
    };
}

export default Junction;