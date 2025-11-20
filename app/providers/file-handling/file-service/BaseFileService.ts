import {CloudProvider} from "@/app/providers/drive-access/generic/cloud-interface/CloudProvider";
import {CloudEntity, CloudFile, CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";

/**
 * base class for file service providers
 * provides common functionality abstracting away the cloud provider
 * for now works with folderid but should be extended to cache folders and build hierarchy
 */
export class BaseFileService {
    protected provider: CloudProvider;
    private entityCache: Map<string, CloudEntity> = new Map();
    private fileCache: Map<string, CloudFile> = new Map();
    private folderCache: Map<string, CloudFolder> = new Map();

    constructor(provider: CloudProvider) {
        this.provider = provider;
    }

    async listFolders(folderId: string): Promise<CloudFolder[]> {
        const folders = await this.provider.listSubFolders(folderId);
        folders.forEach(folder => this.entityCache.set(folder.id, folder));
        folders.forEach(folder => this.folderCache.set(folder.id, folder));
        return folders;
    }

    async listFiles(folderId: string): Promise<CloudFile[]> {
        const files = await this.provider.listSubFiles(folderId);
        files.forEach(file => this.entityCache.set(file.id, file));
        files.forEach(file => this.fileCache.set(file.id, file));
        return files;
    }
}