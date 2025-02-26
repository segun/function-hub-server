import { FastMCP } from "fastmcp";
import { z } from "zod";

const functionHubBaseUrl = "http://localhost:3001/api/fn";

const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});

server.addTool({
  name: "getRawResponse",
  description: "Gets raw response from function hub",
  parameters: z.object({
    prompt: z.string(),
  }),

  execute: async ({ prompt }) => {
    const url = `${functionHubBaseUrl}/get-raw-response`;
    console.log("Get Response called with prompt:", {
      prompt,
      url,
    });

    const getResponseResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk_test_7xQ2pL9RgT4zYvW1aB3nC6mZ8dF5jH0kX",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.json();

    console.log("Get Response data:", JSON.stringify(data, null, 2));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
});

server.addTool({
  name: "getResponse",
  description: "Gets response from function hub",
  parameters: z.object({
    prompt: z.string(),
  }),
  execute: async ({ prompt }) => {
    // get response from functionhub
    const url = `${functionHubBaseUrl}/get-response`;
    console.log("Get Response called with prompt:", {
      prompt,
      url,
    });
    const getResponseResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk_test_7xQ2pL9RgT4zYvW1aB3nC6mZ8dF5jH0kX",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!getResponseResponse.ok) {
      return { content: [{ type: "text", text: "Error in getting response" }] };
    }

    const data = await getResponseResponse.text();

    console.log("Get Response data:", JSON.stringify(data, null, 2));

    return {
      content: [
        {
          type: "text",
          text: String(data),
        },
      ],
    };
  },
});

server
  .start({
    transportType: "sse",
    sse: {
      endpoint: "/sse",
      port: 3002,
    },
  })
  .then(() => {
    console.log("Server started");
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
