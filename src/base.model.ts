
/**
 * @public
 */
export enum BizCode {
  SUCCESS = 8000,
  FAIL = 4000,
  ERROR = 1000,
}
/**
 * @public
 */
export interface BizResponse<T> {
  code: BizCode,
  msg?: string,
  data?: T
}

/**
 * @public
 */
export interface UserDevice {
  os: string, // 操作系统
  version: string, // 系统版本
  brand: string, // 品牌
  model: string, // 型号
}
/**
 * @public
 */
export enum UserNetwork {
  UNKNOWN,
  Ethernet, // 有线
  WIFI, // 无线
  G2, // 2G
  G3, // 3G
  G4, // 4G
  G5, // 5G
}
/**
 * @public
 */
export interface BizContext {
  token?: string, 
  uid?: string, // 用户ID
  did: string, // 设备ID
  ua: string, // UserAgent example: mapi/1.0 (Android 12;com.github.lynxchina.argus 1.0.1;vivo:V2171A;huaiwei)
  network: UserNetwork,
  deviceInfo: UserDevice,
  appId: string,
  version: string, // app version
  channel: string // app channel
}