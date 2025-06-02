import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDBmrX00Df45sivlbk0MdC_XHvT08kwj9k",
  authDomain: "stylesync-4d5cb.firebaseapp.com",
  projectId: "stylesync-4d5cb",
  storageBucket: "stylesync-4d5cb.firebasestorage.app",
  messagingSenderId: "184527970219",
  appId: "1:184527970219:web:9dfdaccf936e72d58cfcee",
  measurementId: "G-MYEKVKJ9KN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app; 