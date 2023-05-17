import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDy2bT2EZ72snjAn_FzRui7uz7x-q5NEzc",
  authDomain: "social-app-751c3.firebaseapp.com",
  projectId: "social-app-751c3",
  storageBucket: "social-app-751c3.appspot.com",
  messagingSenderId: "1098835488070",
  appId: "1:1098835488070:web:8fe6933a172d216cf30947",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;