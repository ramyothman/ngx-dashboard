import { Column } from './column';
export class DataSource {
    id: string;
    sourceId: string;
    connectionId: string;
    name: string;
    sourceType: string;
    schema: string;
    namespace: string;
    columns: Column[];
    parameters: Column[];
    selected = false;
    data: any[] = null;
}
