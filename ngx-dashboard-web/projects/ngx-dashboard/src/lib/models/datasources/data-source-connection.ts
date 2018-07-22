import { DataSource } from './data-source';

export class DataSourceConnection {
    id: string;
    title: string;
    dataSources: DataSource[] = [];
    selected = false;
}
