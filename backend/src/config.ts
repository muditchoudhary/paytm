export let JWT_SECRET: string;
export let MONGO_DB_URI: string;
try {
  JWT_SECRET = process.env.JWT_SECRET as string;
  MONGO_DB_URI = process.env.MONGO_DB_URI as string;  
  if (!JWT_SECRET || !MONGO_DB_URI) {
    throw new Error("Missing environment variables");
  }
} catch (error) {
  console.error(error);
}
