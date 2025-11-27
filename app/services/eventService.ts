// app/services/eventService.ts
import ServiceAccountGoogleAuth from "@/app/providers/drive-access/google/auth/ServiceAccountGoogleAuth";
import { GoogleDriveProvider } from "@/app/providers/drive-access/google/cloud-interface/GoogleDriveProvider";
import { BaseFileService } from "@/app/providers/file-handling/file-service/BaseFileService";

export async function getEventFolders() {
    if (!process.env.CREDENTIALS_SERVICE_PATH) {
        throw new Error('CREDENTIALS_SERVICE_PATH environment variable is not set.');
    }

    const serviceAccountJson = process.env.CREDENTIALS_SERVICE_PATH;
    const auth = ServiceAccountGoogleAuth.fromFilePath(serviceAccountJson);
    const driveProvider = new GoogleDriveProvider(auth);
    const fileService = new BaseFileService(driveProvider);

    if (!process.env.ESN_EVENTS_FOLDER_ID) {
        throw new Error('ESN_EVENTS_FOLDER_ID is not set');
    }

    return await fileService.listFolders(process.env.ESN_EVENTS_FOLDER_ID);
}

export async function getEventFolderById(eventId: string) {
    const events = await getEventFolders();
    return events.find(event => event.id === eventId);
}