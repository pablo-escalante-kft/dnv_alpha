import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Startup } from "@shared/schema";
import { Link } from "wouter";
import { Loader2, Plus } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const { data: startups, isLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });

  const createStartupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/startups/create");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.username}</h1>
            <p className="text-gray-400">Manage your startup submissions</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => createStartupMutation.mutate()}
              disabled={createStartupMutation.isPending}
            >
              {createStartupMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              New Submission
            </Button>
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups?.map((startup) => (
              <Link key={startup.submissionKey} href={`/startup/${startup.submissionKey}`}>
                <Card className="bg-gray-800 border-gray-700 hover:border-primary cursor-pointer transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {startup.name || "New Submission"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400">
                      Status: {startup.status}
                    </div>
                    {startup.industry && (
                      <div className="text-sm text-gray-400">
                        Industry: {startup.industry}
                      </div>
                    )}
                    <div className="text-sm text-gray-400">
                      Created: {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString() : "N/A"}
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