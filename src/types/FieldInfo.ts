import TypeFunction from './TypeFunction';

interface FieldInfo {
    type: TypeFunction;
    optional?: boolean,
    description?: string;
    column?: string;
    joinForward?: string;
    joinBackward?: string;
    junction?: {
        junctionTable: string;
        firstTableField: string;
        secondTableField: string
    }
}

export default FieldInfo;