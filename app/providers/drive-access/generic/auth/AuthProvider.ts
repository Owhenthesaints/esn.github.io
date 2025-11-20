import {GoogleAuth} from "google-auth-library"

/**
 * interface to auth into various drive auth services need to append all interfaces here
 */
export interface AuthProvider<T = unknown> {
    getAuth(): T;
}


export type GoogleAuthProvider = AuthProvider<GoogleAuth>

