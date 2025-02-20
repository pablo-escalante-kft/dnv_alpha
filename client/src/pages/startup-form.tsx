import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertStartupSchema, type InsertStartup, type Startup } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StartupForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const key = window.location.pathname.split("/submit/")[1];

  const form = useForm<InsertStartup>({
    resolver: zodResolver(insertStartupSchema),
    defaultValues: {
      organizationName: "",
      url: "",
      industries: [],
      location: "",
      fundingRounds: null,
      lastFunding: null,
      lastFundingType: "",
      equity: null,
      totalFunding: null,
      revenue: null,
      industryGroups: [],
      foundersCount: null,
      employeesCount: null,
      topInvestors: [],
      growth: null,
      valuation: null,
      lastValuationDate: null,
      founders: [], // Added founders field
    },
  });

  const { data: startup, isLoading } = useQuery<Startup>({
    queryKey: [`/api/startups/${key}`],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertStartup) => {
      const res = await apiRequest("POST", `/api/startups/${key}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Your startup information has been submitted for analysis.",
      });
      setLocation(`/startup/${data.submissionKey}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
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
            <CardTitle>Invalid Submission Link</CardTitle>
            <CardDescription>This submission link is invalid or has expired.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Startup Submission Form</CardTitle>
            <CardDescription>
              Please provide detailed information about your startup for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          className="bg-gray-900 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://"
                          {...field}
                          value={field.value ?? ""}
                          className="bg-gray-900 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="industries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industries</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value?.join(", ") ?? ""}
                            onChange={(e) => field.onChange(e.target.value.split(", ").filter(Boolean))}
                            placeholder="Enter industries, separated by commas"
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fundingRounds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Rounds</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastFundingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Funding Type</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="lastFunding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Funding ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equity (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalFunding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Funding ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="revenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industryGroups"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry Groups</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value?.join(", ") ?? ""}
                            onChange={(e) => field.onChange(e.target.value.split(", ").filter(Boolean))}
                            placeholder="Enter groups, separated by commas"
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="foundersCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Founders</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeesCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="topInvestors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top 5 Investors</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.join(", ") ?? ""}
                          onChange={(e) => {
                            const investors = e.target.value.split(", ").filter(Boolean);
                            field.onChange(investors.slice(0, 5));
                          }}
                          placeholder="Enter investors, separated by commas (max 5)"
                          className="bg-gray-900 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="founders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founders Information</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {Array.from({ length: field.value?.length || 1 }).map((_, index) => (
                            <Card key={index} className="bg-gray-900 border-gray-700">
                              <CardContent className="pt-6 space-y-4">
                                <Input
                                  placeholder="Name"
                                  value={field.value?.[index]?.name || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      name: e.target.value,
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Input
                                  placeholder="Role"
                                  value={field.value?.[index]?.role || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      role: e.target.value,
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Input
                                  placeholder="LinkedIn URL"
                                  value={field.value?.[index]?.linkedIn || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      linkedIn: e.target.value,
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Input
                                  placeholder="Education"
                                  value={field.value?.[index]?.education || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      education: e.target.value,
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Input
                                  placeholder="Experience"
                                  value={field.value?.[index]?.experience || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      experience: e.target.value,
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Input
                                  placeholder="Previous Companies (comma-separated)"
                                  value={field.value?.[index]?.previousCompanies?.join(", ") || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      previousCompanies: e.target.value.split(", ").filter(Boolean),
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Input
                                  placeholder="Achievements (comma-separated)"
                                  value={field.value?.[index]?.achievements?.join(", ") || ""}
                                  onChange={(e) => {
                                    const newFounders = [...(field.value || [])];
                                    newFounders[index] = {
                                      ...(newFounders[index] || {}),
                                      achievements: e.target.value.split(", ").filter(Boolean),
                                    };
                                    field.onChange(newFounders);
                                  }}
                                  className="bg-gray-800 border-gray-700"
                                />
                              </CardContent>
                            </Card>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const newFounders = [...(field.value || []), {}];
                              field.onChange(newFounders);
                            }}
                            className="w-full"
                          >
                            Add Founder
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="growth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Growth (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valuation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valuation ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastValuationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Valuation Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit for Analysis
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}