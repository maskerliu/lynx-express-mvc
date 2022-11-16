

export enum BizCode {
  SUCCESS = 8000,
  FAIL = 4000,
  ERROR = 1000,
}

export interface BizResponse<T> {
  code: BizCode,
  msg?: string,
  data?: T
}