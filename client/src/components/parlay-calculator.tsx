import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parlayCalcSchema, type ParlayCalc } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ParlayCalculator() {
  const form = useForm<ParlayCalc>({
    resolver: zodResolver(parlayCalcSchema),
    defaultValues: {
      targetWinAmount: 0,
      wagerAmount: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ParlayCalc) => {
      const res = await apiRequest("POST", "/api/parlay-calc", data);
      return await res.json();
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="targetWinAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Win Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wagerAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wager Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Calculate Parlay"
            )}
          </Button>
        </form>
      </Form>

      {mutation.data && (
        <Card className="mt-4 p-4">
          <h3 className="font-bold mb-2">Recommended Parlay</h3>
          <div className="space-y-2">
            {JSON.parse(mutation.data.recommendations).selections.map(
              (selection: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{selection.game}</span>
                  <span className="font-medium">{selection.pick}</span>
                </div>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
