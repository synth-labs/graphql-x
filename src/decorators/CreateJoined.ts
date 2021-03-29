import 'reflect-metadata';

import Class from '../types/Class';
import CreateJoinedMap from '../types/CreateJoinedMap';

function CreateJoined(junctionTable: string, referencedField: string) {
    return (target: Class, key: string) => {
        const fields: CreateJoinedMap = <CreateJoinedMap>Reflect.getMetadata('graphQLMutationsJoin', target.constructor) || {};

        fields[key] = {
            junctionTable,
            referencedField
        };

        Reflect.defineMetadata('graphQLMutationsJoin', fields, target.constructor);
    }
}

export default CreateJoined;