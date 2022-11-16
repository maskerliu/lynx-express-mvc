import 'reflect-metadata'

import { __PropertyMap } from './base.decorators'


const __IOC_Container: Map<string, Object> = new Map()
const __IOC_Controller_Map: Map<string, any> = new Map()

import { __Controllers, __RouteMap } from './base.decorators'


/**
 * Router class decorator which handle request by request[path]
 * @public
 */
function Router() {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      init() {
        if (this[__Controllers] == null) this[__Controllers] = new Array()
        __IOC_Controller_Map.forEach((func, key) => {
          this[__Controllers].push(new func().init())
          // console.log("[Router]", key, func)
        })
        return this
      }
    }
  }
}

/**
 *  handle request request[path] by Controller's RouterMap
 * @public
 */
function Route(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.value = function (this: any, ...args: any) {
      let [req] = args
      let canHandle = false
      let ctrls = this[__Controllers]
      if (ctrls == null) return canHandle
      for (let i = 0; i < ctrls.length; ++i) {
        let ctrl = ctrls[i]
        let routeMap = Reflect.get(ctrl, __RouteMap) as Map<string, string>

        if (routeMap.has(req.path)) {
          let func = Reflect.get(ctrl, routeMap.get(req.path))
          Reflect.apply(func, ctrl, args)
          canHandle = true
          break
        }
      }
      return canHandle
    }
  }
}

function _genConstructor<T extends { new(...args: any[]): {} }>(constructor: T) {

  return class extends constructor {
    init() {

      if (!Reflect.has(constructor.prototype, __PropertyMap)) { return this }

      let propertyMap = Reflect.get(constructor.prototype, __PropertyMap) as Map<string, any>
      for (let key of propertyMap.keys()) {
        let ClassDefined = propertyMap.get(key)
        if (!__IOC_Container.has(key)) {
          let instance = new ClassDefined()
          try { instance.init() } catch (err) { }
          __IOC_Container.set(key, instance)
          // console.log('[constructor]', `[${constructor.name}] add new instance of\t\t`, ClassDefined)
        } else {
          // console.log('[constructor]', `[${constructor.name}] get existed instance of\t\t`, ClassDefined)
        }
        this[key] = __IOC_Container.get(key)
      }
      return this
    }
  }
}

/**
 * mvc component which will inject by autowired annotation
 * @public
 */
function Component(name?: string) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    return _genConstructor(constructor)
  }
}

/**
 * mvc conroller which will inject by autowired annotation
 * 
 * @public
 */
function Controller(path?: string) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    let newConstructor = _genConstructor(constructor)
    if (path && Reflect.has(constructor.prototype, __RouteMap)) {
      let routeMap = new Map()
      Reflect.get(constructor.prototype, __RouteMap).forEach((val: string, key: string) => {
        routeMap.set(path + key, val)
      })
      Reflect.set(constructor.prototype, __RouteMap, routeMap)
      __IOC_Controller_Map.set(constructor.name, newConstructor)
    }
    return newConstructor
  }
}

/**
 * mvc service component which will inject by autowired annotation
 * @public
 */
function Service(name?: string) {
  return Component(name)
}

import path from 'path'
import PouchFind from 'pouchdb-find'
import PouchDB from 'pouchdb-node'

/**
 * mvc repository component which can be injected by autowired annotation
 * power by PouchDB which use leveldb as the default database 
 * 
 * @public
 * @param path - db path 
 * @param name - db name
 */
function Repository(dir: string, name: string, indexs: Array<string>) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      async init() {
        PouchDB.plugin(PouchFind)
        this['pouchdb'] = new PouchDB(path.join(dir, name))

        try {
          await this['pouchdb'].createIndex({ index: { fields: indexs }, })
        } catch (err) {
          console.error('initDB', err)
        }
        if (!Reflect.has(constructor.prototype, __PropertyMap)) { return this }

        let propertyMap = Reflect.get(constructor.prototype, __PropertyMap) as Map<string, any>
        for (let key of propertyMap.keys()) {
          let ClassDefined = propertyMap.get(key)
          if (!__IOC_Container.has(key)) {
            let instance = new ClassDefined()
            try { instance.init() } catch (err) { }
            __IOC_Container.set(key, instance)
            // console.log('[constructor]', `[${constructor.name}] add new instance of\t\t`, ClassDefined)
          } else {
            // console.log('[constructor]', `[${constructor.name}] get existed instance of\t\t`, ClassDefined)
          }
          this[key] = __IOC_Container.get(key)
        }
        return this
      }
    }
  }
}


export { Router, Route, Component, Controller, Service, Repository }

