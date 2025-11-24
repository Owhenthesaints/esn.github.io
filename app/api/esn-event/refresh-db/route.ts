import process from 'node:process';
import ServiceAccountGoogleAuth from "@/app/providers/drive-access/google/auth/ServiceAccountGoogleAuth";
import {GoogleDriveProvider} from "@/app/providers/drive-access/google/cloud-interface/GoogleDriveProvider";
import {BaseFileService} from "@/app/providers/file-handling/file-service/BaseFileService";
import {prisma} from "@/lib/prisma";

async function createEventRow(data: {
    title: string,
    eventDate: Date,
    driveFolderId: string,
    eventDescription: string,
    signupDescription: string,
    location: string,
    signupDeadline?: Date,
    eventEndDate?: Date
}) {
    const newEvent = await prisma.event.create({
        data: {
            title: data.title,
            eventDate: new Date(data.eventDate),
            driveFolderId: data.driveFolderId,
            eventDescription: data.eventDescription,
            signupDescription: data.signupDescription,
            location: data.location,
            signupDeadline: new Date("2025-06-01"),
            eventEndDate: new Date("2025-06-16"),
        },
    });

    console.log(newEvent);
}

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
    for (const event of events) {
        const subFolders = await fileService.listFolders(event.id)
        // get the Image subfolder
        const imageFolder = subFolders.find(folder => folder.name.toLowerCase() === 'images')
        const subFiles = await fileService.listFiles(event.id)
        // the event description is a google drive excel file
        const eventDescriptionFile = subFiles.find(file => file.name.toLowerCase().includes('event description') && file.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        if (eventDescriptionFile === undefined) {
            return false
        }
    }


}

if (process.env.ESN_EVENTS_FOLDER_ID === undefined) throw new Error('misconfiguration:ESN_ENVENTS_FOLDER_ID is not set in env')
const SHARED_FOLDER_ID = process.env.ESN_EVENTS_FOLDER_ID

listFiles(SHARED_FOLDER_ID).catch(console.error);