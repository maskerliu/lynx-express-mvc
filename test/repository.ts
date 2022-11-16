import path from 'path'
import 'pouchdb-node'
import { Repository } from '../src'

export interface GameItem {
  _id: string,
  _rev: string,
  version?: string,
  author?: string,
  name?: string,
  desc?: string,
  icon?: string,
  snaps?: Array<string>,
  url?: string
}

@Repository(path.resolve() + '/static', 'test', ['name'])
export default class TestRepo {


  pouchdb: PouchDB.Database


  public async search<T>(field: string, query: string, returnFields?: Array<string>) {
    let request: PouchDB.Find.FindRequest<T> = {
      selector: {
        _id: { $ne: /_design\/idx/ },
      },
      limit: 15,
      fields: returnFields
    }

    request.selector[field] = { $eq: query }

    let data: Array<T> = new Array()
    try {
      let result = await this.pouchdb.find(request)
      if (result.docs) {
        result.docs.forEach(it => {
          data.push(it as T)
        })
      }
    } catch (err) {
      throw '查询失败' + err
    } finally {
      return data
    }
  }

  public async get<T>(field: string, query: string, returnFields?: Array<string>) {
    let request: PouchDB.Find.FindRequest<T> = {
      selector: {
        _id: { $ne: /_design\/idx/ },
      },
      limit: 15,
      fields: returnFields
    }

    request.selector[field] = { $eq: query }

    let data: T
    try {
      let result = await this.pouchdb.find(request)
      data = result.docs[0] as T
    } catch (err) {
      throw '查询失败' + err
    } finally {
      return data
    }
  }

  public async update<T extends PouchDB.Core.RemoveDocument>(item: T) {
    let resultId: string = null
    try {
      let getResult = await this.get<T>('_id', item._id, ['_rev'])
      let result = null
      if (getResult) {
        item._rev = getResult._rev
        result = await this.pouchdb.put(item)
      } else {
        result = await this.pouchdb.post(item)
      }
      if (result.ok) resultId = result.id
    } catch (err) {
      throw '更新失败' + err
    } finally {
      return resultId
    }
  }

  public async delete<T extends PouchDB.Core.RemoveDocument>(id: string) {
    let result = false
    try {
      let item = await this.get<T>('_id', id, ['_id', '_rev'])
      let removeResult = await this.pouchdb.remove(item._id, item._rev)
      result = removeResult.ok
    } catch (err) {
      throw '删除失败' + err
    } finally {
      return result
    }
  }
}