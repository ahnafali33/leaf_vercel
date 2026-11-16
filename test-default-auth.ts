import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import fs from "fs";
import path from "path";

async function testDefaultAuth() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  console.log("Initializing app with empty config/ADC...");
  const app = initializeApp();
  
  try {
    console.log(`Connecting to Firestore with default credentials, project ID: ${config.projectId}, db ID: ${config.firestoreDatabaseId}...`);
    const db = getFirestore(app, config.firestoreDatabaseId);
    
    // Quick get check
    const snap = await db.collection("products").limit(1).get();
    console.log("SUCCESS! Got docs:", snap.size);
  } catch (err: any) {
    console.error("ADC named DB failed:", err.message, err.stack);
  }

  try {
    console.log("Connecting to (default) DB with default credentials...");
    const dbDefault = getFirestore(app);
    const snap = await dbDefault.collection("products").limit(1).get();
    console.log("SUCCESS on default DB! Got docs:", snap.size);
  } catch (err: any) {
    console.error("ADC default DB failed:", err.message, err.stack);
  }
}

testDefaultAuth().catch(console.error);
