const { z } = require("zod");

const functionHubBaseUrl = "https://fh-master.onrender.com/api/fn";

const transports = new Map();

const addGetResponseTool = (server) => {
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

const addGetRawResponseTool = (server) => {
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

const addGetServersTool = (server) => {
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

const addSelectServerTool = (server) => {
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

module.exports = {
  transports,
  addGetResponseTool,
  addGetRawResponseTool,
  addGetServersTool,
  addSelectServerTool,
};