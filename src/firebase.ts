import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAxL2MEJZD5cXgGItOo1idtuRmoR1aRvIk",
  authDomain: "registro-entrenamientos-2b0c8.firebaseapp.com",
  projectId: "registro-entrenamientos-2b0c8",
  storageBucket: "registro-entrenamientos-2b0c8.firebasestorage.app",
  messagingSenderId: "202237546587",
  appId: "1:202237546587:web:f48db0d3b749856f086f7e"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)