import 'reflect-metadata';

import JoinBackwardMap from '../types/JoinBackwardMap';

function JoinBackward(referencedField: string) {
    return (target: Object, key: string) => {
        const fields: JoinBackwardMap = <JoinBackwardMap>Reflect.getMetadata('graphQLJoinBackwards', target.constructor) || {};

        fields[key] = referencedField;

        Reflect.defineMetadata('graphQLJoinBackwards', fields, target.constructor);
    }
}

export default JoinBackward;