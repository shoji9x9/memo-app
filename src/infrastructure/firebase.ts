import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = (() => {
  // secrets.FIREBASE_SERVICE_ACCOUNT_VITE_REACT_F4C90の値を利用しfirebaseConfigを作成する
  if (import.meta.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(import.meta.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("serviceAccount: ", serviceAccount);
    return {
      apiKey: serviceAccount.apiKey,
      authDomain: serviceAccount.authDomain,
      projectId: serviceAccount.projectId,
      storageBucket: serviceAccount.storageBucket,
      messagingSenderId: serviceAccount.messagingSenderId,
      appId: serviceAccount.appId,
      mesurementId: serviceAccount.measurementId,
    };
  } else {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      mesurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }
})();

console.log("firebaseConfig: ", firebaseConfig);

const app = initializeApp(firebaseConfig);

// 認証周り
const auth = getAuth(app);
// firestore
const database = getFirestore(app);

const provider = new GoogleAuthProvider();

// 開発環境ではemulatorに接続
const isDevelopment = import.meta.env.DEV;
if (isDevelopment) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(database, "127.0.0.1", 8080);
}

export { database, auth, provider };
