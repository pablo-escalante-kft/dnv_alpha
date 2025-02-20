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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Startup Not Found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const analysis = startup.aiAnalysis as any;
  if (!analysis) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Analysis in Progress</CardTitle>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid gap-6">
          {/* Overview Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{startup.organizationName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-gray-400">Industries: {startup.industries?.join(", ")}</p>
                  <p className="text-gray-400">Location: {startup.location}</p>
                  <p className="text-gray-400">
                    Website: {startup.url && (
                      <a href={startup.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {startup.url}
                      </a>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
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
                  <p className="text-gray-400">
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
                  <p className="text-gray-400">
                    Total Funding: ${startup.totalFunding?.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founders Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {startup.founders?.map((founder, index) => (
              <Collapsible key={index} className="w-full">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{founder.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-white">{founder.name}</h3>
                            <p className="text-sm text-gray-400">{founder.role}</p>
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
                            className="flex items-center gap-2 text-blue-400 hover:underline"
                          >
                            <LinkedinIcon className="h-4 w-4" />
                            LinkedIn Profile
                          </a>
                        )}

                        {founder.education && (
                          <div className="flex items-start gap-2">
                            <GraduationCap className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Education</h4>
                              <p className="text-gray-400">{founder.education}</p>
                            </div>
                          </div>
                        )}

                        {founder.experience && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Experience</h4>
                              <p className="text-gray-400">{founder.experience}</p>
                            </div>
                          </div>
                        )}

                        {founder.previousCompanies && founder.previousCompanies.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Building className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Previous Companies</h4>
                              <p className="text-gray-400">{founder.previousCompanies.join(", ")}</p>
                            </div>
                          </div>
                        )}

                        {founder.achievements && founder.achievements.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Award className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-300">Key Achievements</h4>
                              <ul className="list-disc list-inside text-gray-400">
                                {founder.achievements.map((achievement, i) => (
                                  <li key={i}>{achievement}</li>
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
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Score Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoreData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {item.name}
                        </span>
                        <span className="ml-auto text-sm font-medium text-white">
                          {item.score}/10
                        </span>
                      </div>
                      <Progress value={item.score * 10} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue Growth */}
            <Card className="bg-gray-800 border-gray-700">
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {startup.keyMetrics?.map((metric, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <p className="text-sm text-gray-400">{metric.metric}</p>
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-green-400 mb-1">
                    Strengths
                  </h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    {analysis.analysis.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-400 mb-1">
                    Weaknesses
                  </h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    {analysis.analysis.weaknesses.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-400 mb-1">
                    Opportunities
                  </h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    {analysis.analysis.opportunities.map((o: string, i: number) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400 mb-1">
                    Threats
                  </h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    {analysis.analysis.threats.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                {analysis.recommendations.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}