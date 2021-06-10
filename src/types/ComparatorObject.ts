interface ComparatorObject {
    argName: string;
    operator: 'EQUAL' | 'NOT_EQUAL' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'IS_NULL' | 'IS_NOT_NULL' | 'LIKE';
    columnName: string;
}

export default ComparatorObject;