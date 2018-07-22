import { Quota } from './quota';
import { ApiResponse } from './api-response';

export interface ApiQuotaResponse<T> extends ApiResponse<T> {
  quota: Quota;
}
