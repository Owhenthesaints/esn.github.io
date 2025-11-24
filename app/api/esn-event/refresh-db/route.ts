import process from 'node:process';
import ServiceAccountGoogleAuth from "@/app/providers/drive-access/google/auth/ServiceAccountGoogleAuth";
import {GoogleDriveProvider} from "@/app/providers/drive-access/google/cloud-interface/GoogleDriveProvider";
import {BaseFileService} from "@/app/providers/file-handling/file-service/BaseFileService";

/**
 * Lists the names and IDs of up to 10 files.
 */
async function listFiles(sharedFolderId: string) {
    // Authenticate with Google and get an authorized client.
    if (!process.env.CREDENTIALS_SERVICE_PATH) {
        throw new Error('CREDENTIALS_SERVICE_PATH environment variable is not set.');
    }

    const serviceAccountJson: string = process.env.CREDENTIALS_SERVICE_PATH
    const auth = ServiceAccountGoogleAuth.fromFilePath(serviceAccountJson)
    const driveProvider = new GoogleDriveProvider(auth)
    const fileService = new BaseFileService(driveProvider)
    const events = await fileService.listFolders(sharedFolderId)
    for (const eventFolder of events) {
        console.log(`Event Folder: ${eventFolder.name} (${eventFolder.id})`);
    }
}

if (process.env.ESN_EVENTS_FOLDER_ID === undefined) throw new Error('misconfiguration:ESN_ENVENTS_FOLDER_ID is not set in env')
const SHARED_FOLDER_ID = process.env.ESN_EVENTS_FOLDER_ID

listFiles(SHARED_FOLDER_ID).catch(console.error);