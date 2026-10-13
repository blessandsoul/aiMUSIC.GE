"use client";

// WebMCP provider (webmachinelearning.github.io/webmcp). Feature-detected: where the browser
// exposes `navigator.modelContext`, aiMUSIC exposes a product-specific service search and the
// existing guarded callback tool an in-page agent can call.
// Both hit same-origin endpoints only (CSP connect-src 'self'). Renders nothing; on a browser
// without WebMCP it is a no-op. The search copy follows aiMUSIC's public product facts.

import { useEffect } from "react";
import { isLandingCloneClientPreview } from "@/lib/landing-clone-preview";

interface WebMcpToolResult {
  content: Array<{ type: "text"; text: string }>;
}

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<WebMcpToolResult>;
}

interface ModelContext {
  provideContext?: (context: { tools: WebMcpTool[] }) => void;
  registerTool?: (tool: WebMcpTool) => void;
}

const text = (value: string): WebMcpToolResult => ({ content: [{ type: "text", text: value }] });

interface ServiceEntry {
  id: string;
  name: string;
  url: string;
  summary?: string;
  deliverables?: string[];
}

const TOOLS: WebMcpTool[] = [
  {
    name: "search_services",
    description:
      "Search aiMUSIC's public service feed for venue music profiles, daily playlists, and documented usage packages within an agreed scope. Returns matching services with a summary and a link.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, e.g. 'venue', 'music', 'rights'. Empty returns all." },
      },
    },
    async execute(args): Promise<WebMcpToolResult> {
      const query = typeof args.query === "string" ? args.query.toLowerCase().trim() : "";
      const res = await fetch("/ai/service.json", { headers: { accept: "application/json" } });
      if (!res.ok) return text("Could not load the aiMUSIC service feed right now.");
      const data = (await res.json()) as { services?: ServiceEntry[] };
      const all = data.services ?? [];
      const matches = query
        ? all.filter((s) =>
            `${s.name} ${s.summary ?? ""} ${(s.deliverables ?? []).join(" ")}`.toLowerCase().includes(query),
          )
        : all;
      const out = matches.map((s) => ({ name: s.name, url: s.url, summary: s.summary ?? "" }));
      return text(JSON.stringify(out.length ? out : { message: "No matching aiMUSIC service. See https://aimusic.ge" }));
    },
  },
  {
    name: "request_quote",
    description:
      "Submit a lead to aiMUSIC to discuss a venue music profile, playlist, and documented usage package within an agreed scope. Usage conditions and any licensing terms are agreed in writing. Only a phone number is required.",
    inputSchema: {
      type: "object",
      required: ["phone"],
      properties: {
        phone: { type: "string", description: "Contact phone number (required)" },
        name: { type: "string" },
        projectType: { type: "string", enum: ["website", "ai", "automation", "creative", "other"] },
        message: { type: "string", description: "What you need" },
      },
    },
    async execute(args): Promise<WebMcpToolResult> {
      if (isLandingCloneClientPreview()) return text("Callback requests are disabled in this preview.");
      // Owner-reference guard: this browser-agent surface cannot complete the
      // visible Turnstile challenge, so it must never call the production contact
      // endpoint or claim a lead was accepted. The visible form remains the only
      // live submission path.
      return text("Browser-agent requests are not a live submission path. Please use the visible aiMUSIC contact form so the security check can be completed.");
    },
  },
];

export function WebMcpProvider(): null {
  useEffect(() => {
    const nav = navigator as Navigator & { modelContext?: ModelContext };
    const mc = nav.modelContext;
    if (!mc) return;
    const tools = isLandingCloneClientPreview()
      ? TOOLS.filter((tool) => tool.name === "search_services")
      : TOOLS;
    try {
      if (typeof mc.provideContext === "function") {
        mc.provideContext({ tools });
      } else if (typeof mc.registerTool === "function") {
        for (const tool of tools) mc.registerTool(tool);
      }
    } catch {
      // WebMCP is an emerging API; never let registration break the page.
    }
  }, []);

  return null;
}
