import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return ws.close();
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    return ws.close();
  }
  const decodedToken = jwt.verify(token, JWT_SECRET);

  if (typeof decodedToken === "string") {
    return ws.close();
  }

  if (!decodedToken || !decodedToken.userId) {
    return ws.close();
  }

  ws.on("message", (message) => {
    ws.send("pong");
  });
});
