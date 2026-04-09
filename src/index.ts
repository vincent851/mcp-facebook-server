#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { FacebookClient } from "./facebook-client.js";

export function createServer(fb: FacebookClient): McpServer {
  const server = new McpServer({
    name: "facebook",
    version: "1.0.0",
  });

  registerTools(server, fb);
  return server;
}

function registerTools(server: McpServer, fb: FacebookClient): void {

server.tool(
  "get_profile",
  "Get the authenticated user's Facebook profile information",
  {
    fields: z
      .string()
      .optional()
      .describe(
        "Comma-separated list of fields (default: id,name,email)"
      ),
  },
  async ({ fields }) => {
    const result = await fb.getMe(fields);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_pages",
  "Get Facebook Pages managed by the authenticated user",
  {},
  async () => {
    const result = await fb.getPages();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_page_details",
  "Get detailed information about a specific Facebook Page",
  {
    page_id: z.string().describe("The Facebook Page ID"),
    fields: z
      .string()
      .optional()
      .describe(
        "Comma-separated list of fields (default: id,name,about,category,fan_count,website,phone,emails,location)"
      ),
  },
  async ({ page_id, fields }) => {
    const result = await fb.getPageDetails(page_id, fields);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_posts",
  "Get posts from the user's timeline or a specific Page",
  {
    page_id: z
      .string()
      .optional()
      .describe("Page ID to get posts from (omit for user's own posts)"),
    limit: z
      .string()
      .optional()
      .describe("Maximum number of posts to return (default: 10)"),
  },
  async ({ page_id, limit }) => {
    const result = page_id
      ? await fb.getPagePosts(page_id, limit)
      : await fb.getUserPosts(limit);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "create_post",
  "Create a new post on the user's timeline or a Page",
  {
    message: z.string().describe("The post content/message"),
    target_id: z
      .string()
      .optional()
      .describe("Page ID to post to (omit for user's own timeline)"),
    link: z.string().optional().describe("URL to attach to the post"),
  },
  async ({ message, target_id, link }) => {
    const result = await fb.createPost(message, target_id, link);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "delete_post",
  "Delete a specific post",
  {
    post_id: z.string().describe("The ID of the post to delete"),
  },
  async ({ post_id }) => {
    const result = await fb.deletePost(post_id);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_comments",
  "Get comments on a post or other object",
  {
    object_id: z
      .string()
      .describe("The ID of the post or object to get comments for"),
    limit: z
      .string()
      .optional()
      .describe("Maximum number of comments to return (default: 25)"),
  },
  async ({ object_id, limit }) => {
    const result = await fb.getComments(object_id, limit);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "create_comment",
  "Add a comment to a post or other object",
  {
    object_id: z
      .string()
      .describe("The ID of the post or object to comment on"),
    message: z.string().describe("The comment text"),
  },
  async ({ object_id, message }) => {
    const result = await fb.createComment(object_id, message);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_likes",
  "Get likes on a post or other object",
  {
    object_id: z
      .string()
      .describe("The ID of the post or object to get likes for"),
    limit: z
      .string()
      .optional()
      .describe("Maximum number of likes to return (default: 25)"),
  },
  async ({ object_id, limit }) => {
    const result = await fb.getLikes(object_id, limit);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "like_object",
  "Like a post, comment, or other object",
  {
    object_id: z.string().describe("The ID of the object to like"),
  },
  async ({ object_id }) => {
    const result = await fb.createLike(object_id);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "unlike_object",
  "Remove a like from a post, comment, or other object",
  {
    object_id: z.string().describe("The ID of the object to unlike"),
  },
  async ({ object_id }) => {
    const result = await fb.deleteLike(object_id);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_photos",
  "Get photos uploaded by the user or a Page",
  {
    target_id: z
      .string()
      .optional()
      .describe("Page ID to get photos from (omit for user's own photos)"),
    limit: z
      .string()
      .optional()
      .describe("Maximum number of photos to return (default: 10)"),
  },
  async ({ target_id, limit }) => {
    const result = await fb.getPhotos(target_id, limit);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_page_insights",
  "Get analytics/insights for a Facebook Page (requires Page access token)",
  {
    page_id: z.string().describe("The Facebook Page ID"),
    metric: z
      .string()
      .optional()
      .describe(
        "Comma-separated metrics (default: page_impressions,page_engaged_users,page_fan_adds)"
      ),
    period: z
      .string()
      .optional()
      .describe("Aggregation period: day, week, days_28 (default: day)"),
  },
  async ({ page_id, metric, period }) => {
    const result = await fb.getPageInsights(page_id, metric, period);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── Marketplace / Commerce ──────────────────────────────────────────

server.tool(
  "get_marketplace_listings",
  "Get commerce/marketplace listings for a Facebook Page",
  {
    page_id: z.string().describe("The Facebook Page ID"),
    limit: z
      .string()
      .optional()
      .describe("Maximum number of listings to return (default: 10)"),
    fields: z
      .string()
      .optional()
      .describe(
        "Comma-separated list of fields (default: id,name,description,price,currency,condition,availability,image_url)"
      ),
  },
  async ({ page_id, limit, fields }) => {
    const result = await fb.getMarketplaceListings(
      page_id,
      limit ?? undefined,
      fields ?? undefined
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_listing_details",
  "Get detailed information about a specific marketplace listing",
  {
    listing_id: z.string().describe("The listing ID"),
    fields: z
      .string()
      .optional()
      .describe(
        "Comma-separated list of fields (default: id,name,description,price,currency,condition,availability,image_url,retailer_id,category)"
      ),
  },
  async ({ listing_id, fields }) => {
    const result = await fb.getListingDetails(listing_id, fields ?? undefined);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "create_marketplace_listing",
  "Create a new marketplace/commerce listing on a Facebook Page",
  {
    page_id: z.string().describe("The Facebook Page ID to list on"),
    name: z.string().describe("Product/listing name"),
    description: z.string().describe("Product/listing description"),
    price: z.number().describe("Price of the item"),
    currency: z
      .string()
      .optional()
      .describe("Currency code, e.g. USD (default: USD)"),
    condition: z
      .string()
      .optional()
      .describe("Item condition: new, used_like_new, used_good, used_fair"),
    availability: z
      .string()
      .optional()
      .describe("Availability status: in stock, out of stock"),
    image_url: z.string().optional().describe("URL of the product image"),
    category: z.string().optional().describe("Product category"),
  },
  async ({ page_id, name, description, price, currency, condition, availability, image_url, category }) => {
    const data: Record<string, unknown> = {
      name,
      description,
      price,
      currency: currency ?? "USD",
    };
    if (condition) data.condition = condition;
    if (availability) data.availability = availability;
    if (image_url) data.image_url = image_url;
    if (category) data.category = category;

    const result = await fb.createMarketplaceListing(
      page_id,
      data as Parameters<typeof fb.createMarketplaceListing>[1]
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "update_marketplace_listing",
  "Update an existing marketplace/commerce listing",
  {
    listing_id: z.string().describe("The listing ID to update"),
    name: z.string().optional().describe("Updated product name"),
    description: z.string().optional().describe("Updated description"),
    price: z.number().optional().describe("Updated price"),
    currency: z.string().optional().describe("Updated currency code"),
    condition: z.string().optional().describe("Updated condition"),
    availability: z.string().optional().describe("Updated availability"),
    image_url: z.string().optional().describe("Updated image URL"),
  },
  async ({ listing_id, ...updates }) => {
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) data[key] = value;
    }
    const result = await fb.updateMarketplaceListing(listing_id, data);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "delete_marketplace_listing",
  "Delete a marketplace/commerce listing",
  {
    listing_id: z.string().describe("The listing ID to delete"),
  },
  async ({ listing_id }) => {
    const result = await fb.deleteMarketplaceListing(listing_id);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

} // end registerTools

// ── Start ───────────────────────────────────────────────────────────────

async function main() {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) {
    console.error(
      "Error: FACEBOOK_ACCESS_TOKEN environment variable is required.\n" +
        "Get a token from https://developers.facebook.com/tools/explorer/"
    );
    process.exit(1);
  }

  const fb = new FacebookClient({ accessToken });
  const server = createServer(fb);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Facebook MCP server running on stdio");
}

const isMainModule =
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
