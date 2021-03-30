import 'reflect-metadata';

import Class from '../types/Class';
import TableInfo from '../types/TableInfo';

function Model(databaseName: string, tableName: string, uniqueKey = 'id') {
    return (target: Class) => {
        const data: TableInfo = {
            sqlDatabase: `\`${databaseName}\``,
            sqlTable: `\`${databaseName}\`.\`${tableName}\``,
            uniqueKey,
        };

        Reflect.defineMetadata('graphQLTable', data, target);
    };
}

export default Model;