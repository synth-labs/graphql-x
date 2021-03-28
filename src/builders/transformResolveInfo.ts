import { GraphQLResolveInfo, GraphQLObjectType, OperationDefinitionNode, SelectionNode, FieldNode } from 'graphql';
import { cloneDeep } from 'lodash';


type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

type ModifiedSelectionNode = Mutable<SelectionNode & { name: any }>;


function transformResolveInfo(queryRoot: GraphQLObjectType, resolveInfo: any, queryName: string, args: any): GraphQLResolveInfo {
    const newInfo: Mutable<GraphQLResolveInfo> = <Mutable<GraphQLResolveInfo>>cloneDeep(resolveInfo);

    newInfo.fieldName = queryName;
    newInfo.path.key = queryName;
    newInfo.parentType = queryRoot;

    const operation: Mutable<OperationDefinitionNode> = <Mutable<OperationDefinitionNode>>{ ...newInfo.operation };
    operation.operation = 'query';

    if (operation.selectionSet.selections.length === 0) {
        throw new Error('Missing selections on the query operation!');
    }

    const selection: ModifiedSelectionNode = <ModifiedSelectionNode>operation.selectionSet.selections[0];

    selection.name = {
        value: queryName
    }

    operation.selectionSet.selections = [selection];
    newInfo.operation = operation;

    const fieldNode: Mutable<FieldNode> = <Mutable<FieldNode>>newInfo.fieldNodes[0];
    fieldNode.arguments = [];

    fieldNode.arguments = Object.entries(args).map((v: [string, unknown]) => ({
        kind: 'Argument',
        name: { kind: 'Name', value: v[0] },
        value: { kind: 'IntValue', value: `${<string>v[1]}` }
    }))


    newInfo.fieldNodes = [fieldNode];

    return <Readonly<GraphQLResolveInfo>>newInfo;
}

export default transformResolveInfo;