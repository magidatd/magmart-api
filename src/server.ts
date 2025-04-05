import app from "./app";
import config from "./config/config";

// todo put logger here

app.listen(config.port, () => {
  console.log(`MagMart server is running on http://localhost:${config.port}`);
});
