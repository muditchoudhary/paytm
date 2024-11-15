import express, { Request, Response } from "express";
import cors from "cors";

import rootRouter from "./routes";

const app = express();
console.log("port is:", process.env.PORT);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello TypeScript Backend!",
  });
});

app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});