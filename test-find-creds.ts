import fs from "fs";
import path from "path";

function findCreds(dir: string, depth = 0) {
  if (depth > 4) return;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f === "node_modules" || f === ".git" || f === "dist") continue;
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        findCreds(full, depth + 1);
      } else if (f.endsWith(".json")) {
        try {
          const content = fs.readFileSync(full, "utf-8");
          if (content.includes("private_key") || content.includes("client_email")) {
            console.log("FOUND CREDENTIALS FILE:", full);
          }
        } catch {}
      }
    }
  } catch {}
}

findCreds("/app");
findCreds("/root");
findCreds(".");
