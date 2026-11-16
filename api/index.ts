import type { Request, Response } from "express";
import { getServerlessApp } from "../server.js";

export default async function handler(req: Request, res: Response) {
  const app = await getServerlessApp();
  return app(req, res);
}
