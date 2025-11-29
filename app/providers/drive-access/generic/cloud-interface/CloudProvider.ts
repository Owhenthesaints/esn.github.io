import {CloudFile, CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";

export interface CloudProvider {
    listSubFiles(folderId: string): Promise<CloudFile[]>;
    listSubFolders(folderId: string): Promise<CloudFolder[]>;
    DownloadFile(fileId: string): Promise<Buffer>;
    getCalcFileContent(fileId: string, lowerRange: string, higherRange: string): Promise<string[][]>;
}