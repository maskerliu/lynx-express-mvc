import { Request, Response } from 'express'
import AbstractRouter from './AbstractRouter'
import { Router } from '../src'


import './controllers'

@Router()
export default class TestRouter extends AbstractRouter {

  error(req: Request, resp: Response, err: any) {

  }
}