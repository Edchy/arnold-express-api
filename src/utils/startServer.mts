import { app } from "../server.mjs";

type Port = number | string;

export default function startServer(port: Port): void {
  app.listen(port, () => {
    console.log(`Express server running at port: ${port}`);
  });
}
