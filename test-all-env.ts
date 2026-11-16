for (const key of Object.keys(process.env)) {
  console.log(`${key}: ${key.includes("KEY") || key.includes("SECRET") || key.includes("PASSWORD") ? "[REDACTED]" : process.env[key]}`);
}
