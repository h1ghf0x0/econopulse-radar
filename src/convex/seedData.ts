import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed countries
    const countries = [
      { name: "United States", iso_code: "USA", region: "North America", latitude: 37.0902, longitude: -95.7129 },
      { name: "China", iso_code: "CHN", region: "Asia", latitude: 35.8617, longitude: 104.1954 },
      { name: "Japan", iso_code: "JPN", region: "Asia", latitude: 36.2048, longitude: 138.2529 },
      { name: "Germany", iso_code: "DEU", region: "Europe", latitude: 51.1657, longitude: 10.4515 },
      { name: "United Kingdom", iso_code: "GBR", region: "Europe", latitude: 55.3781, longitude: -3.4360 },
      { name: "India", iso_code: "IND", region: "Asia", latitude: 20.5937, longitude: 78.9629 },
      { name: "France", iso_code: "FRA", region: "Europe", latitude: 46.2276, longitude: 2.2137 },
      { name: "Brazil", iso_code: "BRA", region: "South America", latitude: -14.2350, longitude: -51.9253 },
      { name: "Canada", iso_code: "CAN", region: "North America", latitude: 56.1304, longitude: -106.3468 },
      { name: "Australia", iso_code: "AUS", region: "Oceania", latitude: -25.2744, longitude: 133.7751 },
    ];

    const countryIds: Record<string, string> = {};
    for (const country of countries) {
      const id = await ctx.db.insert("countries", country);
      countryIds[country.iso_code] = id;
    }

    // Seed sample indicators for each country
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    
    for (const [isoCode, countryId] of Object.entries(countryIds)) {
      // Generate 12 months of historical data
      for (let i = 0; i < 12; i++) {
        const date = now - (i * oneMonth);
        
        await ctx.db.insert("indicators", {
          country_id: countryId as any,
          name: "GDP_growth",
          value: 2 + Math.random() * 3,
          source: "World Bank",
          date,
        });
        
        await ctx.db.insert("indicators", {
          country_id: countryId as any,
          name: "inflation",
          value: 1 + Math.random() * 4,
          source: "World Bank",
          date,
        });
        
        await ctx.db.insert("indicators", {
          country_id: countryId as any,
          name: "unemployment",
          value: 3 + Math.random() * 5,
          source: "World Bank",
          date,
        });
        
        await ctx.db.insert("indicators", {
          country_id: countryId as any,
          name: "interest_rate",
          value: 0.5 + Math.random() * 4,
          source: "FRED",
          date,
        });
        
        await ctx.db.insert("indicators", {
          country_id: countryId as any,
          name: "co2_emissions",
          value: 300 + Math.random() * 200,
          source: "World Bank",
          date,
        });
        
        await ctx.db.insert("indicators", {
          country_id: countryId as any,
          name: "market_index",
          value: 10000 + Math.random() * 5000,
          source: "Alpha Vantage",
          date,
        });
      }
      
      // Calculate and insert pulse score
      const latestIndicators = await Promise.all([
        ctx.db.query("indicators").withIndex("by_country_and_name", (q) => q.eq("country_id", countryId as any).eq("name", "GDP_growth")).order("desc").take(1),
        ctx.db.query("indicators").withIndex("by_country_and_name", (q) => q.eq("country_id", countryId as any).eq("name", "inflation")).order("desc").take(1),
        ctx.db.query("indicators").withIndex("by_country_and_name", (q) => q.eq("country_id", countryId as any).eq("name", "unemployment")).order("desc").take(1),
        ctx.db.query("indicators").withIndex("by_country_and_name", (q) => q.eq("country_id", countryId as any).eq("name", "market_index")).order("desc").take(1),
        ctx.db.query("indicators").withIndex("by_country_and_name", (q) => q.eq("country_id", countryId as any).eq("name", "co2_emissions")).order("desc").take(1),
      ]);
      
      const gdp = latestIndicators[0][0]?.value || 0;
      const inflation = latestIndicators[1][0]?.value || 0;
      const unemployment = latestIndicators[2][0]?.value || 0;
      const market = latestIndicators[3][0]?.value || 0;
      const co2 = latestIndicators[4][0]?.value || 0;
      
      // Normalize (simplified)
      const gdpNorm = Math.min(gdp / 5, 1);
      const inflationNorm = Math.min(inflation / 5, 1);
      const unemploymentNorm = Math.min(unemployment / 10, 1);
      const marketNorm = Math.min(market / 15000, 1);
      const co2Norm = Math.min(co2 / 500, 1);
      
      const score = (
        0.3 * gdpNorm +
        0.2 * (1 - inflationNorm) +
        0.2 * (1 - unemploymentNorm) +
        0.15 * marketNorm +
        0.15 * (1 - co2Norm)
      ) * 100;
      
      await ctx.db.insert("pulse_scores", {
        country_id: countryId as any,
        score: Math.round(score),
        date: now,
        components: {
          gdp_growth: gdpNorm,
          inflation: inflationNorm,
          unemployment: unemploymentNorm,
          market_index: marketNorm,
          co2_emissions: co2Norm,
        },
      });
    }

    // Seed major events
    const events = [
      {
        title: "COVID-19 Pandemic Global Lockdowns",
        date: new Date("2020-03-15").getTime(),
        country: "Global",
        type: "pandemic",
        summary: "Worldwide economic shutdown due to COVID-19 pandemic, affecting GDP, unemployment, and markets globally.",
        related_indicators: ["GDP_growth", "unemployment", "market_index"],
      },
      {
        title: "US Federal Reserve Rate Hikes Begin",
        date: new Date("2022-03-16").getTime(),
        country: "United States",
        type: "rate_change",
        summary: "Federal Reserve begins aggressive interest rate increases to combat inflation, affecting global markets.",
        related_indicators: ["interest_rate", "inflation", "market_index"],
      },
      {
        title: "Ukraine Conflict Escalation",
        date: new Date("2022-02-24").getTime(),
        country: "Global",
        type: "geopolitical",
        summary: "Russia-Ukraine conflict disrupts energy markets and global supply chains, driving inflation.",
        related_indicators: ["inflation", "GDP_growth", "co2_emissions"],
      },
      {
        title: "Global Inflation Peak",
        date: new Date("2023-06-01").getTime(),
        country: "Global",
        type: "economic",
        summary: "Inflation reaches multi-decade highs across developed economies before beginning to moderate.",
        related_indicators: ["inflation", "interest_rate"],
      },
      {
        title: "EU Carbon Tax Expansion",
        date: new Date("2024-01-01").getTime(),
        country: "Germany",
        type: "carbon_tax",
        summary: "European Union expands carbon border adjustment mechanism, affecting trade and emissions.",
        related_indicators: ["co2_emissions", "GDP_growth"],
      },
      {
        title: "China Economic Stimulus Package",
        date: new Date("2023-09-15").getTime(),
        country: "China",
        type: "fiscal_stimulus",
        summary: "China announces major fiscal stimulus to support slowing economic growth.",
        related_indicators: ["GDP_growth", "market_index"],
      },
      {
        title: "Bank of England Emergency Intervention",
        date: new Date("2022-09-28").getTime(),
        country: "United Kingdom",
        type: "rate_change",
        summary: "BoE intervenes in bond markets following fiscal policy turmoil.",
        related_indicators: ["interest_rate", "market_index"],
      },
      {
        title: "India Becomes Most Populous Nation",
        date: new Date("2023-04-14").getTime(),
        country: "India",
        type: "demographic",
        summary: "India surpasses China as world's most populous country, signaling economic shift.",
        related_indicators: ["GDP_growth", "unemployment"],
      },
      {
        title: "US Inflation Reduction Act",
        date: new Date("2022-08-16").getTime(),
        country: "United States",
        type: "fiscal_stimulus",
        summary: "Major climate and healthcare legislation passed with $369B in climate investments.",
        related_indicators: ["co2_emissions", "GDP_growth"],
      },
      {
        title: "Japan Ends Negative Interest Rates",
        date: new Date("2024-03-19").getTime(),
        country: "Japan",
        type: "rate_change",
        summary: "Bank of Japan ends decade-long negative interest rate policy.",
        related_indicators: ["interest_rate", "inflation"],
      },
    ];

    for (const event of events) {
      await ctx.db.insert("events", event);
    }

    return { success: true, message: "Database seeded successfully" };
  },
});
