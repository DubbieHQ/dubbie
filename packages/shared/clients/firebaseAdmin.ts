import admin from "firebase-admin";

if (!admin.apps.length) {
  // Check if there are no initialized apps
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: "dubbie-studio.appspot.com",
  });
}

export default admin;
