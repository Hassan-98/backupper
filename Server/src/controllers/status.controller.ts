import { Request, Response } from 'express';

class StatusController {
  public index = (req: Request, res: Response) => {
    res.json({
      "API": "API",
      "Author": "Hassan Ali",
      "Created At": "2022-08-15",
      "Last Update": "2022-12-07",
      "Language": 'en',
      "Supported Languages": "En",
      "Contact Me": "7assan.3li1998@gmail.com"
    });
  }

  public status = (req: Request, res: Response) => {
    res.status(200).send(`Health Check Successed`);
  }
}

export default StatusController;
