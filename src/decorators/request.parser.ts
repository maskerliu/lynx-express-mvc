import { Request } from 'express'
import { BizContext, UserDevice, UserNetwork } from '../base.model'
import { ParamInfo, ParamType } from './base.decorators'

import * as JSONBigInt from 'json-bigint'

// const JSONBigInt = require('json-bigint')

const BIZ_HEADER_TOKEN = 'x-token'
const BIZ_HEADER_UA = 'x-ua'
const BIZ_HEADER_DEVICE = 'x-did'
const BIZ_HEADER_AUTH = 'x-auth'
const BIZ_HEADER_NETWORK = 'x-network'

export function parseContext(req: Request): BizContext {

  let network = req.headers[BIZ_HEADER_NETWORK] as string

  let netType = UserNetwork.UNKNOWN
  switch (network.toLowerCase()) {
    case '2g':
      netType = UserNetwork.G2
      break
    case '3g':
      netType = UserNetwork.G3
      break
    case '4g':
      netType = UserNetwork.G4
      break
    case '5g':
      netType = UserNetwork.G5
      break
    case 'wifi':
      netType = UserNetwork.WIFI
      break
    case 'ethernet':
      netType = UserNetwork.Ethernet
    default:
      netType = UserNetwork.UNKNOWN
  }

  // let ua = 'mapi/1.0(Android 12;com.github.lynxchina.argus 1.0.1;vivo:V2171A;huaiwei)'
  let ua = req.headers[BIZ_HEADER_UA] as string
  let regArr = ua.match(/[0-9A-Za-z\/.\ :]+/g)
  let [os, version] = regArr[1].split('\ ')
  let [brand, model] = regArr[3].split(':')
  let [appId, appVersion] = regArr[2].split('\ ')
  let deviceInfo: UserDevice = { os, version, brand, model }

  let context: BizContext = {
    ua,
    token: req.headers[BIZ_HEADER_TOKEN] as string,
    did: req.headers[BIZ_HEADER_DEVICE] as string,
    network: netType,
    deviceInfo,
    appId,
    version: appVersion,
    channel: regArr[4]
  }
  return context
}

export function parseParameters(req: Request, paramMap: Map<any, ParamInfo>) {
  let arr: Array<any> = []

  paramMap.forEach((info, key: number) => {
    switch (info.type) {
      case ParamType.FileBody:
        try {
          arr[key] = req.files[info.name]
        } catch (err) {
          arr[key] = null
        }
        break
      case ParamType.Query:
        arr[key] = req.query[info.name]
        break
      case ParamType.JsonBody:
        let body = req.body
        if (req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
          body = req.body[info.name]
        }

        if (body == null) {
          arr[key] = null
        } else {
          arr[key] = JSONBigInt.parse(body)
        }

        break
    }
    // console.error(`index: ${key}, name: ${info.name}, value: ${arg}`)
  })

  return arr
}