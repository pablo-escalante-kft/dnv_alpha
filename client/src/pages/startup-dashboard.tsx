import { useQuery } from "@tanstack/react-query";
import { type Startup } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, TrendingUp, Users, Target, ShieldAlert, Lightbulb,
  Briefcase, GraduationCap, Award, Building, LinkedinIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function StartupDashboard() {
  const key = window.location.pathname.split("/startup/")[1];

  const { data: startup, isLoading } = useQuery<Startup>({
    queryKey: [`/api/startups/${key}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Startup Not Found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const analysis = startup.aiAnalysis;
  if (!analysis) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Analysis in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              The AI analysis for this startup is still being processed. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scoreData = [
    {
      name: "Market Potential",
      score: analysis.scores.marketPotential,
      icon: TrendingUp,
    },
    {
      name: "Team Strength",
      score: analysis.scores.teamStrength,
      icon: Users,
    },
    {
      name: "Product Innovation",
      score: analysis.scores.productInnovation,
      icon: Lightbulb,
    },
    {
      name: "Competitive Advantage",
      score: analysis.scores.competitiveAdvantage,
      icon: Target,
    },
    {
      name: "Financial Viability",
      score: analysis.scores.financialViability,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid gap-6">
          {/* Overview Card */}
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{startup.organizationName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Industries: {startup.industries?.map((industry, idx) => (
                      <span 
                        key={idx}
                        className="inline-block px-2 py-1 bg-purple-900/40 rounded-full text-purple-300 text-xs mr-2 mb-2"
                      >
                        {industry}
                      </span>
                    ))}
                  </p>
                  <p className="text-gray-300">Location: {startup.location}</p>
                  {startup.url && (
                    <p className="text-gray-300">
                      Website:{" "}
                      <a 
                        href={startup.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {startup.url}
                      </a>
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Investment Potential:{" "}
                    <span
                      className={
                        analysis.investmentPotential === "strong"
                          ? "text-green-400"
                          : analysis.investmentPotential === "moderate"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {analysis.investmentPotential.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    Risk Level:{" "}
                    <span
                      className={
                        analysis.riskLevel === "low"
                          ? "text-green-400"
                          : analysis.riskLevel === "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {analysis.riskLevel.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    Total Funding:{" "}
                    <span className="text-purple-400">
                      ${startup.totalFunding?.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founders Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {startup.founders?.map((founder, index) => (
              <Collapsible key={index} className="w-full">
                <Card className="bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/60 transition-colors">
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="border-2 border-purple-500/50">
                            <AvatarFallback className="bg-purple-950 text-purple-200">
                              {founder.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-white">{founder.name}</h3>
                            <p className="text-sm text-purple-300">{founder.role}</p>
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        {founder.linkedIn && (
                          <a
                            href={founder.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <LinkedinIcon className="h-4 w-4" />
                            LinkedIn Profile
                          </a>
                        )}

                        {founder.education && (
                          <div className="flex items-start gap-2">
                            <GraduationCap className="h-5 w-5 text-purple-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Education</h4>
                              <p className="text-gray-400">{founder.education}</p>
                            </div>
                          </div>
                        )}

                        {founder.experience && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-purple-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Experience</h4>
                              <p className="text-gray-400">{founder.experience}</p>
                            </div>
                          </div>
                        )}

                        {founder.previousCompanies && founder.previousCompanies.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Building className="h-5 w-5 text-purple-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Previous Companies</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {founder.previousCompanies.map((company, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-purple-900/40 rounded-full text-purple-300 text-xs"
                                  >
                                    {company}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {founder.achievements && founder.achievements.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Award className="h-5 w-5 text-purple-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Key Achievements</h4>
                              <ul className="mt-1 space-y-1">
                                {founder.achievements.map((achievement, i) => (
                                  <li key={i} className="text-gray-400 flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Metrics and Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Score Analysis */}
            <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Score Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoreData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          {item.name}
                        </span>
                        <span className="ml-auto text-sm font-medium text-white">
                          {item.score}/10
                        </span>
                      </div>
                      <Progress 
                        value={item.score * 10} 
                        className="bg-purple-950" 
                        data-state="indeterminate" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue Growth */}
            <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={startup.monthlyMetrics || []}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          borderColor: '#374151',
                          backdropFilter: 'blur(8px)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF6" 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {startup.keyMetrics?.map((metric, index) => (
                  <Card key={index} className="bg-black/60 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <p className="text-sm text-purple-300">{metric.metric}</p>
                      <div className={`text-sm mt-2 ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change}% ({metric.timeframe})
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-green-400 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analysis.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analysis.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-400 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analysis.opportunities.map((o: string, i: number) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Threats
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analysis.threats.map((t: string, i: number) => (
                      <li key={i} className="text-gray-300 flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-400" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations.map((r: string, i: number) => (
                  <li key={i} className="text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400 shrink-0">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}