import { Request, Response } from "express";
import AbstractRouter from "../AbstractRouter";
import { Router } from "../decorators/webmvc.decorators";


import './controllers'

@Router()
class TestRouter extends AbstractRouter {

  error(req: Request, resp: Response, err: any) {

  }
}

export default TestRouter