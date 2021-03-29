import 'reflect-metadata';

import JoinForwardMap from '../types/JoinForwardMap';

function JoinForward(referencingField: string) {
    return (target: Object, key: string) => {
        const fields: JoinForwardMap = <JoinForwardMap>Reflect.getMetadata('graphQLJoinForwards', target.constructor) || {};

        fields[key] = referencingField;

        Reflect.defineMetadata('graphQLJoinForwards', fields, target.constructor);
    }
}

export default JoinForward;