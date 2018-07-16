import { ApiCountResponse } from './api-count-response';
import { Paginate } from './paginate';
export interface ApiPaginateResponse<T> extends ApiCountResponse<T>, Paginate {
}
