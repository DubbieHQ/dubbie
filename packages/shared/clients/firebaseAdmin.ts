import admin from "firebase-admin";

import * as serviceAccount from "./service-account.json";

if (!admin.apps.length) {
  // Check if there are no initialized apps
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "dubbie-studio.appspot.com",
  });
}

export default admin;
