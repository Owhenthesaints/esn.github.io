import {SUPPORTED_FILE_TYPE_LIST} from "@/constants/supported_files";

export interface CloudEntity {
    id: string;
    name: string;
    mimeType: string;
    mainType: 'file' | 'folder';
}

export interface CloudFile extends CloudEntity {
    mainType: 'file';
    size: number;
    lastModifiedTime: string;
    fileType: typeof SUPPORTED_FILE_TYPE_LIST[number];
}


export interface CloudFolder extends CloudEntity{
    mainType: 'folder';
    numEntities: number;
    parentFolderId?: CloudEntity["id"] | undefined;
    root: boolean;
    childrenIds: CloudEntity["id"][];
    fileIds: CloudFile["id"][];
    folderIds: CloudFolder["id"][];
}