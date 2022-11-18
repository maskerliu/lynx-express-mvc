/**
 * @internal
 */
 export const __PropertyMap = Symbol.for('property_info_map')

/**
 * @internal
 */
export const __RouteMap = Symbol.for('route_map')

/**
 * @internal
 */
export const __Controllers = Symbol.for('controllers')

/**
 * @internal
 */
export enum ParamType {
  Query,
  JsonBody,
  FileBody,
}

/**
 * @internal
 */
export type ParamInfo = {
  name: string,
  type: number, // 0: query param, 1: body param, 2: body file
}