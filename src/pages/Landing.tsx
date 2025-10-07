import { motion } from "framer-motion";
import { Globe, TrendingUp, Activity, BarChart3, Zap, ArrowRight, Brain, Bell, LineChart, Shield, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced machine learning models analyze economic patterns and provide intelligent predictions beyond raw data",
    },
    {
      icon: Activity,
      title: "Economic Health Score",
      description: "Proprietary 0-100 composite metric combining GDP, inflation, employment, and market stability indicators",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Recession probability models, market sentiment analysis, and scenario planning for informed decision-making",
    },
    {
      icon: Bell,
      title: "Real-Time Alerts",
      description: "Instant notifications for critical economic events, Federal Reserve meetings, and personalized threshold triggers",
    },
    {
      icon: LineChart,
      title: "Interactive Visualizations",
      description: "Dynamic charts and 3D economic models powered by advanced data visualization frameworks",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Monitor major economies worldwide with local detail and cross-border correlation analysis",
    },
  ];

  const dataSources = [
    "Federal Reserve (FRED)",
    "Bureau of Labor Statistics",
    "World Bank",
    "IMF",
    "OECD",
    "Alpha Vantage",
    "ECB, BoE, BoJ",
  ];

  const useCases = [
    {
      icon: Users,
      title: "Retail Investors",
      description: "Make informed investment decisions with economic trend analysis and market impact assessments",
    },
    {
      icon: Shield,
      title: "Financial Advisors",
      description: "Provide clients with sophisticated economic insights and scenario-based portfolio strategies",
    },
    {
      icon: Sparkles,
      title: "Economics Enthusiasts",
      description: "Learn and explore economic concepts with educational content and interactive data exploration",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">EconoPulse Radar</h1>
                <p className="text-xs text-muted-foreground">Real-time Economic Intelligence Hub</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/events")}>
                Events
              </Button>
              <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                {isAuthenticated ? "Dashboard" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered Economic Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Monitor Global Economic
            <span className="text-primary"> Health</span> in Real-Time
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Combine traditional economic indicators with AI-powered sentiment analysis and predictive models. 
            Get actionable insights for smarter investment decisions and economic understanding.
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="group">
              Explore Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/events")}>
              View Economic Calendar
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl" />
          <Card className="relative overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Global Economies</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Economic Indicators</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">AI</div>
                  <div className="text-sm text-muted-foreground">Predictive Models</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Real-Time Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            World-Class Economic Intelligence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced analytics that go beyond data display to provide intelligent insights and predictions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/20">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for Decision Makers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tailored insights for investors, advisors, and economics enthusiasts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <useCase.icon className="h-10 w-10 text-primary mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm">{useCase.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted Data Sources
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aggregating data from the world's most reliable economic institutions
          </p>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {dataSources.map((source, index) => (
              <motion.div
                key={source}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="px-4 py-2 bg-background border rounded-lg text-sm font-medium">
                  {source}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Monitoring Economic Trends Today
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of investors and analysts using EconoPulse for real-time economic intelligence and predictive insights
              </p>
              <Button size="lg" variant="secondary" onClick={() => navigate("/dashboard")} className="group">
                Launch Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 EconoPulse Radar. AI-powered economic intelligence platform built with Convex, React, and real-time data APIs.</p>
        </div>
      </footer>
    </div>
  );
}