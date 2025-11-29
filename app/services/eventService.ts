// app/services/eventService.ts
import ServiceAccountGoogleAuth from "@/app/providers/drive-access/google/auth/ServiceAccountGoogleAuth";
import {GoogleDriveProvider} from "@/app/providers/drive-access/google/cloud-interface/GoogleDriveProvider";
import {BaseFileService} from "@/app/providers/file-handling/file-service/BaseFileService";
import {SUPPORTED_FILE_TYPES} from "@/constants/supported_files";
import {CloudFile, CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";
import {EventInterface, SPREADSHEET_EVENT_KEYS} from "@/app/providers/event-handling/interfaces/event-interface";

const serviceAccountJson = process.env.CREDENTIALS_SERVICE_PATH;
if (!serviceAccountJson) {
    throw new Error('CREDENTIALS_SERVICE_PATH environment variable is not set.');
}
const auth = ServiceAccountGoogleAuth.fromFilePath(serviceAccountJson);
const driveProvider = new GoogleDriveProvider(auth);
const fileService = new BaseFileService(driveProvider);

export async function getEventFolders() {
    if (!process.env.CREDENTIALS_SERVICE_PATH) {
        throw new Error('CREDENTIALS_SERVICE_PATH environment variable is not set.');
    }


    if (!process.env.ESN_EVENTS_FOLDER_ID) {
        throw new Error('ESN_EVENTS_FOLDER_ID is not set');
    }

    return await fileService.listFolders(process.env.ESN_EVENTS_FOLDER_ID);
}

function checkRequiredKeys(dataMap: Map<string, string | undefined>, requiredKeys: string[]) {
    for (const key of requiredKeys) {
        if (!dataMap.has(key)) {
            throw new Error(`Missing required key: ${key}`);
        }
    }
}

function checkRequiredEventKeys(dataMap: Map<string, string | undefined>) {
    const requiredKeys: string[] = Object.values(SPREADSHEET_EVENT_KEYS)
    checkRequiredKeys(dataMap, requiredKeys);
}

async function getEventDescriptionFromFolder(folder: CloudFolder) {
    const eventDescription = await fileService.getFileWithName(
        folder.id,
        'Event description',
        SUPPORTED_FILE_TYPES.SHEET
    );
    if (!eventDescription) {
        throw new Error(`Event description file not found in folder ${folder.name}`);
    }
    const content = await fileService.getSpreadsheetContent(eventDescription.id);
    // make everything lowercase and trim spaces

    const dataMap = new Map<string, string | undefined>();
    content.forEach(row => {
        if (row.length === 0) {
            throw new Error(`Event description file not found in folder ${folder.name}`);
        }
        const key = row[0].toLowerCase().trim();
        if (row.length >= 2) {
            const value = row[1].trim();
            dataMap.set(key, value)
        } else {
            dataMap.set(key, undefined)
        }
    })


    // check the keys
    checkRequiredEventKeys(dataMap);

    return {
        folderId: folder.id,
        eventDate: new Date(dataMap.get(SPREADSHEET_EVENT_KEYS.EVENT_DATE)!),
        eventDescription: dataMap.get(SPREADSHEET_EVENT_KEYS.EVENT_DESCRIPTION)!,
        signupDescription: dataMap.get(SPREADSHEET_EVENT_KEYS.SIGNUP_DESCRIPTION)!,
        displayed: dataMap.get(SPREADSHEET_EVENT_KEYS.DISPLAYED) === 'TRUE',
        title: folder.name,
        createdAt: new Date(folder.createdTime),
        updatedAt: new Date(folder.lastModifiedTime),
        signupDeadline: dataMap.get(SPREADSHEET_EVENT_KEYS.SIGNUP_DEADLINE) ? new Date(dataMap.get(SPREADSHEET_EVENT_KEYS.SIGNUP_DEADLINE)!) : undefined,
        eventEndDate: dataMap.get(SPREADSHEET_EVENT_KEYS.EVENT_END_DATE) ? new Date(dataMap.get(SPREADSHEET_EVENT_KEYS.EVENT_END_DATE)!) : undefined,
        location: dataMap.get(SPREADSHEET_EVENT_KEYS.LOCATION),
    }

}

export async function hydrateEventDB() {
    const eventFolders = await getEventFolders();
    const contents: EventInterface[] = await Promise.all(
        eventFolders.map(getEventDescriptionFromFolder)
    )
    console.log(contents);

}

hydrateEventDB();
