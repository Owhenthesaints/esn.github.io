
import {drive_v3} from "googleapis";
import {GoogleAuthProvider} from "@/app/providers/drive-access/generic/auth/AuthProvider";
import {CloudEntity, CloudFile, CloudFolder} from "@/app/providers/drive-access/generic/file-service/FileInterfaces";
import {CloudProvider} from "@/app/providers/drive-access/generic/cloud-interface/CloudProvider";


export class GoogleDriveProvider extends drive_v3.Drive implements CloudProvider {

    constructor(auth: GoogleAuthProvider) {
        super({auth: auth.getAuth()});
    }


    async listEntities(folderId: string) : Promise<CloudEntity[]>{
        const res = await this.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType)',
        });
        // files both describe files and folders
        const files = res.data.files;
        return files?.map(file => ({id: file.id!, name: file.name!, mimeType: file.mimeType!})) ?? [];
    }

    async listSubFiles(folderId: string): Promise<CloudFile[]> {
        const entities = await this.listEntities(folderId);
        return entities.filter(file => file.mimeType !== "application/vnd.google-apps.folder")
            .map(file => ({id: file.id!, name: file.name!, mimeType: file.mimeType!}))
    }

    async listSubFolders(folderId: string): Promise<CloudFolder[]> {
        const entities = await this.listEntities(folderId);
        return entities.filter(file => file.mimeType === "application/vnd.google-apps.folder")
            .map(file => ({id: file.id!, name: file.name!, mimeType: file.mimeType!}))
    }
}