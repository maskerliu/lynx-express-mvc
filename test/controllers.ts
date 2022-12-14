import { UploadedFile } from 'express-fileupload'
import { Autowired, BizContext, BodyParam, Controller, FileParam, Get, Post, QueryParam } from '../src'
import { GameItem } from './repository'
import { TestService } from './service'

@Controller('/iot')
export class TestCtrl {

  @Autowired()
  testService: TestService

  init() {
    console.log('hello world')
  }

  @Get('/tes')
  async tes() {
    return 'hello world'
  }

  @Post('/updateInfo')
  async updateInfo(@BodyParam('device') device: any) {
    console.log(device)
    return 'hello world'
  }

  @Get('/test')
  async test(@QueryParam('test') test: string, context: BizContext) {
    console.log(context)
    return `hello ${test}`
  }


  @Post('/game/upload')
  async hello(@QueryParam('name') name: string,
    @BodyParam('game') game: GameItem,
    @FileParam('icon') icon: UploadedFile,
    @FileParam('snap1') snap1?: UploadedFile,
    @FileParam('snap2') snap2?: UploadedFile,
    @FileParam('snap3') snap3?: UploadedFile,
    @FileParam('bundle') bundle?: UploadedFile) {
    // console.log(game)
    // console.log(icon)
    // console.log(snap1)
    // console.log(snap2)

    game = {
      _id: null,
      _rev: null,
      version: '1.0.1',
      author: 'lynxchina',
      name: 'liliput',
      desc: '奇妙小人国',
    }
    return this.testService.saveGame(game, icon, [snap1, snap2], bundle)
  }

}