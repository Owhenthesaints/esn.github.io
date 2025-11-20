import {GoogleAuthProvider} from "@/app/providers/drive-access/generic/auth/AuthProvider";
import {GoogleAuth} from "google-auth-library";


export default class ServiceAccountGoogleAuth implements GoogleAuthProvider{
    auth : GoogleAuth
    private constructor(auth: GoogleAuth) {
        this.auth = auth
    }

    static fromFilePath(filePath: string): ServiceAccountGoogleAuth {
        return new ServiceAccountGoogleAuth(new GoogleAuth({
            keyFile: filePath,
            scopes: ['https://www.googleapis.com/auth/drive.readonly']
        }))
    }

    getAuth(): GoogleAuth {
        return this.auth;
    }

}
