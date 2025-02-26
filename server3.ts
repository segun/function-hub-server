import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const transports = new Map<string, SSEServerTransport>();
const server = new McpServer(
  {
    name: "hello-world-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

server.tool(
  "add2Number",
  "add 2 numbers a and b",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => {
    // get response from functionhub
    const data = a + b;
    return { content: [{ type: "text", text: String(data) }] };
  }
);

const app = express();

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  const clientId = transport.sessionId;
  console.log("New client connected", { clientId });
  transports.set(clientId, transport);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  console.log("Messages Called");

  const clientId = req.query.sessionId as string;
  console.log("Messages Called with clientId", { clientId });
  const transport = transports.get(clientId);
  if (!transport) {
    console.error("No transport found for clientId", clientId);
    return;
  }
  await transport.handlePostMessage(req, res);
});

console.log("Server 1 listening on port 3002");
app.listen(3002);
