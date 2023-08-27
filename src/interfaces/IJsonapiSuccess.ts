export interface IJsonapiSuccess {
  data: {
    id: string;
    type: string;
    attributes: Record<string, any>;
  };
  meta?: {
    token?: string;
    message?: string;
  };
}
