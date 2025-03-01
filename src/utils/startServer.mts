import { app } from "../server.mjs";
import { Port } from "../models/types.mjs";

export default function startServer(port: Port) {
  app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
}
