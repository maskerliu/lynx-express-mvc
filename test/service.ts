import { UploadedFile } from 'express-fileupload'
import fs from 'fs'
import path from 'path'
import { Autowired, Service } from '../src'
import TestRepo, { GameItem } from './repository'


@Service()
export class TestService {

  baseDir = path.resolve() + '/static/games'

  @Autowired()
  testRepo: TestRepo


  hello(name: string): string {
    return `hello ${name}`
  }

  async saveGame(game: GameItem, icon: UploadedFile, snaps: Array<UploadedFile>, bundle?: UploadedFile) {
    // let gameId = await this.testRepo.update<GameItem>(game)

    let item = await this.testRepo.get<GameItem>('_id', 'e197681a-d7b9-47ae-a267-64026ca63da0')


    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir)
    }

    if (!fs.existsSync(path.join(this.baseDir, item._id))) {
      fs.mkdirSync(path.join(this.baseDir, item._id))
    }
    let ext = icon.name.split('.').pop()
    let filePath = path.join(this.baseDir, item._id, icon.md5 + '.' + ext)
    console.log(filePath)
    item.icon = `http://localhost:8088/games/${item._id}/${icon.md5}.${ext}`
    icon.mv(path.join(this.baseDir, item._id, icon.md5 + '.' + ext))

    if (item.snaps == null) { item.snaps = [] }
    snaps.forEach(snap => {
      ext = snap.name.split('.').pop()
      snap.mv(path.join(this.baseDir, item._id, snap.md5 + '.' + ext))
      item.snaps.push(`http://localhost:8088/games/${item._id}/${snap.md5}.${ext}`)
    })

    ext = bundle?.name.split('.').pop()
    bundle?.mv(path.join(this.baseDir, item._id, bundle.md5 + '.' + ext))
    item.url = `http://localhost:8088/games/${item._id}/${bundle?.md5}.${ext}`
    console.log(item)
    return 'hello'
  }

  async getGame() {
    let games = await this.testRepo.search<GameItem>('name', 'liliput')
    console.log(games)
  }

}