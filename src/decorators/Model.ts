import 'reflect-metadata';

import TableInfo from '../types/TableInfo';

function Model(databaseName: string, tableName: string, uniqueKey = 'id') {
    return (target: any) => {
        const data: TableInfo = {
            sqlTable: `\`${databaseName}\`.\`${tableName}\``,
            uniqueKey,
        }

        Reflect.defineMetadata('graphQLTable', data, target);
    }
}

export default Model;