import {SUPPORTED_FILE_TYPE_LIST} from "@/constants/supported_files";

export interface CloudEntity {
    id: string;
    name: string;
    mimeType: string;
}

export interface CloudFile extends CloudEntity {
    size?: number;
    lastModifiedTime?: string;
    fileType?: typeof SUPPORTED_FILE_TYPE_LIST[number];
}


export interface CloudFolder extends CloudEntity{
    numEntities?: number;
    numFiles?: number;
    numFolders?: number;
    parentFolderId?: CloudEntity["id"];
    childrenIds?: CloudEntity["id"][];
}