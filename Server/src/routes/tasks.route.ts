import { Router } from 'express';
//= Controller
import TasksController from '../controllers/tasks.controller';
//= Route Interface
import { Route } from '../types/route.type';


class TasksRoutes implements Route {
  public path = '/tasks';
  public router = Router();
  public controller = new TasksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /* POST: Archive Directory */
    this.router.post(`${this.path}/archive`, this.controller.archiveDirectory);
    /* POST: Upload File */
    this.router.post(`${this.path}/upload-file`, this.controller.uploadArchivedFile);
    /* POST: Upload Directory */
    this.router.post(`${this.path}/upload-dir`, this.controller.uploadDirectory);
    /* POST: Archive WebWorks */
    this.router.post(`${this.path}/archive-works`, this.controller.archiveWebWorks);
    /* POST: Upload WebWorks */
    this.router.post(`${this.path}/upload-works`, this.controller.uploadArchivedWebWorks);
  }
}


export default TasksRoutes;
