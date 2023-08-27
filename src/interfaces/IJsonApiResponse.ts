import type { IJsonapiError } from './IJsonApiError';

// IApiResponse is generic for IJsonapiError type or IJsonapiSuccess type
export interface IJsonApiResponse<T = object, K = object | undefined> {
  errors?: IJsonapiError<T>;
  data?: T;
  meta?: K;
}
