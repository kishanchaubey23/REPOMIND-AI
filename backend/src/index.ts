import express from "express";
import repoRoutes from "./routes/repo.routes";

const app = express();

app.use(express.json());

app.use("/api/repository", repoRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000") 
});