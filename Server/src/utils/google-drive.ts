import fs from 'fs';
import path from 'path';
import mime from 'mime';
import { Readable } from 'stream';
import { TsGoogleDrive } from "ts-google-drive";
import { google } from 'googleapis';
import credentials from '../configs/backupper-service-account.json';

const scopes = ['https://www.googleapis.com/auth/drive'];

const blacklist: string[] = ['dist', 'build', 'node_modules', '.git', '.next', '.nuxt', '.swc', 'out', '.cache'];

const auth = new google.auth.JWT(credentials.client_email, undefined, credentials.private_key, scopes);

export const drive = google.drive({ version: "v3", auth });

export const GoogleDrive = new TsGoogleDrive({ credentials: credentials });


interface DirUploadParams { folderPath: string, fileName: string, folderAtDrive?: { id: string } }

export async function uploadFileToDrive({ folderPath, fileName, folderAtDrive }: DirUploadParams) {
  let filemeta = {
    name: fileName,
    mimeType: mime.getType(fileName)!
  };

  let file = fs.createReadStream(path.resolve(folderPath, fileName));

  const media = {
    mimeType: filemeta.mimeType,
    body: file,
  };

  const fileMetadata = {
    name: filemeta.name,
    parents: ['1SJ76XrP802PKYKIfH2omk8r1q1RV0_oU']
  };

  if (folderAtDrive) {
    fileMetadata.parents = [folderAtDrive.id]
  }

  return await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });
}

export async function createNewFolderAtDrive({ parent, name }: { parent?: string, name: string }) {
  return await GoogleDrive.createFolder({
    name,
    parent: parent || '17UAsFd15pRurTGevkqi1OG2zYcq8IH4x'
  });
}

export async function uploadFolderToDrive({ name, parent = "1SJ76XrP802PKYKIfH2omk8r1q1RV0_oU", folderPath }: { parent?: string, name: string, folderPath: string }) {
  let MainStats = fs.statSync(folderPath);

  if (MainStats.isFile()) {
    await uploadFileToDrive({ folderPath, fileName: name, folderAtDrive: { id: parent } })
  } else {
    let folder = await GoogleDrive.createFolder({ name, parent });

    let files = fs.readdirSync(folderPath);

    for (let fileOrDirName of files) {
      if (blacklist.indexOf(fileOrDirName) > -1) continue;

      let stats = fs.statSync(folderPath);

      //= File
      if (stats.isFile()) {
        await uploadFileToDrive({ folderPath, fileName: fileOrDirName, folderAtDrive: folder })
      } else {
        await uploadFolderToDrive({ name: fileOrDirName, parent: folder.id, folderPath: path.resolve(folderPath, fileOrDirName) })
      }
    }
  }

  return {
    success: true
  }
}