import 'reflect-metadata';
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLInputType } from 'graphql';

import Class from '../types/Class';
import FieldMap from '../types/FieldMap';
import FieldInputMap from '../types/FieldInputMap';
import DescriptionMap from '../types/DescriptionMap';


function buildInput(model: Class): GraphQLInputObjectType {
    const fields: FieldMap = <FieldMap>Reflect.getMetadata('graphQLFields', model);
    const descriptions: DescriptionMap = <DescriptionMap>Reflect.getMetadata('graphQLDescriptions', model);

    if (!('name' in model)) {
        throw new Error('The name is missing from the input model!');
    }
    const name: string = <string>model.name;

    // removing _ from the beginning
    if (name.length < 2 || name[0] !== '_') {
        throw new Error('The name of the model class must be in the form of `_SomeModel`.');
    }
    const modelName: string = name.substr(1, name.length - 1);

    const data = {
        name: modelName,
        fields: () => {
            const finalFields: FieldInputMap = {};

            Object.entries(fields).forEach(f => {
                const [key, value] = [...f];

                const type = value.type();
                const optional = value.optional ?? false;

                const desc: string | undefined = descriptions[key];

                finalFields[key] = {
                    description: desc,
                    type: optional ? <GraphQLInputType>type : <GraphQLInputType>GraphQLNonNull(type)
                };
            });

            return finalFields;
        }
    };

    const gqlObject: GraphQLInputObjectType = new GraphQLInputObjectType(data);
    return gqlObject;
}

export default buildInput;