export class Column {
    id: string;
    name: string;
    objectId: string;
    fullName: string;
    isPrimary: boolean;
    isForeign: boolean;
    isIdentity: boolean;
    allowNull: boolean;
    isComputed: boolean;
    dataType: string;
    parentId: string;
    parameterValue: any;
    header: string;
    expression: string;
    formatter: any;
    hide: boolean;
}
