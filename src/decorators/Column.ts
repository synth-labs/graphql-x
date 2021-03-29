import 'reflect-metadata';

import ColumnMap from '../types/ColumnMap';

function Column(columnName: string) {
    return (target: Object, key: string) => {
        const fields: ColumnMap = <ColumnMap>Reflect.getMetadata('graphQLColumns', target.constructor) || {};

        fields[key] = columnName;

        Reflect.defineMetadata('graphQLColumns', fields, target.constructor);
    }
}

export default Column;