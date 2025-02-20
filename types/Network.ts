export type ApiResult<T = undefined> = {
  data?: T;
  status: number;
  message: string | null;
};
