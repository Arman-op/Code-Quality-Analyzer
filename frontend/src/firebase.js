import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCe3tSSdrFph2Rzz1PldpnloaQpMWlzGQs",
  authDomain: "luminacode-20066.firebaseapp.com",
  projectId: "luminacode-20066",
  storageBucket: "luminacode-20066.firebasestorage.app",
  messagingSenderId: "839618457562",
  appId: "1:839618457562:web:efb7e0874ba3f72fc3dae3",
  measurementId: "G-DS5C7LQH1C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
