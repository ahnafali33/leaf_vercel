console.log("Environment variables starting with GOOGLE, FIREBASE, or PORT:");
for (const key of Object.keys(process.env)) {
  if (key.startsWith("GOOGLE") || key.startsWith("FIREBASE") || key.includes("PORT") || key.includes("CREDENTIALS") || key.includes("SERVICE_ACCOUNT")) {
    console.log(`${key}:`, key.includes("KEY") || key.includes("PASSWORD") || key.includes("SECRET") ? "[REDACTED]" : process.env[key]);
  }
}
