import {
  GoogleAuthProvider,
  signOut as fbSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword as fbSignInWithEmail,
  createUserWithEmailAndPassword as fbCreateUserWithEmail,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile,
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

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export function mapFirebaseAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please create an account.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed login attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

export type EmailAuthResult =
  | {
      success: true;
      firebaseUser: FirebaseUser;
      isNewUser?: boolean;
    }
  | {
      success: false;
      error?: string;
    };

/**
 * Signs in user with Email and Password.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<EmailAuthResult> {
  try {
    const auth = getAuth();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    const userCredential = await fbSignInWithEmail(auth, cleanEmail, password);
    return {
      success: true,
      firebaseUser: userCredential.user,
      isNewUser: false,
    };
  } catch (error: any) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

/**
 * Creates a new user account with Email and Password.
 */
export async function signUpWithEmailPassword(
  email: string,
  password: string,
  displayName?: string
): Promise<EmailAuthResult> {
  try {
    const auth = getAuth();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const userCredential = await fbCreateUserWithEmail(auth, cleanEmail, password);
    const user = userCredential.user;

    if (displayName && displayName.trim()) {
      try {
        await updateProfile(user, { displayName: displayName.trim() });
      } catch (profileErr) {
        console.warn('Profile update warning:', profileErr);
      }
    }

    return {
      success: true,
      firebaseUser: user,
      isNewUser: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

/**
 * Sends a password reset email.
 */
export async function sendPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getAuth();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    await fbSendPasswordResetEmail(auth, cleanEmail);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

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
    await Promise.race([
      GoogleOneTapSignIn.signOut(),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);
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

