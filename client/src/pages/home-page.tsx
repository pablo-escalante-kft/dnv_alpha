import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Startup } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { Loader2, Plus, Briefcase, TrendingUp } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const { data: startups, isLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });

  const createStartupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/startups/create");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      setLocation(`/submit/${data.key}`);
    },
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to DNV VC Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered venture capital analysis and startup evaluation
          </p>
        </div>

        {/* User Actions Bar */}
        <div className="flex justify-between items-center mb-12 bg-black/20 p-6 rounded-lg backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome, {user?.username}</h2>
            <p className="text-gray-300">Manage your startup submissions</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => createStartupMutation.mutate()}
              disabled={createStartupMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {createStartupMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              New Submission
            </Button>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
              className="border-gray-600 hover:bg-gray-800 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Startups Grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups?.map((startup) => (
              <Link key={startup.submissionKey} href={`/startup/${startup.submissionKey}`}>
                <Card className="bg-black/40 border-gray-800 hover:bg-black/60 hover:border-purple-500 cursor-pointer transition-all duration-300 backdrop-blur-sm group">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {startup.organizationName ? (
                        <>
                          <Briefcase className="h-5 w-5 text-purple-400" />
                          {startup.organizationName}
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-5 w-5 text-purple-400" />
                          New Submission
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-300">
                        Status: <span className="text-purple-400">{startup.status}</span>
                      </div>
                      {startup.industries && startup.industries.length > 0 && (
                        <div className="text-gray-300">
                          Industries: 
                          <div className="flex flex-wrap gap-2 mt-1">
                            {startup.industries.map((industry, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-purple-900/40 rounded-full text-purple-300 text-xs"
                              >
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-gray-300">
                        Created: {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}