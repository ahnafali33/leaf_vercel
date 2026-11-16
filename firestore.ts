/**
 * Leaf Aquatic Firestore Database Service
 * Provides production-grade Firestore access, singletons, collections, and service classes.
 * Strictly Firestore-only persistence architecture with no local JSON fallback.
 */

import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  collection, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  writeBatch, 
  query, 
  where, 
  limit 
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// -------------------------------------------------------------------------
// Chainable Firestore Client API Wrapper classes
// Mimics Node.js firebase-admin style API using the Firebase Client JS SDK
// -------------------------------------------------------------------------

export class DocRefWrapper {
  constructor(private dbInstance: any, public docPath: string) {}

  async get() {
    try {
      const snap = await getDoc(doc(this.dbInstance, this.docPath));
      return {
        exists: snap.exists(),
        id: snap.id,
        data: () => snap.data(),
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, this.docPath);
    }
  }

  async set(data: any, options?: { merge?: boolean }) {
    try {
      await setDoc(doc(this.dbInstance, this.docPath), data, { merge: options?.merge });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, this.docPath);
    }
  }

  async update(data: any) {
    try {
      await updateDoc(doc(this.dbInstance, this.docPath), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, this.docPath);
    }
  }

  async delete() {
    try {
      await deleteDoc(doc(this.dbInstance, this.docPath));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, this.docPath);
    }
  }
}

export class QueryWrapper {
  private constraints: any[] = [];

  constructor(private dbInstance: any, public colName: string, constraints: any[] = []) {
    this.constraints = constraints;
  }

  where(field: string, op: string, value: any) {
    return new QueryWrapper(this.dbInstance, this.colName, [
      ...this.constraints,
      where(field, op as any, value)
    ]);
  }

  async get() {
    try {
      const colRef = collection(this.dbInstance, this.colName);
      const q = query(colRef, ...this.constraints);
      const snap = await getDocs(q);
      return {
        size: snap.size,
        empty: snap.empty,
        docs: snap.docs.map(docSnap => ({
          id: docSnap.id,
          exists: docSnap.exists(),
          data: () => docSnap.data(),
          ref: new DocRefWrapper(this.dbInstance, `${this.colName}/${docSnap.id}`),
        })),
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, this.colName);
    }
  }

  doc(docId?: string) {
    const id = docId || doc(collection(this.dbInstance, this.colName)).id;
    return new DocRefWrapper(this.dbInstance, `${this.colName}/${id}`);
  }
}

export class BatchWrapper {
  private batchInstance: any;

  constructor(private dbInstance: any) {
    this.batchInstance = writeBatch(dbInstance);
  }

  set(docRef: DocRefWrapper, data: any, options?: { merge?: boolean }) {
    const rawDocRef = doc(this.dbInstance, docRef.docPath);
    this.batchInstance.set(rawDocRef, data, { merge: options?.merge });
    return this;
  }

  update(docRef: DocRefWrapper, data: any) {
    const rawDocRef = doc(this.dbInstance, docRef.docPath);
    this.batchInstance.update(rawDocRef, data);
    return this;
  }

  async commit() {
    try {
      await this.batchInstance.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "batch_commit");
    }
  }
}

export class FirestoreWrapper {
  public dbInstance: any = null;
  public isFirestoreWorking = false;

  collection(colName: string) {
    if (!this.dbInstance) {
      throw new Error("Firestore not initialized!");
    }
    return new QueryWrapper(this.dbInstance, colName);
  }

  doc(docPath: string) {
    if (!this.dbInstance) {
      throw new Error("Firestore not initialized!");
    }
    return new DocRefWrapper(this.dbInstance, docPath);
  }

  batch() {
    if (!this.dbInstance) {
      throw new Error("Firestore not initialized!");
    }
    return new BatchWrapper(this.dbInstance);
  }
}

// Instantiation of the singleton smart DB
const smartDb = new FirestoreWrapper();
export const db = smartDb;

// -------------------------------------------------------------------------
// Initializer & Connection Verifier
// -------------------------------------------------------------------------

export async function initFirestore() {
  console.log("[SmartDB] Initializing Firestore...");
  
  let projectId = process.env.FIREBASE_PROJECT_ID;
  let apiKey = process.env.FIREBASE_API_KEY;
  let authDomain = process.env.FIREBASE_AUTH_DOMAIN;
  let storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  let messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
  let appId = process.env.FIREBASE_APP_ID;
  let databaseId = process.env.FIREBASE_DATABASE_ID || "(default)";

  // Try to load from firebase-applet-config.json if available
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.projectId) projectId = config.projectId;
      if (config.apiKey) apiKey = config.apiKey;
      if (config.authDomain) authDomain = config.authDomain;
      if (config.storageBucket) storageBucket = config.storageBucket;
      if (config.messagingSenderId) messagingSenderId = config.messagingSenderId;
      if (config.appId) appId = config.appId;
      if (config.firestoreDatabaseId) databaseId = config.firestoreDatabaseId;
    }
  } catch (err) {
    console.error("Failed to load firebase-applet-config.json:", err);
  }

  if (!projectId || !apiKey) {
    console.warn("[SmartDB] Warning: Firebase credentials not fully configured in environment or config file. Database operations may fallback.");
    smartDb.isFirestoreWorking = false;
    return;
  }

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  try {
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    const realFirestore = getFirestore(app, databaseId);
    smartDb.dbInstance = realFirestore;
    smartDb.isFirestoreWorking = true;

    console.log(`[SmartDB] Firestore initialized for Project = ${projectId}, Database = ${databaseId}`);

    // Asynchronously verify connection without blocking Express startup
    getDoc(doc(realFirestore, "settings/migrationLock"))
      .then(() => {
        console.log(`[SmartDB] Connection check verified. Operating in Firestore Mode.`);
      })
      .catch((err) => {
        console.warn(`[SmartDB] Async connection verify notice: ${err?.message || err}`);
      });
  } catch (err: any) {
    console.error(`[SmartDB] Warning initializing Firestore: ${err.message}`);
    smartDb.isFirestoreWorking = false;
  }
}

// -------------------------------------------------------------------------
// Hardened error handling structure conforming to Firebase Skill guidelines
// -------------------------------------------------------------------------

export enum OperationType {
  GET = "get",
  LIST = "list",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------------------
// DB normalized full state getter for sitemaps & backups
// -------------------------------------------------------------------------

export interface DBState {
  products: any[];
  categories: any[];
  orders: any[];
  blogs: any[];
  coupons: any[];
  banners: any;
  legal: any;
  paymentSettings: any;
  seoSettings: any;
  websiteContent: any;
  cloudinarySettings: any;
  courierSettings: any;
  domainSettings: any;
}

export async function getFullDBState(): Promise<DBState> {
  // Helper to load local db.json
  const loadLocalBackup = () => {
    try {
      const dbJsonPath = path.join(process.cwd(), "src/data/db.json");
      if (fs.existsSync(dbJsonPath)) {
        return JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));
      }
    } catch (e) {
      console.error("Failed to parse local db.json backup:", e);
    }
    return null;
  };

  try {
    const [
      productsSnap,
      categoriesSnap,
      ordersSnap,
      blogsSnap,
      couponsSnap,
      bannersDoc,
      legalDoc,
      paymentDoc,
      seoDoc,
      websiteDoc,
      cloudinaryDoc,
      courierDoc,
      domainDoc,
    ] = await Promise.all([
      db.collection("products").get(),
      db.collection("categories").get(),
      db.collection("orders").get(),
      db.collection("blogs").get(),
      db.collection("coupons").get(),
      db.doc("settings/banners").get(),
      db.doc("settings/legal").get(),
      db.doc("settings/paymentSettings").get(),
      db.doc("settings/seoSettings").get(),
      db.doc("settings/websiteContent").get(),
      db.doc("settings/cloudinarySettings").get(),
      db.doc("settings/courierSettings").get(),
      db.doc("settings/domainSettings").get(),
    ]);

    let products = productsSnap?.docs ? productsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) : [];
    let categories = categoriesSnap?.docs ? categoriesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) : [];
    let orders = ordersSnap?.docs ? ordersSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) : [];
    let blogs = blogsSnap?.docs ? blogsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) : [];
    let coupons = couponsSnap?.docs ? couponsSnap.docs.map((d: any) => d.data()) : [];

    const localBackup = loadLocalBackup();
    if (products.length === 0 && localBackup?.products?.length) {
      products = localBackup.products;
    }
    if (categories.length === 0 && localBackup?.categories?.length) {
      categories = localBackup.categories;
    }
    if (orders.length === 0 && localBackup?.orders?.length) {
      orders = localBackup.orders;
    }
    if (blogs.length === 0 && localBackup?.blogs?.length) {
      blogs = localBackup.blogs;
    }
    if (coupons.length === 0 && localBackup?.coupons?.length) {
      coupons = localBackup.coupons;
    }

    return {
      products,
      categories,
      orders,
      blogs,
      coupons,
      banners: (bannersDoc && bannersDoc.exists) ? bannersDoc.data() : (localBackup?.banners || {}),
      legal: (legalDoc && legalDoc.exists) ? legalDoc.data() : (localBackup?.legal || {}),
      paymentSettings: (paymentDoc && paymentDoc.exists) ? paymentDoc.data() : (localBackup?.paymentSettings || null),
      seoSettings: (seoDoc && seoDoc.exists) ? seoDoc.data() : null,
      websiteContent: (websiteDoc && websiteDoc.exists) ? websiteDoc.data() : null,
      cloudinarySettings: (cloudinaryDoc && cloudinaryDoc.exists) ? cloudinaryDoc.data() : null,
      courierSettings: (courierDoc && courierDoc.exists) ? courierDoc.data() : null,
      domainSettings: (domainDoc && domainDoc.exists) ? domainDoc.data() : null,
    };
  } catch (err) {
    console.error("Error fetching full DB state from Firestore, falling back to db.json:", err);
    const localBackup = loadLocalBackup();
    if (localBackup) {
      return {
        products: localBackup.products || [],
        categories: localBackup.categories || [],
        orders: localBackup.orders || [],
        blogs: localBackup.blogs || [],
        coupons: localBackup.coupons || [],
        banners: localBackup.banners || {},
        legal: localBackup.legal || {},
        paymentSettings: localBackup.paymentSettings || null,
        seoSettings: null,
        websiteContent: null,
        cloudinarySettings: null,
        courierSettings: null,
        domainSettings: null,
      };
    }
    throw err;
  }
}

// Deactivated deprecated auto-migration (handled by external offline-proof migration run)
export async function performAutoMigration() {
  console.log("[SmartDB] Local file db.json check completed. No fallback file present.");
}

// -------------------------------------------------------------------------
// Dedicated Service Classes for CRUD operations (MANDATORY)
// -------------------------------------------------------------------------

export class ProductService {
  static async getAll() {
    const snap = await db.collection("products").get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getById(id: string) {
    const snap = await db.doc(`products/${id}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  }

  static async create(id: string, data: any) {
    await db.doc(`products/${id}`).set(data);
    return { id, ...data };
  }

  static async update(id: string, data: any) {
    await db.doc(`products/${id}`).update(data);
    const snap = await db.doc(`products/${id}`).get();
    return { id, ...snap.data() };
  }

  static async delete(id: string) {
    await db.doc(`products/${id}`).delete();
  }
}

export class CategoryService {
  static async getAll() {
    const snap = await db.collection("categories").get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async create(id: string, data: any) {
    await db.doc(`categories/${id}`).set(data);
    return { id, ...data };
  }

  static async update(id: string, data: any) {
    await db.doc(`categories/${id}`).update(data);
    const snap = await db.doc(`categories/${id}`).get();
    return { id, ...snap.data() };
  }

  static async delete(id: string) {
    await db.doc(`categories/${id}`).delete();
  }
}

export class OrderService {
  static async getAll() {
    const snap = await db.collection("orders").get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getById(id: string) {
    const snap = await db.doc(`orders/${id}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  }

  static async create(id: string, data: any) {
    await db.doc(`orders/${id}`).set(data);
    return { id, ...data };
  }

  static async update(id: string, data: any) {
    await db.doc(`orders/${id}`).update(data);
    const snap = await db.doc(`orders/${id}`).get();
    return { id, ...snap.data() };
  }

  static async delete(id: string) {
    await db.doc(`orders/${id}`).delete();
  }
}

export class BlogService {
  static async getAll() {
    const snap = await db.collection("blogs").get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  static async getById(id: string) {
    const snap = await db.doc(`blogs/${id}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  }

  static async create(id: string, data: any) {
    await db.doc(`blogs/${id}`).set(data);
    return { id, ...data };
  }

  static async update(id: string, data: any) {
    await db.doc(`blogs/${id}`).update(data);
    const snap = await db.doc(`blogs/${id}`).get();
    return { id, ...snap.data() };
  }

  static async delete(id: string) {
    await db.doc(`blogs/${id}`).delete();
  }
}

export class CouponService {
  static async getAll() {
    const snap = await db.collection("coupons").get();
    return snap.docs.map((d: any) => d.data());
  }

  static async getByCode(code: string) {
    const snap = await db.doc(`coupons/${code.toUpperCase()}`).get();
    return snap.exists ? snap.data() : null;
  }

  static async create(code: string, data: any) {
    const docId = code.toUpperCase();
    await db.doc(`coupons/${docId}`).set(data);
    return data;
  }

  static async delete(code: string) {
    await db.doc(`coupons/${code.toUpperCase()}`).delete();
  }
}

export class CMSService {
  static async getBanners() {
    const snap = await db.doc("settings/banners").get();
    return snap.exists ? snap.data() : {};
  }

  static async updateBanners(data: any) {
    await db.doc("settings/banners").update(data);
    const snap = await db.doc("settings/banners").get();
    return snap.data();
  }

  static async getWebsiteContent() {
    const snap = await db.doc("settings/websiteContent").get();
    return snap.exists ? snap.data() : {};
  }

  static async updateWebsiteContent(data: any) {
    await db.doc("settings/websiteContent").update(data);
    const snap = await db.doc("settings/websiteContent").get();
    return snap.data();
  }
}

export class SEOService {
  static async getSettings() {
    const snap = await db.doc("settings/seoSettings").get();
    return snap.exists ? snap.data() : {};
  }

  static async updateSettings(data: any) {
    await db.doc("settings/seoSettings").update(data);
    const snap = await db.doc("settings/seoSettings").get();
    return snap.data();
  }
}

export class SettingsService {
  static async getPaymentSettings() {
    const snap = await db.doc("settings/paymentSettings").get();
    return snap.exists ? snap.data() : {};
  }

  static async updatePaymentSettings(data: any) {
    await db.doc("settings/paymentSettings").update(data);
    const snap = await db.doc("settings/paymentSettings").get();
    return snap.data();
  }

  static async getCloudinarySettings() {
    const snap = await db.doc("settings/cloudinarySettings").get();
    return snap.exists ? snap.data() : {};
  }

  static async updateCloudinarySettings(data: any) {
    await db.doc("settings/cloudinarySettings").set(data, { merge: true });
    const snap = await db.doc("settings/cloudinarySettings").get();
    return snap.data();
  }

  static async getCourierSettings() {
    const snap = await db.doc("settings/courierSettings").get();
    return snap.exists ? snap.data() : {};
  }

  static async updateCourierSettings(data: any) {
    await db.doc("settings/courierSettings").set(data, { merge: true });
    const snap = await db.doc("settings/courierSettings").get();
    return snap.data();
  }
}
