import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

import {
  getMessaging,
  getToken as getTokenFirebase,
  onMessage,
} from "firebase/messaging";
import axios from "../middleware/axios_gql";

export type NotificationPayload = {
  show: boolean;
  title: string;
  body: string;
  type: "danger" | "success" | "warning" | "info";
  icon: string | null | undefined;
};

const firebaseConfig = {
  apiKey: "AIzaSyDJEOpDEk0nj-seANxM-r62YQJNKhd7t0I",
  authDomain: "flangoo-56894.firebaseapp.com",
  projectId: "flangoo-56894",
  storageBucket: "flangoo-56894.appspot.com",
  messagingSenderId: "741455193600",
  appId: "1:741455193600:web:3d2381030683e5d9dc1ae5",
};

const firebaseApp = initializeApp(firebaseConfig);

const messaging = "Notification" in window ? getMessaging(firebaseApp) : false;

export const db = getFirestore(firebaseApp);

export const getToken = async (
  setTokenFound: (set: boolean) => void,
  user_token: string
) => {
  if (!messaging) return;
  try {
    const currentToken = await getTokenFirebase(messaging, {
      vapidKey:
        "BBfNfxATsd8U2S7iJljXlG0eP0qMBGzyd_5oJcvO95tEJRnRxNP4GSQW8MqdpkVLLZGLEhW9lmMaCBSOjXxddtI",
    });
    if (currentToken) {
      console.log("current token for client: ", currentToken);

      localStorage.setItem("ntt", currentToken);
      setTokenFound(true);
      await saveUserFcmToken(currentToken, user_token);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      setTokenFound(false);
      // shows on the UI that permission is required
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (messaging && "Notification" in window) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } else {
      reject("No Notification available on device");
    }
  });

async function saveUserFcmToken(token: string, user_token: string) {
  const data = {
    query:
      "mutation saveFcm($token: String!){\n\tsaveFcmToken(token:$token)\n}",
    variables: { token: token },
    operationName: "saveFcm",
  };
  try {
    axios.defaults.headers.authorization = `Bearer ${user_token}`;
    await axios.post("", data);
    return true;
  } catch (error) {
    console.log("firebase.ts:72 | error ", error);
    return false;
  }
}
