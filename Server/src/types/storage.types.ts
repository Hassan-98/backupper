export interface URLFile {
  buffer: Buffer;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
}

export interface File {
  name: string;
  url: string;
  path: string;
  size: number;
}

export interface UploadParams {
  file: Express.Multer.File | URLFile;
  fileType: string;
  folder: string
}