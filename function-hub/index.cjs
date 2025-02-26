const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const express = require("express");
const { addGetServersTool, addSelectServerTool, transports } = require("./lib/index.cjs");

// Create an MCP server
const server = new McpServer(
  {
    name: "Function Hub MCP Server",
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

addGetServersTool(server);
addSelectServerTool(server);

const app = express();
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  const clientId = transport.sessionId;
  console.log("New client connected", { clientId });
  transports.set(clientId, transport);
  await server.connect(transport);

  req.on("close", () => {
    console.log("Client disconnected", { clientId });
    transports.delete(clientId);
  });
});

app.post("/messages", async (req, res) => {
  console.log("Messages Called");

  const clientId = req.query.sessionId;
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