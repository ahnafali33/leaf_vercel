import { initializeApp, deleteApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";
import path from "path";

async function testClientDb() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  console.log("Config loaded:", config.projectId);

  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  };

  console.log("Initializing client-side Firebase with config...");
  const app = initializeApp(firebaseConfig);
  
  try {
    console.log(`Connecting to named DB: ${config.firestoreDatabaseId}...`);
    const db = getFirestore(app, config.firestoreDatabaseId);
    
    console.log("Attempting to read 'products' collection...");
    const q = query(collection(db, "products"), limit(1));
    const snap = await getDocs(q);
    console.log("SUCCESS! Got documents:", snap.size);
    snap.forEach((doc) => {
      console.log("Doc data:", doc.id, doc.data());
    });
  } catch (err: any) {
    console.error("Client DB failed:", err.message);
  } finally {
    console.log("Exiting process...");
    process.exit(0);
  }
}

testClientDb().catch((err) => {
  console.error(err);
  process.exit(1);
});
