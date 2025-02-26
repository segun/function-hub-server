import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
const functionHubBaseUrl = "http://localhost:3000/api/fn";

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
  "getResponse",
  "Gets response from function hub",
  { prompt: z.string() },
  async ({ prompt }) => {
    // get response from functionhub
    const getResponseResponse = await fetch(
      `${functionHubBaseUrl}/get-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "getRawResponse",
  "Gets raw response from function hub",
  { prompt: z.string() },
  async ({ prompt }) => {
    // get response from functionhub
    const getResponseResponse = await fetch(
      `${functionHubBaseUrl}/get-raw-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "getFunctions",
  "Gets a list of functions that can be used to satisfy the prompt",
  { prompt: z.string() },
  async ({ prompt }) => {
    // get response from functionhub
    const getResponseResponse = await fetch(
      `${functionHubBaseUrl}/get-functions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "selectFunction",
  "Given a prompt and a list of functions, ask the LLM to select the most appropriate function",
  { prompt: z.string(), functions: z.array(z.any()) },
  async ({ prompt, functions }) => {
    // get response from functionhub
    const getResponseResponse = await fetch(
      `${functionHubBaseUrl}/select-function`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "runFunction",
  "Given a prompt and a function, launch the function in an e2b container (if not already running) and call it.",
  { prompt: z.string(), fun: z.any() },
  async ({ prompt, fun }) => {
    // get response from functionhub
    const getResponseResponse = await fetch(
      `${functionHubBaseUrl}/run-function`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, function: fun }),
      }
    );

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "formatResponse",
  "Given a prompt and a response from runFunction tool, format the response using LLM",
  { prompt: z.string(), response: z.any() },
  async ({ prompt, response }) => {
    // get response from functionhub
    const getResponseResponse = await fetch(
      `${functionHubBaseUrl}/format-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, response }),
      }
    );

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
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
  // Note: to support multiple simultaneous connections, these messages will
  // need to be routed to a specific matching transport. (This logic isn't
  // implemented here, for simplicity.)
  const transport = transports.get(clientId);
  console.dir(transport);
  if (!transport) {
    console.error("No transport found for clientId", clientId);
    return;
  }
  await transport.handlePostMessage(req, res);
});

console.log("Server 1 listening on port 3002");
app.listen(3002);
