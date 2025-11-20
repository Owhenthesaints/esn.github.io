import {CloudFile, CloudFolder} from "@/app/providers/drive-access/generic/file-service/FileInterfaces";

export interface CloudProvider {
    listSubFiles(folderId: string): Promise<CloudFile[]>;
    listSubFolders(folderId: string): Promise<CloudFolder[]>;
}