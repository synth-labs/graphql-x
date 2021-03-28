import 'reflect-metadata';
import { GraphQLObjectType, GraphQLNonNull, GraphQLOutputType } from 'graphql';

import FieldMap from '../types/FieldMap';
import FieldModelMap from '../types/FieldModelMap';
import DescriptionMap from '../types/DescriptionMap';

import ColumnMap from '../types/ColumnMap';
import TableInfo from '../types/TableInfo';

import JoinForwardMap from '../types/JoinForwardMap';
import JoinBackwardMap from '../types/JoinBackwardMap';
import JoinFunction from '../types/JoinFunction';
import JunctionMap from '../types/JunctionMap';

import JoinMonsterFieldInfo from '../types/JoinMonsterFieldInfo';
import JoinMonsterFieldMap from '../types/JoinMonsterFieldMap';

function buildModel(model: ObjectConstructor): GraphQLObjectType {
    const fields: FieldMap = <FieldMap>Reflect.getMetadata('graphQLFields', model);
    const descriptions: DescriptionMap = <DescriptionMap>Reflect.getMetadata('graphQLDescriptions', model);

    const columns: ColumnMap = <ColumnMap>Reflect.getMetadata('graphQLColumns', model) || {};
    const database: TableInfo = <TableInfo>Reflect.getMetadata('graphQLTable', model);
    const joinForwards: JoinForwardMap = <JoinForwardMap>Reflect.getMetadata('graphQLJoinForwards', model) || {};
    const joinBackwards: JoinBackwardMap = <JoinBackwardMap>Reflect.getMetadata('graphQLJoinBackwards', model) || {};
    const junctions: JunctionMap = <JunctionMap>Reflect.getMetadata('graphQLJunctions', model) || {};

    // removing _ from the beginning
    if (model.name.length < 2 || model.name[0] !== '_') {
        throw new Error('The name of the model class must be in the form of `_SomeModel`.');
    }
    const modelName: string = model.name.substr(1, model.name.length - 1);

    const newFields: JoinMonsterFieldMap = {};

    Object.entries(fields).forEach(f => {
        const [key, value] = f;

        const newField: JoinMonsterFieldInfo = {
            type: value.type,
            optional: value.optional
        }

        if (descriptions[key]) {
            newField.description = descriptions[key];
        }

        if (columns[key]) {
            newField.extensions = {
                joinMonster: {
                    sqlColumn: columns[key]
                }
            }
        }

        if (joinForwards[key]) {
            const joinFunction: JoinFunction = (mainTable: string, referencedTable: string): string => `${mainTable}.${joinForwards[key]} = ${referencedTable}.id`;

            if (newField.extensions) {
                newField.extensions.joinMonster.sqlJoin = joinFunction;
            } else {
                newField.extensions = {
                    joinMonster: {
                        sqlJoin: joinFunction
                    }
                }
            }
        }

        if (joinBackwards[key]) {
            const joinFunction: JoinFunction = (mainTable: string, referencedTable: string): string => `${referencedTable}.${joinBackwards[key]} = ${mainTable}.id`;

            if (newField.extensions) {
                newField.extensions.joinMonster.sqlJoin = joinFunction;
            } else {
                newField.extensions = {
                    joinMonster: {
                        sqlJoin: joinFunction
                    }
                }
            }
        }

        if (junctions[key]) {
            const junctionData = junctions[key];

            const firstJunctionFunction: JoinFunction = (mainTable: string, junctionTable: string): string => `${mainTable}.id = ${junctionTable}.${junctionData.firstTableField}`

            const secondJunctionFunction: JoinFunction = (junctionTable: string, referencedTable: string): string => `${junctionTable}.${junctionData.secondTableField} = ${referencedTable}.id`

            if (newField.extensions) {
                newField.extensions.joinMonster.junction = {
                    sqlTable: junctionData.junctionTable,
                    sqlJoins: [firstJunctionFunction, secondJunctionFunction]
                };
            } else {
                newField.extensions = {
                    joinMonster: {
                        junction: {
                            sqlTable: junctionData.junctionTable,
                            sqlJoins: [firstJunctionFunction, secondJunctionFunction]
                        }
                    }
                }
            }
        }

        newFields[key] = newField;
    });


    const data = {
        name: modelName,
        extensions: {
            joinMonster: database
        },
        fields: () => {
            const finalFields: FieldModelMap = {};

            Object.entries(newFields).forEach(f => {
                const [key, value] = [...f];

                const type = value.type();
                const optional = value.optional ?? false;

                finalFields[key] = {
                    description: value.description,
                    extensions: value.extensions,
                    type: optional ? <GraphQLOutputType>type : <GraphQLOutputType>GraphQLNonNull(type)
                }
            });

            return finalFields;
        }
    };



    const gqlObject: GraphQLObjectType = new GraphQLObjectType(data);
    return gqlObject;
}

export default buildModel;