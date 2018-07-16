using System;
using System.Collections.Generic;
using System.Text;
using Festo.Common.Entities.MetaDataSchema;
using System.Text.RegularExpressions;

namespace Festo.Common.Entities
{
    public enum SectionType
    {
        Database = 0,
        Table = 1,
        Column = 2,
        Folder = 3,
        View = 4,
        NoType = 5,
        Function = 6,
        StoredProcedure = 7

    }
}
