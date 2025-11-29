import {CloudProvider} from "@/app/providers/drive-access/generic/cloud-interface/CloudProvider";
import {CloudEntity, CloudFile, CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";
import * as fs from "node:fs";
import {SUPPORTED_FILE_TYPES} from "@/constants/supported_files";

/**
 * base class for file service providers
 * provides common functionality abstracting away the cloud provider
 * for now works with folderid but should be extended to cache folders and build hierarchy
 */
export class BaseFileService {
    protected provider: CloudProvider;

    constructor(provider: CloudProvider) {
        this.provider = provider;
    }

    async getSpreadsheetContent(fileId: string) {
        return this.provider.getCalcFileContent(fileId, 'A1', 'B7');
    }

    async listFolders(folderId: string): Promise<CloudFolder[]> {
        return await this.provider.listSubFolders(folderId);
    }

    async listFiles(folderId: string): Promise<CloudFile[]> {
        return await this.provider.listSubFiles(folderId);
    }

    async downloadFile(fileId: string, filePath: string){
        const fileBuffer = await this.provider.DownloadFile(fileId);
        fs.writeFileSync(filePath, fileBuffer)
    }

    async getFileWithName(folderId: string, fileName: string, type?: SUPPORTED_FILE_TYPES) {
        const files = await this.listFiles(folderId);
        return files.find(file => file.name === fileName && (type === undefined || file.fileType === type))
    }
}