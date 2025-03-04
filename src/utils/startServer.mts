import { app } from "../server.mjs";
import { Port } from "../types.mjs";

export default function startServer(port: Port): void {
  app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
}
