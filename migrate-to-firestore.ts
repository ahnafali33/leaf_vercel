import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, writeBatch } from "firebase/firestore";
import fs from "fs";
import path from "path";

async function runMigration() {
  console.log("=== STARTING FIRESTORE MIGRATION ===");
  
  // 1. Load Firebase Configuration
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("firebase-applet-config.json not found!");
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  
  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  };

  console.log("Connecting to Firestore database:", config.firestoreDatabaseId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, config.firestoreDatabaseId);

  // 2. Check if migration has already run
  const lockRef = doc(db, "settings", "migrationLock");
  try {
    const lockSnap = await getDoc(lockRef);
    if (lockSnap.exists() && lockSnap.data().status === "completed") {
      console.log("Migration has already completed successfully according to migrationLock. Skipping.");
      return;
    }
  } catch (err: any) {
    console.log("No existing migration lock found or readable, continuing migration...", err.message);
  }

  // 3. Read local db.json
  const dbJsonPath = path.join(process.cwd(), "src", "data", "db.json");
  if (!fs.existsSync(dbJsonPath)) {
    console.log("Local db.json not found at:", dbJsonPath);
    console.log("No source data to migrate.");
    return;
  }

  const raw = fs.readFileSync(dbJsonPath, "utf-8");
  const localData = JSON.parse(raw);

  const report: any = {
    startedAt: new Date().toISOString(),
    status: "processing",
    counts: {}
  };

  // 4. Migrate Collections
  // Products
  if (Array.isArray(localData.products)) {
    console.log(`Migrating ${localData.products.length} products...`);
    let count = 0;
    for (const p of localData.products) {
      if (p.id) {
        await setDoc(doc(db, "products", p.id), p);
        count++;
      }
    }
    report.counts.products = count;
    console.log(`Migrated ${count} products.`);
  }

  // Categories
  if (Array.isArray(localData.categories)) {
    console.log(`Migrating ${localData.categories.length} categories...`);
    let count = 0;
    for (const cat of localData.categories) {
      if (typeof cat === "string") {
        const id = cat.replace(/\s+/g, "-").toLowerCase();
        await setDoc(doc(db, "categories", id), { name: cat, image: "" });
        count++;
      } else if (cat && cat.name) {
        const id = cat.id || cat.name.replace(/\s+/g, "-").toLowerCase();
        await setDoc(doc(db, "categories", id), cat);
        count++;
      }
    }
    report.counts.categories = count;
    console.log(`Migrated ${count} categories.`);
  }

  // Orders
  if (Array.isArray(localData.orders)) {
    console.log(`Migrating ${localData.orders.length} orders...`);
    let count = 0;
    for (const o of localData.orders) {
      if (o.id) {
        await setDoc(doc(db, "orders", o.id), o);
        count++;
      }
    }
    report.counts.orders = count;
    console.log(`Migrated ${count} orders.`);
  }

  // Blogs
  if (Array.isArray(localData.blogs)) {
    console.log(`Migrating ${localData.blogs.length} blogs...`);
    let count = 0;
    for (const b of localData.blogs) {
      if (b.id) {
        await setDoc(doc(db, "blogs", b.id), b);
        count++;
      }
    }
    report.counts.blogs = count;
    console.log(`Migrated ${count} blogs.`);
  }

  // Coupons
  if (Array.isArray(localData.coupons)) {
    console.log(`Migrating ${localData.coupons.length} coupons...`);
    let count = 0;
    for (const c of localData.coupons) {
      const id = c.code || c.id;
      if (id) {
        await setDoc(doc(db, "coupons", id), c);
        count++;
      }
    }
    report.counts.coupons = count;
    console.log(`Migrated ${count} coupons.`);
  }

  // Settings singletons
  const singletons = ["banners", "legal", "paymentSettings", "seoSettings", "websiteContent", "cloudinarySettings"];
  for (const key of singletons) {
    if (localData[key] && typeof localData[key] === "object") {
      console.log(`Migrating singleton settings/${key}...`);
      await setDoc(doc(db, "settings", key), localData[key]);
      report.counts[key] = 1;
    }
  }

  // 5. Save Migration Lock & Report
  report.status = "completed";
  report.completedAt = new Date().toISOString();
  console.log("Writing migration lock and report to settings/migrationLock...");
  await setDoc(lockRef, report);

  console.log("=== MIGRATION COMPLETED SUCCESSFULLY ===");
  console.log("Report details:", JSON.stringify(report, null, 2));

  // 6. Safely deactivate local db.json
  const backupPath = path.join(process.cwd(), "src", "data", "db.json.bak");
  try {
    if (fs.existsSync(dbJsonPath)) {
      console.log(`Backing up db.json to ${backupPath}...`);
      fs.copyFileSync(dbJsonPath, backupPath);
      console.log(`Removing db.json to disable local storage permanently...`);
      fs.unlinkSync(dbJsonPath);
    }
  } catch (err: any) {
    console.error("Failed to deactivate db.json:", err.message);
  }
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
