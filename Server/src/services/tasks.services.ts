import fs from 'fs';
import path from 'path';
import mime from 'mime';
import archiver from 'archiver';
import { uploadFileToDrive, uploadFolderToDrive, createNewFolderAtDrive } from '../utils/google-drive';

export default class TasksServices {
  public blacklist: string[] = ['dist', 'build', 'node_modules', '.git', '.next', '.nuxt', '.swc', 'out', '.cache'];
  public blacklistedFolders: string[] = ['Archive', 'Libs', 'Not Important', 'Old-Archive', 'DELETED'];
  public webWorksFolderPath: string = "E:\\Web Works";
  public webWorksArchivePath: string = "E:\\Web Works\\Archive"


  public async UploadFile(providedFilePath: string): Promise<void> {
    let fileName = providedFilePath.split('\\').at(-1)!;

    await uploadFileToDrive({ folderPath: providedFilePath.split('\\').slice(0, -1).join('\\'), fileName });
  }

  public async UploadDirectory(dirPath: string): Promise<string[]> {
    let files = fs.readdirSync(dirPath);

    let mainFolder: string = dirPath.split('\\').at(-1)!;

    let mainDir = await createNewFolderAtDrive({ name: mainFolder });

    for (let fileOrDirName of files) {
      if (this.blacklist.indexOf(fileOrDirName) > -1) continue;

      let stats = fs.statSync(path.resolve(dirPath, fileOrDirName));

      //= File
      if (stats.isFile()) {
        await uploadFileToDrive({ folderPath: dirPath, fileName: fileOrDirName, folderAtDrive: mainDir })
      } else {
        await uploadFolderToDrive({ name: fileOrDirName, parent: mainDir.id, folderPath: path.resolve(dirPath, fileOrDirName) })
      }
    }

    return files;
  }

  public ScanAndArchiveTask = async (mainPath: string, parentFolder?: string): Promise<boolean> => {
    return await new Promise((resolve) => {
      const filesOrFolders = fs.readdirSync(path.resolve(mainPath));

      let filesCount = filesOrFolders.length;
      let currentCount = 0;
      /*
        *| Loop through the files and folders in the current directory and do the archive operation
      */
      for (let fileOrDirName of filesOrFolders) {
        let fileOrFolderPath = path.resolve(mainPath, fileOrDirName);
        let fileOrFolderStats = fs.statSync(fileOrFolderPath);

        /*
          *| Filter out the blacklisted folders
        */
        if (fileOrFolderStats.isDirectory() && this.blacklistedFolders.indexOf(fileOrDirName) === -1) {
          const innerContent = fs.readdirSync(fileOrFolderPath);

          /*
           *| Check If The Current Directory is Uploadable or not
           *| uploadable directory is a directory that contains a single project codespace
          */
          let uploadable = false;
          for (let infile of innerContent) {
            if (['package.json', 'index.html', 'demos.html', '.gitignore'].indexOf(infile) !== -1) uploadable = true
          }

          if (!uploadable) {
            let scanable = false;
            for (let infile of innerContent) {
              let infileStat = fs.statSync(path.resolve(fileOrFolderPath, infile));
              if (infileStat.isDirectory()) {
                scanable = true;
              }
            }
            if (scanable) {
              let newFolderPath = fileOrFolderPath.split('\\').at(-1)
              if (parentFolder) newFolderPath = parentFolder + "-" + fileOrFolderPath.split('\\').at(-1);
              this.ScanAndArchiveTask(fileOrFolderPath, newFolderPath);
            }
            currentCount++;
            continue;
          }
          /***********| Check End |***********/

          /*
            *| Initialize the archiver task
          */
          const archive = archiver('zip', {
            zlib: { level: 9 },
            statConcurrency: 6
          });

          /*
            *| a Check for creating a sub-folder in archive directory for the current folder
          */
          if (parentFolder) {
            let tempDir = path.resolve(this.webWorksFolderPath, `./Archive/${parentFolder}`);
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir);
            }
          }
          const outputPath = parentFolder
            ?
            path.resolve(this.webWorksFolderPath, `./Archive/${parentFolder}/${fileOrDirName}.zip`)
            :
            path.resolve(this.webWorksFolderPath, `./Archive/${fileOrDirName}.zip`);
          const output = fs.createWriteStream(outputPath);

          output.on('close', function () {
            console.log(`File: ${fileOrDirName} | Outputed at: ${outputPath} | Size: (${(archive.pointer() / (1024 * 1024)).toFixed(3)} MB)`);
            currentCount++;
          });

          archive.on('error', function (err) {
            console.log(err);
            currentCount++;
          });

          archive.pipe(output);

          /*
            *| Loop through the files and folder and archive them
          */
          for (let innerFileOrDirName of innerContent) {
            if (this.blacklist.indexOf(innerFileOrDirName) > -1) continue;

            let FILE_PATH = path.resolve(fileOrFolderPath, innerFileOrDirName);

            let stats = fs.statSync(FILE_PATH);

            if (stats.isFile()) archive.file(FILE_PATH, { name: innerFileOrDirName });
            else archive.directory(FILE_PATH, innerFileOrDirName);
          }

          /*
            *| Finalize archiving
          */
          archive.finalize();
        } else {
          currentCount++;
        }
      }

      /*
        *| End up the operation and send the end feedback
      */
      let interval = setInterval(() => {
        if (currentCount >= filesCount) {
          resolve(true);
          clearInterval(interval);
        }
      }, 1000);
    });
  }

  public uploadArchivedWorksTask = async () => {
    const archivePath = path.resolve(this.webWorksArchivePath);
    let files = fs.readdirSync(archivePath);

    for (let fileOrDirName of files) {
      let stats = fs.statSync(path.resolve(archivePath, fileOrDirName));

      //= File
      if (stats.isFile()) {
        let folderPath = archivePath.split('\\').slice(0, -1).join('\\')
        await uploadFileToDrive({ folderPath, fileName: fileOrDirName })
      } else {
        await uploadFolderToDrive({ name: fileOrDirName, folderPath: path.resolve(archivePath, fileOrDirName) })
      }
    }

    return files;
  }
}