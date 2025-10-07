import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CountryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const country = useQuery(api.countries.getById, { id: id as Id<"countries"> });
  const pulseScore = useQuery(api.pulseScores.getLatestByCountry, { country_id: id as Id<"countries"> });
  const pulseHistory = useQuery(api.pulseScores.getHistorical, { country_id: id as Id<"countries">, limit: 12 });
  const indicators = useQuery(api.indicators.getByCountry, { country_id: id as Id<"countries"> });

  if (!country || !indicators) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Group indicators by name and get latest
  const latestIndicators: Record<string, any> = {};
  indicators.forEach((ind) => {
    if (!latestIndicators[ind.name] || ind.date > latestIndicators[ind.name].date) {
      latestIndicators[ind.name] = ind;
    }
  });

  // Prepare chart data
  const chartData = pulseHistory
    ?.sort((a, b) => a.date - b.date)
    .map((score) => ({
      date: new Date(score.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      score: score.score,
    })) || [];

  const indicatorNames = ["GDP_growth", "inflation", "unemployment", "interest_rate", "co2_emissions", "market_index"];
  const indicatorLabels: Record<string, string> = {
    GDP_growth: "GDP Growth (%)",
    inflation: "Inflation (%)",
    unemployment: "Unemployment (%)",
    interest_rate: "Interest Rate (%)",
    co2_emissions: "CO₂ Emissions (Mt)",
    market_index: "Market Index",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Country Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{country.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{country.iso_code}</Badge>
                <Badge variant="secondary">{country.region}</Badge>
              </div>
            </div>
            {pulseScore && (
              <div className="text-right">
                <div className="text-5xl font-bold text-primary mb-1">
                  {pulseScore.score}
                </div>
                <p className="text-sm text-muted-foreground">Pulse Score</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pulse Score Trend */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pulse Score Trend</CardTitle>
                <CardDescription>Historical economic health score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} name="Pulse Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Key Economic Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {indicatorNames.map((name) => {
              const indicator = latestIndicators[name];
              if (!indicator) return null;

              return (
                <Card key={name}>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{indicatorLabels[name]}</CardDescription>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {indicator.value.toFixed(2)}
                      {name === "GDP_growth" && indicator.value > 2 && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                      {name === "GDP_growth" && indicator.value < 2 && (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Source: {indicator.source}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {new Date(indicator.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Pulse Score Components */}
        {pulseScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Pulse Score Components</CardTitle>
                <CardDescription>Breakdown of factors contributing to the overall score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(pulseScore.components).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-medium">{(value * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
