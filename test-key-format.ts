const key = process.env.FIREBASE_PRIVATE_KEY || "";
console.log("Length of key:", key.length);
console.log("Starts with:", JSON.stringify(key.substring(0, 30)));
console.log("Ends with:", JSON.stringify(key.substring(key.length - 30)));
console.log("Contains \\\\n (double backslash):", key.includes("\\n"));
console.log("Contains \\n (literal newline):", key.includes("\n"));
