// Configuration Firebase
// REMPLACEZ CES VALEURS PAR VOS PROPRES CONFIGURATIONS FIREBASE
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    databaseURL: "VOTRE_DATABASE_URL",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();