import express from "express";
import cors from "cors";

import itemRoutes from "./routes/item-routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// set up middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// set up api routes
app.use("/api/items", itemRoutes);

// set up global error handler (this should be the last middleware in the app stack)
app.use(errorHandler);

export default app;
