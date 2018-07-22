using System;
[Serializable]
public enum ColumnType
{
    PrimaryKey = 0,
    ForiegnKey = 1,
    PrimaryForeignKey = 2,
    Normal = 4
}