import { ApiResponse } from './api-response';
import { Count } from './count';
export interface ApiCountResponse<T> extends ApiResponse<T>, Count {
}
