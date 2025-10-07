import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByEvent = query({
  args: { event_id: v.id("events") },
  handler: async (ctx, args) => {
    const impacts = await ctx.db
      .query("event_impacts")
      .withIndex("by_event", (q) => q.eq("event_id", args.event_id))
      .collect();
    
    // Enrich with country data
    const enriched = await Promise.all(
      impacts.map(async (impact) => {
        const country = await ctx.db.get(impact.country_id);
        return {
          ...impact,
          country,
        };
      })
    );
    
    return enriched;
  },
});

export const create = mutation({
  args: {
    event_id: v.id("events"),
    country_id: v.id("countries"),
    indicator_name: v.string(),
    pre_value: v.number(),
    post_value: v.number(),
    correlation: v.number(),
    delta_percentage: v.number(),
    delta_summary: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("event_impacts", args);
  },
});
