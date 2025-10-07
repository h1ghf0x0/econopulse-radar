import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    // Countries table
    countries: defineTable({
      name: v.string(),
      iso_code: v.string(), // ISO 3166-1 alpha-3 code
      region: v.string(),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
    })
      .index("by_iso_code", ["iso_code"])
      .index("by_region", ["region"]),

    // Economic indicators
    indicators: defineTable({
      country_id: v.id("countries"),
      name: v.string(), // GDP_growth, inflation, unemployment, interest_rate, co2_emissions, market_index
      value: v.number(),
      source: v.string(), // FRED, World Bank, IMF, etc.
      date: v.number(), // timestamp
    })
      .index("by_country", ["country_id"])
      .index("by_country_and_name", ["country_id", "name"])
      .index("by_date", ["date"]),

    // Pulse scores
    pulse_scores: defineTable({
      country_id: v.id("countries"),
      score: v.number(), // 0-100
      date: v.number(), // timestamp
      components: v.object({
        gdp_growth: v.number(),
        inflation: v.number(),
        unemployment: v.number(),
        market_index: v.number(),
        co2_emissions: v.number(),
      }),
    })
      .index("by_country", ["country_id"])
      .index("by_country_and_date", ["country_id", "date"]),

    // Policy/Market events
    events: defineTable({
      title: v.string(),
      date: v.number(), // timestamp
      country: v.string(), // country name or "Global"
      type: v.string(), // fiscal_stimulus, rate_change, sanctions, carbon_tax, etc.
      summary: v.string(),
      related_indicators: v.array(v.string()), // indicator names affected
      source_url: v.optional(v.string()),
    })
      .index("by_date", ["date"])
      .index("by_country", ["country"])
      .index("by_type", ["type"]),

    // Event impacts (correlation analysis)
    event_impacts: defineTable({
      event_id: v.id("events"),
      country_id: v.id("countries"),
      indicator_name: v.string(),
      pre_value: v.number(),
      post_value: v.number(),
      correlation: v.number(), // -1 to 1
      delta_percentage: v.number(),
      delta_summary: v.string(),
    })
      .index("by_event", ["event_id"])
      .index("by_country", ["country_id"])
      .index("by_event_and_country", ["event_id", "country_id"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;