import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Calendar, Globe, Tag, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const event = useQuery(api.events.getById, { id: id as Id<"events"> });
  const impacts = useQuery(api.eventImpacts.getByEvent, { event_id: id as Id<"events"> });

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/events")} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3">
                {event.type.replace(/_/g, " ")}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{event.summary}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {event.country}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {event.source_url && (
            <Button variant="outline" asChild>
              <a href={event.source_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Source
              </a>
            </Button>
          )}
        </motion.div>

        {/* Related Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Related Indicators
              </CardTitle>
              <CardDescription>Economic metrics affected by this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.related_indicators.map((indicator) => (
                  <Badge key={indicator} variant="outline">
                    {indicator.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Analysis */}
        {impacts && impacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Impact Analysis</CardTitle>
                <CardDescription>Measured effects across countries and indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impacts.map((impact) => (
                    <div key={impact._id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{impact.country?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {impact.indicator_name.replace(/_/g, " ")}
                          </p>
                        </div>
                        <Badge variant={impact.delta_percentage > 0 ? "default" : "destructive"}>
                          {impact.delta_percentage > 0 ? "+" : ""}
                          {impact.delta_percentage.toFixed(2)}%
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{impact.delta_summary}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Pre: {impact.pre_value.toFixed(2)}</span>
                        <span>Post: {impact.post_value.toFixed(2)}</span>
                        <span>Correlation: {impact.correlation.toFixed(3)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {(!impacts || impacts.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>Impact analysis data not yet available for this event.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
