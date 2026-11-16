import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";
import path from "path";

async function testClientWrite() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, config.firestoreDatabaseId);
  
  try {
    console.log("Adding a test product...");
    const docRef = await addDoc(collection(db, "products"), {
      name: "Test Aquatic Moss",
      price: 12.99,
      description: "A beautiful test moss from our automated test suite.",
      createdAt: new Date().toISOString()
    });
    console.log("SUCCESS! Created document with ID:", docRef.id);
    
    console.log("Reading back the products...");
    const q = query(collection(db, "products"), limit(5));
    const snap = await getDocs(q);
    console.log(`Found ${snap.size} documents:`);
    snap.forEach((doc) => {
      console.log(`- [${doc.id}]:`, doc.data());
    });
  } catch (err: any) {
    console.error("CRUD test failed:", err.message);
  } finally {
    process.exit(0);
  }
}

testClientWrite().catch((err) => {
  console.error(err);
  process.exit(1);
});
