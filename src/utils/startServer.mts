import { app } from "../server.mjs";

type Port = string | number;
const fallbackPort = "3000";
export default function startServer(port: Port): void {
  app.listen(port || fallbackPort, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
}
