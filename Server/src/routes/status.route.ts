import { Router } from 'express';
//= Controller
import StatusController from '../controllers/status.controller';
//= Route Interface
import { Route } from '../types/route.type';


class StatusRoutes implements Route {
  public path = '/status';
  public router = Router();
  public controller = new StatusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /* GET: / */
    this.router.get(`/`, this.controller.index);
    /* GET: Health Check */
    this.router.get(this.path, this.controller.status);
  }
}


export default StatusRoutes;
