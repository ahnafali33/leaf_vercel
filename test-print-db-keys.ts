import fs from "fs";
import path from "path";

async function printDbKeys() {
  const dbPath = path.join(process.cwd(), "src", "data", "db.json");
  if (!fs.existsSync(dbPath)) {
    console.log("src/data/db.json does not exist.");
    return;
  }
  
  const raw = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(raw);
  console.log("DB keys:");
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val)) {
      console.log(`- ${key}: Array of ${val.length} items. Example:`, val[0] ? JSON.stringify(val[0]).substring(0, 100) : "empty");
    } else {
      console.log(`- ${key}: Object. Keys:`, Object.keys(val || {}));
    }
  }
}

printDbKeys().catch(console.error);
