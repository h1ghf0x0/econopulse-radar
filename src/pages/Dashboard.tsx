import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Loader2, TrendingUp, TrendingDown, Globe, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const countries = useQuery(api.countries.list);
  const pulseScores = useQuery(api.pulseScores.getAllLatest);
  const events = useQuery(api.events.list, { limit: 10 });
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  if (!countries || !pulseScores || !events) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const regions = ["All", ...new Set(countries.map((c) => c.region))];
  
  const filteredScores = selectedRegion === "All" 
    ? pulseScores 
    : pulseScores.filter((s) => s.country.region === selectedRegion);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-100 dark:bg-green-950";
    if (score >= 50) return "bg-yellow-100 dark:bg-yellow-950";
    return "bg-red-100 dark:bg-red-950";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">EconoPulse</h1>
                <p className="text-xs text-muted-foreground">Global Policy Impact Radar</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/events")}>
                Events
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Countries Tracked</CardDescription>
              <CardTitle className="text-3xl">{countries.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Pulse Score</CardDescription>
              <CardTitle className="text-3xl">
                {Math.round(pulseScores.reduce((acc, s) => acc + (s.score?.score || 0), 0) / pulseScores.length)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Events</CardDescription>
              <CardTitle className="text-3xl">{events.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Regions</CardDescription>
              <CardTitle className="text-3xl">{regions.length - 1}</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Region Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Country Pulse Scores */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Economic Pulse Scores
                </CardTitle>
                <CardDescription>
                  Real-time composite health scores (0-100)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredScores
                    .sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0))
                    .map((item) => (
                      <motion.div
                        key={item.country._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getScoreBg(item.score?.score || 0)}`}
                        onClick={() => navigate(`/country/${item.country._id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{item.country.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {item.country.region}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.country.iso_code}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(item.score?.score || 0)}`}>
                              {item.score?.score || 0}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {(item.score?.score || 0) >= 60 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              Pulse Score
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Major policy & market events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {events.map((event) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => navigate(`/event/${event._id}`)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{event.title}</h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {event.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{event.country}</span>
                        <span className="text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
