import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import express, { Application, Response } from 'express'
import http from 'http'
import { Autowired, Component } from '../src/index'

import fileUpload from 'express-fileupload'

import TestRouter from './router'


@Component()
class TestServer {

  private httpServer: any
  private httpApp: Application

  @Autowired()
  testRouter: TestRouter

  private corsOpt: CorsOptions = {
    credentials: true,
    optionsSuccessStatus: 200,
  }

  public async start() {
    this.testRouter.init()
    this.initHttpServer()

    if (this.httpServer != null) {
      this.httpServer.close(() => { this.httpServer = null })
    }
    this.startHttpServer()
  }

  private initHttpServer() {
    this.httpApp = express()
    this.corsOpt.origin = [
      `http://localhost:8088`,
      `http://localhost:9081`,
      'http://192.168.25.16:9081'
    ]

    this.httpApp.use(express.static('./static'))
    this.httpApp.use(cors(this.corsOpt))
    this.httpApp.use(compression())
    this.httpApp.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
    this.httpApp.use(express.json({ type: ['application/json'], limit: '50mb' }))
    this.httpApp.use(fileUpload({ useTempFiles: true, tempFileDir: './static/tmp' }))
    this.httpApp.all('*', (req: any, resp: Response) => { this.handleRequest(req, resp) })
  }

  private async startHttpServer() {
    let HTTP: any
    // HTTP = await import('http')
    this.httpServer = http.createServer(this.httpApp)

    this.httpServer.listen(
      8884,
      '0.0.0.0',
      () => console.log(`--启动本地代理Http服务--[8884]`)
    )
  }

  private handleRequest(req: any, resp: Response) {
    this.testRouter.route(req, resp)
  }
}

const localServer: any = new TestServer()
localServer.instance()
localServer.start()