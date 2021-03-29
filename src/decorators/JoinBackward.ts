import 'reflect-metadata';

import Class from '../types/Class';
import JoinBackwardMap from '../types/JoinBackwardMap';

function JoinBackward(referencedField: string) {
    return (target: Class, key: string) => {
        const fields: JoinBackwardMap = <JoinBackwardMap>Reflect.getMetadata('graphQLJoinBackwards', target.constructor) || {};

        fields[key] = referencedField;

        Reflect.defineMetadata('graphQLJoinBackwards', fields, target.constructor);
    }
}

export default JoinBackward;