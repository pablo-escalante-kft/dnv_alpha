import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertStartupSchema, type InsertStartup, type Startup } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      name: "",
      industry: "",
      foundingYear: undefined,
      location: "",
      employeeCount: undefined,
      teamDetails: [],
      businessModel: "",
      problemStatement: "",
      revenueModel: "",
      traction: {},
      fundingHistory: [],
      financialProjections: {},
      marketSize: "",
      competitorAnalysis: [],
      uniqueSellingProposition: "",
      productOverview: "",
      technologyStack: [],
      intellectualProperty: [],
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
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
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="foundingYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founding Year</FormLabel>
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
                    name="employeeCount"
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
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="bg-gray-900 border-gray-700"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Model</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="bg-gray-900 border-gray-700"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Size & Opportunity</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="bg-gray-900 border-gray-700"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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