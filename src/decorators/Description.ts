import 'reflect-metadata';

import Class from '../types/Class';
import DescriptionMap from '../types/DescriptionMap';

function Description(description: string) {
    return (target: Class, key: string) => {
        const fields: DescriptionMap = <DescriptionMap>Reflect.getMetadata('graphQLDescriptions', target.constructor) || {};

        fields[key] = description;

        Reflect.defineMetadata('graphQLDescriptions', fields, target.constructor);
    };
}

export default Description;