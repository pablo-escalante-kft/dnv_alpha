import { useQuery } from "@tanstack/react-query";
import { type Startup } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Users, Target, ShieldAlert, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{startup.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-gray-400">Industry: {startup.industry}</p>
                  <p className="text-gray-400">Location: {startup.location}</p>
                  <p className="text-gray-400">
                    Founded: {startup.foundingYear}
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
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
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

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">SWOT Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 text-sm">
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
                </div>
              </CardContent>
            </Card>
          </div>

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
