
export enum SUPPORTED_FILE_TYPES {
    IMG = "image",
    TXT = "text",
    DOC = "document",
    SHEET = "sheet",
    OTHERS = "others"
}

export const SUPPORTED_FILE_TYPE_LIST = Object.values(SUPPORTED_FILE_TYPES);

export interface AllowedFileTypes {
    fileTypes: SUPPORTED_FILE_TYPES[number];
}