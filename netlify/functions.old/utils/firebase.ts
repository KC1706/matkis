import * as admin from 'firebase-admin';

let firestoreInstance: admin.firestore.Firestore | null = null;

/**
 * Initialize Firebase Admin if not already initialized
 */
export function initializeFirebase(): void {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
      }),
    });
  }
}

/**
 * Get Firestore instance with lazy initialization
 */
export function getFirestore(): admin.firestore.Firestore {
  if (!firestoreInstance) {
    initializeFirebase();
    firestoreInstance = admin.firestore();
  }
  return firestoreInstance;
}
