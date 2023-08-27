export interface IJsonapiError<T = object> {
  errors: T | T[];
}
