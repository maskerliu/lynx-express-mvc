/**
 * @internal
 */
export const __PropertyMap = Symbol.for('property_info_map')

/**
 * mvc web decorator which will auto build a method with response
 * @public
 */
function Autowired(name?: string): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {

    let identifier = Reflect.getMetadata('design:type', target, propertyKey)
    Reflect.set(target, propertyKey, identifier)
    let propertyMap: Map<string | symbol, any> = Reflect.has(target, __PropertyMap) ? Reflect.get(target, __PropertyMap) : new Map()

    if (!propertyMap.has(propertyKey)) {
      propertyMap.set(propertyKey, identifier)
    }
    Reflect.set(target, __PropertyMap, propertyMap)
    // console.log('[Autowired]', propertyKey, identifier)
  }
}

export { Autowired }
