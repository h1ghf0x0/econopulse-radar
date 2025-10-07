import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getByCountry = query({
  args: { country_id: v.id("countries") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("indicators")
      .withIndex("by_country", (q) => q.eq("country_id", args.country_id))
      .collect();
  },
});

export const getLatestByCountryAndName = query({
  args: {
    country_id: v.id("countries"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const indicators = await ctx.db
      .query("indicators")
      .withIndex("by_country_and_name", (q) =>
        q.eq("country_id", args.country_id).eq("name", args.name)
      )
      .order("desc")
      .take(1);
    
    return indicators[0] || null;
  },
});

export const getHistoricalData = query({
  args: {
    country_id: v.id("countries"),
    name: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db
      .query("indicators")
      .withIndex("by_country_and_name", (q) =>
        q.eq("country_id", args.country_id).eq("name", args.name)
      )
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    country_id: v.id("countries"),
    name: v.string(),
    value: v.number(),
    source: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("indicators", args);
  },
});
