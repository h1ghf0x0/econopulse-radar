import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getLatestByCountry = query({
  args: { country_id: v.id("countries") },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query("pulse_scores")
      .withIndex("by_country", (q) => q.eq("country_id", args.country_id))
      .order("desc")
      .take(1);
    
    return scores[0] || null;
  },
});

export const getAllLatest = query({
  args: {},
  handler: async (ctx) => {
    const countries = await ctx.db.query("countries").collect();
    const scores = await Promise.all(
      countries.map(async (country) => {
        const latestScores = await ctx.db
          .query("pulse_scores")
          .withIndex("by_country", (q) => q.eq("country_id", country._id))
          .order("desc")
          .take(1);
        
        return {
          country,
          score: latestScores[0] || null,
        };
      })
    );
    
    return scores.filter((s) => s.score !== null);
  },
});

export const getHistorical = query({
  args: {
    country_id: v.id("countries"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("pulse_scores")
      .withIndex("by_country", (q) => q.eq("country_id", args.country_id))
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    country_id: v.id("countries"),
    score: v.number(),
    date: v.number(),
    components: v.object({
      gdp_growth: v.number(),
      inflation: v.number(),
      unemployment: v.number(),
      market_index: v.number(),
      co2_emissions: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pulse_scores", args);
  },
});
