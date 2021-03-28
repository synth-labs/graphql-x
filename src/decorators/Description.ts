import 'reflect-metadata';

import DescriptionMap from '../types/DescriptionMap';

function Description(description: string) {
    return (target: ObjectConstructor, key: string) => {
        const fields: DescriptionMap = <DescriptionMap>Reflect.getMetadata('graphQLDescriptions', target.constructor) || {};

        fields[key] = description;

        Reflect.defineMetadata('graphQLDescriptions', fields, target.constructor);
    }
}

export default Description;