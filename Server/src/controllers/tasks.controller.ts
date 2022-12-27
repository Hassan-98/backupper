import { Request, Response } from 'express';
//= Async Handler
import asyncHandler from '../utils/async-handler';
//= Exception
import { HttpException } from '../middlewares/error.handler.middleware';
//= Services
import TasksServices from '../services/tasks.services';

class TasksController {
  public Services = new TasksServices();

  public archiveDirectory = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body.path) throw new HttpException(400, 'Upload failed, folder path is not valid');

    const files = this.Services.ArchiveDirectory(req.body.path);

    res.status(200).json({ success: true, data: files })
  })

  public uploadArchivedFile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body.path) throw new HttpException(400, 'Upload failed, folder path is not valid');

    await this.Services.UploadFile(req.body.path);

    res.status(200).json({ success: true, data: null })
  })

  public uploadDirectory = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body.path) throw new HttpException(400, 'Upload failed, folder path is not valid');

    const files = await this.Services.UploadDirectory(req.body.path);

    res.status(200).json({ success: true, data: files })
  })

  public archiveWebWorks = asyncHandler(async (req: Request, res: Response) => {
    await this.Services.ScanAndArchiveTask("E:\\Web Works");

    res.status(200).json({ success: true, data: null })
  })

  public uploadArchivedWebWorks = asyncHandler(async (req: Request, res: Response) => {
    let files = await this.Services.uploadArchivedWorksTask();

    res.status(200).json({ success: true, data: files })
  })
}

export default TasksController;
