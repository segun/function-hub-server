import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const functionHubBaseUrl = "http://localhost:3001/api/fn";

export const transports = new Map<string, SSEServerTransport>();

export const addGetResponseTool = (server: McpServer) => {
  server.tool(
    "getResponse",
    "Gets response from function hub for the specified prompt",
    { prompt: z.string() },
    async ({ prompt }) => {
      // get response from functionhub
      const getResponseResponse = await fetch(
        `${functionHubBaseUrl}/get-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "sk_test_7xQ2pL9RgT4zYvW1aB3nC6mZ8dF5jH0kX",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!getResponseResponse.ok) {
        return {
          content: [{ type: "text", text: "Error in getting response" }],
        };
      }

      const data = await getResponseResponse.json();

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
};

export const addGetRawResponseTool = (server: McpServer) => {
  server.tool(
    "getRawResponse",
    "Gets raw response from function hub for the specified prompt",
    { prompt: z.string() },
    async ({ prompt }) => {
      // get response from functionhub
      const getResponseResponse = await fetch(
        `${functionHubBaseUrl}/get-raw-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "sk_test_7xQ2pL9RgT4zYvW1aB3nC6mZ8dF5jH0kX",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!getResponseResponse.ok) {
        return {
          content: [{ type: "text", text: "Error in getting response" }],
        };
      }

      const data = await getResponseResponse.json();

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
};

export const addGetServersTool = (server: McpServer) => {
  server.tool(
    "getServers",
    "Gets a list of mcp servers that can be used to satisfy the prompt or that matches the keywords",
    {
      promptOrKeyword: z.string({
        description: "The prompt or keywords to search for",
      }),
    },
    async ({ promptOrKeyword }) => {
      // get response from functionhub
      const getResponseResponse = await fetch(
        `${functionHubBaseUrl}/get-functions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "sk_test_7xQ2pL9RgT4zYvW1aB3nC6mZ8dF5jH0kX",
          },
          body: JSON.stringify({ prompt: promptOrKeyword }),
        }
      );

      if (!getResponseResponse.ok) {
        return {
          content: [{ type: "text", text: "Error in getting response" }],
        };
      }

      const data = await getResponseResponse.json();

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
};

export const addSelectServerTool = (server: McpServer) => {
  server.tool(
    "selectServer",
    "Given a prompt or keywords and a list of servers, select and return the most appropriate server",
    {
      promptOrKeyword: z.string({
        description: "The prompt or keywrods to search for",
      }),
      servers: z.array(z.any()),
    },
    async ({ promptOrKeyword, servers }) => {
      // get response from functionhub
      const getResponseResponse = await fetch(
        `${functionHubBaseUrl}/select-function`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "sk_test_7xQ2pL9RgT4zYvW1aB3nC6mZ8dF5jH0kX",
          },
          body: JSON.stringify({ prompt: promptOrKeyword, functions: servers }),
        }
      );

      if (!getResponseResponse.ok) {
        return {
          content: [{ type: "text", text: "Error in getting response" }],
        };
      }

      const data = await getResponseResponse.json();

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
};
