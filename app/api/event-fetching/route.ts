import process from 'node:process';
import {google} from 'googleapis';


/**
 * Lists the names and IDs of up to 10 files.
 */
async function listFiles(sharedFolderId: string) {
    // Authenticate with Google and get an authorized client.
    if (!process.env.CREDENTIALS_SERVICE_PATH) {
        throw new Error('CREDENTIALS_SERVICE_PATH environment variable is not set.');
    }

    const serviceAccountJson: string = process.env.CREDENTIALS_SERVICE_PATH
    const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountJson,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })


    const drive = google.drive({version: 'v3', auth});
    // Get the list of files.
    const result = await drive.files.list({
        pageSize: 10,
        q: `'${sharedFolderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType)',
    });

    const files = result.data.files;
    if (!files || files.length === 0) {
        console.log('No files found.');
        return;
    }

    console.log('Files:');
    // Print the name and ID of each file.
    files.forEach((file) => {

        if (file.mimeType === 'application/vnd.google-apps.folder') {
            console.log(`Folder: ${file.name} (${file.id})`);
        }
        else {
            console.log(`${file.name} (${file.id})`);
        }
    });
}

if (process.env.ESN_EVENTS_FOLDER_ID === undefined) throw new Error('misconfiguration:ESN_ENVENTS_FOLDER_ID is not set in env')
const SHARED_FOLDER_ID = process.env.ESN_EVENTS_FOLDER_ID

listFiles(SHARED_FOLDER_ID).catch(console.error);