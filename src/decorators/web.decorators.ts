import { BizCode, BizResponse } from '../base.model'
import { ParamInfo, ParamType, __RouteMap } from './base.decorators'
import { parseContext, parseParameters } from './request.parser'

const __MethodParamsMap = Symbol.for('method_params_map')

function _genMethodRouter(target: any, propertyKey: string, path: string) {
  let routeMap = Reflect.has(target, __RouteMap) ? Reflect.get(target, __RouteMap) : new Map()
  routeMap.set(path, propertyKey)
  Reflect.set(target, __RouteMap, routeMap)
}



function _makeResponse(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const func = descriptor.value as Function

  // TODO: can add type verify here
  // type ArrType = Parameters<typeof func>
  // type SecondParam = ArrType[0]
  // let params: ArrType = []
  // type IdxParamType = ArrType[0]

  descriptor.value = async function (this: any, ...args: any) {
    const [req, resp] = args
    let bizResp: BizResponse<any>
    try {
      let arr = new Array<any>()
      if (Reflect.has(target, __MethodParamsMap) && target[__MethodParamsMap].has(propertyKey)) {
        arr = parseParameters(req, target[__MethodParamsMap].get(propertyKey))
      }
      try {
        arr.push(parseContext(req))
      } catch (err) {
        arr.push(null)
      }

      arr.push(req)
      arr.push(resp)

      let result = await Reflect.apply(func, this, arr)
      if (result == null) {
        bizResp = { code: BizCode.FAIL, msg: 'biz inner error' }
      } else {
        bizResp = { code: BizCode.SUCCESS, data: result }
      }
      return result
    } catch (err) {
      console.log(err)
      bizResp = { code: BizCode.ERROR, msg: err.toString() }
    } finally {
      resp.json(bizResp)
      resp.end()
    }
  }

  return descriptor
}

function _genParamMap(target: any, methodKey: string | symbol, parameterIndex: number, name: string, type: number) {
  let methodParamMap = Reflect.has(target, __MethodParamsMap) ? Reflect.get(target, __MethodParamsMap) : new Map()
  let methodInfo: Map<number, ParamInfo> = methodParamMap.has(methodKey) ? methodParamMap.get(methodKey) : new Map()
  methodInfo.set(parameterIndex, { name: name, type: type })
  methodParamMap.set(methodKey, methodInfo)
  Reflect.set(target, __MethodParamsMap, methodParamMap)
}

/**
 * mvc web decorator which will auto parse request query params
 * 
 * @public
 */
function QueryParam(name: string): ParameterDecorator {
  return (target: any, methodKey: string | symbol, parameterIndex: number) => {
    _genParamMap(target, methodKey, parameterIndex, name, ParamType.Query)
  }
}

/**
 * mvc web decorator which will auto parse request json body params
 * @public
 */
function BodyParam(name?: string): ParameterDecorator {
  return (target: any, methodKey: string | symbol, parameterIndex: number) => {
    _genParamMap(target, methodKey, parameterIndex, name, ParamType.JsonBody)
  }
}

/**
 * mvc web decorator which will auto parse request body file
 * @public
 */
function FileParam(name?: string): ParameterDecorator {
  return (target: any, methodKey: string | symbol, parameterIndex: number) => {
    _genParamMap(target, methodKey, parameterIndex, name, ParamType.FileBody)
  }
}

/**
 * mvc web decorator which will auto build a method with response
 * @public
 */
function Get(url: string, desc?: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _genMethodRouter(target, propertyKey, url)
    return _makeResponse(target, propertyKey, descriptor)
  }
}

/**
 * mvc web decorator which will auto build a method with response
 * @public
 */
function Post(url: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _genMethodRouter(target, propertyKey, url)
    return _makeResponse(target, propertyKey, descriptor)
  }
}

/**
 * mvc web decorator which will auto build a method with response
 * @public
 */
function All(url: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    _genMethodRouter(target, propertyKey, url)
    return _makeResponse(target, propertyKey, descriptor)
  }
}


export { Get, Post, All, QueryParam, BodyParam, FileParam }
