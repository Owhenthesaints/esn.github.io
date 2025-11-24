import {drive_v3} from "googleapis";
import {GoogleAuthProvider} from "@/app/providers/drive-access/generic/auth/AuthProvider";
import {CloudEntity, CloudFile, CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";
import {CloudProvider} from "@/app/providers/drive-access/generic/cloud-interface/CloudProvider";
import Schema$File = drive_v3.Schema$File;
import {SUPPORTED_FILE_TYPES} from "@/constants/supported_files";
import {file} from "googleapis/build/src/apis/file";

const FOLDER_CONSTANT = "application/vnd.google-apps.folder";

export class GoogleDriveProvider extends drive_v3.Drive implements CloudProvider {

    // create a map where I cache CloudFolders
    private fileCache: Map<string, CloudFile> = new Map();
    private folderCache: Map<string, CloudFolder> = new Map();
    private entityCache: Map<string, CloudEntity> = new Map();

    constructor(auth: GoogleAuthProvider) {
        super({auth: auth.getAuth()});
    }

    private isFile(file: CloudEntity | string) {
        if (typeof file === 'string'){
            return file !== FOLDER_CONSTANT;
        }
        else {
            return file.mimeType !== FOLDER_CONSTANT;
        }
    }

    protected SchemasToEntities(files: Schema$File[]): CloudEntity[] {
        return files.map(file => (this.SchemaToEntity(file)))
    }

    protected SchemaToFolder(folderData: Schema$File, files: Schema$File[]): CloudFolder {
        if (!folderData.id || !folderData.name) {
            throw Error(`Folder data must have id and name`);
        }
        const parentId = folderData.parents && folderData.parents.length > 0 ? folderData.parents[0] : null;
        const isRoot = !parentId;
        const len = files.length;
        const childrenId = files.map(file => file.id!)
        const foldersId = files.filter(file => !this.isFile(file.id!)).map(folder => folder.id!)
        const fileIds = files.filter(file => this.isFile(file.id!)).map(file => file.id!)
        const folder: CloudFolder = {
            id: folderData.id,
            name: folderData.name ? folderData.name : 'Unknown',
            parentFolderId: parentId ? parentId : undefined,
            root: isRoot,
            numEntities: len,
            mimeType: 'application/vnd.google-apps.folder',
            mainType: 'folder',
            childrenIds: childrenId,
            fileIds: fileIds,
            folderIds: foldersId,
        }
        // add to the folder cache
        this.folderCache.set(folderData.id, folder);
        return folder;

    }

    protected SchemaToEntity(file: Schema$File): CloudEntity {
        return {
            id: file.id!,
            name: file.name!,
            mimeType: file.mimeType!,
            mainType: file.mimeType === FOLDER_CONSTANT ? 'folder' : 'file'
        }
    }

    protected getFileType(mimeType: string): SUPPORTED_FILE_TYPES {
        if (!mimeType) throw new Error('Owhenthesaints: MIME type is undefined for attribution');

        const lowerMime = mimeType.toLowerCase();

        if (lowerMime.startsWith('image/')) {
            return SUPPORTED_FILE_TYPES.IMG;
        } else if (lowerMime.startsWith('text/')) {
            return SUPPORTED_FILE_TYPES.TXT;
        } else if (lowerMime === 'application/vnd.google-apps.document' || lowerMime === 'application/msword' || lowerMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return SUPPORTED_FILE_TYPES.DOC;
        } else if (lowerMime === 'application/vnd.google-apps.spreadsheet' || lowerMime === 'application/vnd.ms-excel' || lowerMime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return SUPPORTED_FILE_TYPES.SHEET;
        } else {
            return SUPPORTED_FILE_TYPES.OTHERS;
        }
    }

    protected SchemaToFile(fileData: Schema$File): CloudFile {
        if (!fileData.id || !fileData.name || !fileData.size || !fileData.modifiedTime) {
            throw Error(`File data must have id, name, size and modifiedTime`);
        }
        return {
            id: fileData.id,
            name: fileData.name ? fileData.name : 'Unknown',
            mimeType: fileData.mimeType ? fileData.mimeType : 'application/octet-stream',
            mainType: 'file',
            size: parseInt(fileData.size!),
            lastModifiedTime: fileData.modifiedTime!,
            fileType: this.getFileType(fileData.mimeType ? fileData.mimeType : ''),
        }
    }

    protected SchemasToFiles(files: Schema$File[]): CloudFile[] {
        return files.map(file => this.SchemaToFile(file));
    }

    private isCached(fileId: string): boolean {
        return this.entityCache.has(fileId);
    }

    private isFileCached(fileId: string): boolean {
        return this.fileCache.has(fileId);
    }

    private isFolderCached(folderId: string): boolean {
        return this.folderCache.has(folderId);
    }

    private getCachedFile(fileId: string): CloudFile | undefined {
        if (this.isFileCached(fileId)) {
            return this.fileCache.get(fileId);
        }
        return undefined;
    }

    private getCachedFolder(folderId: string): CloudFolder | undefined {
        if (this.isFolderCached(folderId)) {
            return this.folderCache.get(folderId);
        }
        return undefined;
    }


    private getCachedEntity(entityId: string): CloudEntity | undefined {
        if (this.isCached(entityId)) {
            return this.entityCache.get(entityId);
        }
        return undefined;
    }


    protected async entitiesToFiles(entities: CloudEntity[]): Promise<CloudFile[]> {
        const filePromises = entities.map(entities => this.entityToFile(entities));
        return await Promise.all(filePromises);

    }

    protected async entityToFile(entity: CloudEntity): Promise<CloudFile> {
        const res = await this.files.get({
            fileId: entity.id
        })
        if (res) {
            return this.SchemaToFile(res.data);
        } else {
            throw new Error('Owhenthesaints: Unable to fetch file data from Google Drive');
        }
    }

    cacheFolder(folder: CloudFolder) {
        if (!folder.id || !folder.mimeType) {
            throw new Error('Owhenthesaints: Cannot cache folder without id or mimeType');
        }

        if (!this.folderCache.has(folder.id)) {
            this.folderCache.set(folder.id, folder);
        }
    }

    private makeEntityQuery(entityId: string) {
        return this.files.get({
            fileId: entityId,
        });
    }

    private listFileQuery(folderId: string) {
        return this.files.list({
            q: `'${folderId}' in parents and trashed = false`,
        })
    }

    cacheFile(file: CloudFile) {
        if (!this.fileCache.has(file.id)) {
            this.fileCache.set(file.id, file);
        }
    }

    protected async makeFile(fileId: string): Promise<CloudFile> {
        if (this.isFileCached(fileId)) {
            const cachedFile = this.getCachedFile(fileId)!;
            return Promise.resolve(cachedFile);
        }
        return this.makeEntityQuery(fileId).then(res => {
            if (!res) {
                throw new Error('Owhenthesaints: File response is null while caching');
            } else if (!res!.data) {
                throw new Error('Owhenthesaints: File response data is null while caching');
            }
            const file = this.SchemaToFile(res!.data);
            this.cacheFile(file);
            return file;
        });
    }

    private async makeFolder(folderId: string) : Promise<CloudFolder> {
        if (this.isFolderCached(folderId)) {
            return this.getCachedFolder(folderId)!;
        }
        const [childrenRes, parentRes] = await Promise.all([this.listFileQuery(folderId), this.makeEntityQuery(folderId)]);

        if (!childrenRes) {
            throw new Error('Owhenthesaints: Children response is null');
        } else if (!childrenRes.data.files) {
            throw new Error('Owhenthesaints: Children response data files is null');
        }
        if (!parentRes) {
            throw new Error('Owhenthesaints: Parent response is null while caching');
        } else if (!parentRes!.data) {
            throw new Error('Owhenthesaints: Parent response data is null while caching');
        }

        const folder = this.SchemaToFolder(parentRes!.data, childrenRes.data.files)
        // when you cache the folder you cache the children
        this.cacheFolder(folder);
        return folder;

    }



    async listEntities(folderId: string, cacheFolder = true, cacheFiles = true): Promise<CloudEntity[]> {

        const childrenRes = await this.listFileQuery(folderId);
        const children = childrenRes.data.files || [];
        const entities = this.SchemasToEntities(children);


        if (cacheFolder){
            this.makeFolder(folderId);
        }
        if (cacheFiles) {
            // transform to CloudFile
            const cloudFiles = this.SchemasToFiles(children.filter(file => this.isFile(this.SchemaToEntity(file))));
            cloudFiles.forEach(file => this.cacheFile(file));
        }
        entities.forEach(entity => {
            this.entityCache.set(entity.id, entity);
        });
        return entities;
    }


    async listSubFiles(folderId: string): Promise<CloudFile[]> {
        const entities = await this.listEntities(folderId);
        const filePromisses = entities.map(entity => this.entityToFile(entity));
        return await Promise.all(filePromisses);
    }

    async listSubFolders(folderId: string): Promise<CloudFolder[]> {
        const entities = await this.listEntities(folderId);
        const folderPromises = entities.map(entity => this.makeFolder(entity.id));
        return await Promise.all(folderPromises);
    }

    async DownloadFile(fileId: string): Promise<Buffer> {
        const res = await this.files.get({
            fileId: fileId,
            alt: 'media'
        }, {responseType: 'arraybuffer'});
        return Buffer.from(res.data as ArrayBuffer);
    }
}