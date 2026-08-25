import {
  GoogleAuthProvider,
  signOut as fbSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  type User as FirebaseUser,
  type UserCredential,
} from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
  type OneTapUser as NitroGoogleUser,
} from 'react-native-nitro-google-signin';

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  '805090080128-n65h0obud7r7r30g02qhnf6uiidpu46f.apps.googleusercontent.com';

let isConfigured = false;

/**
 * Initializes GoogleOneTapSignIn with the Web Client ID.
 */
export function configureGoogleSignIn(): void {
  if (isConfigured) return;

  try {
    GoogleOneTapSignIn.configure({
      webClientId: 'autoDetect', 
      offlineAccess: true,
    });
    isConfigured = true;
  } catch (error) {
    console.warn('Failed to configure GoogleOneTapSignIn:', error);
  }
}

export type GoogleSignInResult =
  | {
      success: true;
      firebaseUser: FirebaseUser;
      googleUser: NitroGoogleUser;
      isNewUser: boolean;
      idToken: string;
    }
  | {
      success: false;
      cancelled?: boolean;
      error?: string;
    };

/**
 * Executes the full Google Sign-In / Account Creation flow and authenticates with Firebase.
 *
 * Flow:
 * 1. Checks Play Services on Android.
 * 2. Attempts Credential Manager / One Tap sign-in.
 * 3. Falls back to interactive account creation if no saved credentials exist.
 * 4. Falls back to explicit Sign in with Google account picker if needed.
 * 5. Uses the resulting Google ID token to create/sign-in a Firebase User account.
 */
export async function signInWithGoogleOAuth(): Promise<GoogleSignInResult> {
  try {
    configureGoogleSignIn();

    // Check Play Services on Android
    if (Platform.OS === 'android') {
      try {
        await GoogleOneTapSignIn.checkPlayServices();
      } catch (err) {
        if (isErrorWithCode(err) && err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          return {
            success: false,
            error: 'Google Play Services is not available or needs to be updated on your device.',
          };
        }
      }
    }

    // Step 1: Attempt silent / One Tap sign-in
    let response = await GoogleOneTapSignIn.signIn();

    // Step 2: If no saved credentials, prompt account creation / picker
    if (isNoSavedCredentialFoundResponse(response)) {
      response = await GoogleOneTapSignIn.createAccount();
    }

    // Step 3: If still no credential, present explicit sign-in dialog
    if (isNoSavedCredentialFoundResponse(response)) {
      response = await GoogleOneTapSignIn.presentExplicitSignIn();
    }

    // Handle user cancellation
    if (isCancelledResponse(response)) {
      return { success: false, cancelled: true };
    }

    // Handle successful Google auth
    if (isSuccessResponse(response)) {
      const { user: googleUser, idToken } = response.data;

      if (!idToken) {
        return {
          success: false,
          error: 'Google Sign-In did not return a valid security token. Please try again.',
        };
      }

      // Step 4: Sign in / Create account in Firebase using Google Auth Provider Credential
      const auth = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential: UserCredential = await signInWithCredential(
        auth,
        googleCredential
      );

      const isNewUser = !!userCredential.additionalUserInfo?.isNewUser;

      return {
        success: true,
        firebaseUser: userCredential.user,
        googleUser,
        isNewUser,
        idToken,
      };
    }

    return {
      success: false,
      error: 'Google Sign-In could not be completed. Please try again.',
    };
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { success: false, cancelled: true };
      }
      if (error.code === statusCodes.DEVELOPER_ERROR) {
        return {
          success: false,
          error: 'Google Sign-In configuration mismatch (developer error). Check SHA-1 certificate configuration in Firebase Console.',
        };
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          success: false,
          error: 'Google Play Services is not available or outdated.',
        };
      }
      return {
        success: false,
        error: `Google Sign-In error (${error.code}): ${error.message || 'Authentication failed'}`,
      };
    }

    return {
      success: false,
      error: error?.message || 'An unexpected error occurred during Google Sign-In.',
    };
  }
}

/**
 * Signs out from Firebase and Google One Tap.
 */
export async function signOut(): Promise<void> {
  try {
    const auth = getAuth();
    await fbSignOut(auth);
  } catch (error) {
    console.warn('Error signing out of Firebase:', error);
  }

  try {
    await GoogleOneTapSignIn.signOut();
  } catch (error) {
    console.warn('Error signing out of Google One Tap:', error);
  }
}

/**
 * Permanently deletes the current Firebase user account and signs out of Google.
 */
export async function deleteCurrentUser(): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      await currentUser.delete();
    } catch (error: any) {
      console.warn('Error deleting Firebase user account:', error);
      // If requires-recent-login, throw so UI can notify user
      if (error?.code === 'auth/requires-recent-login') {
        throw new Error('Please sign in again before deleting your account for security verification.');
      }
      throw error;
    }
  }

  try {
    await GoogleOneTapSignIn.signOut();
  } catch (error) {
    console.warn('Error signing out of Google One Tap during deletion:', error);
  }
}

/**
 * Returns current Firebase authenticated user.
 */
export function getCurrentUser(): FirebaseUser | null {
  try {
    return getAuth().currentUser;
  } catch {
    return null;
  }
}

/**
 * Subscribe to Firebase Auth state changes.
 */
export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  try {
    const auth = getAuth();
    return onAuthStateChanged(auth, callback);
  } catch {
    return () => {};
  }
}

