import fs from "fs";
import path from "path";

async function testRestApi() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  
  const dbs = [config.firestoreDatabaseId, "(default)"];
  
  for (const dbId of dbs) {
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${dbId}/documents/products?key=${config.apiKey}`;
    console.log(`\nTesting DB: ${dbId}`);
    console.log("URL:", url.replace(config.apiKey, "[REDACTED]"));
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("Status:", res.status);
      if (res.status === 200) {
        console.log("SUCCESS! Got documents:", data.documents?.length || 0);
      } else {
        console.log("Failed:", JSON.stringify(data));
      }
    } catch (err: any) {
      console.error("Failed:", err.message);
    }
  }
}

testRestApi().catch(console.error);
