import 'reflect-metadata';

import Class from '../types/Class';
import JoinForwardMap from '../types/JoinForwardMap';

function JoinForward(referencingField: string) {
    return (target: Class, key: string) => {
        const fields: JoinForwardMap = <JoinForwardMap>Reflect.getMetadata('graphQLJoinForwards', target.constructor) || {};

        fields[key] = referencingField;

        Reflect.defineMetadata('graphQLJoinForwards', fields, target.constructor);
    };
}

export default JoinForward;