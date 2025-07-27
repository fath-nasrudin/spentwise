import { useQuery } from "@tanstack/react-query";
import { getUserTransactions } from "../transaction.actions";

export function useGetTransactions(
  props: Parameters<typeof getUserTransactions>[0]
) {
  return useQuery({
    queryKey: ["transactions", props],
    queryFn: async () => {
      try {
        const result = await getUserTransactions(props);
        if (!result.success) {
          throw new Error(result.message || "Something went wrong");
        }
        return result.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message || "Something went wrong");
        }
        throw new Error("Something went wrong");
      }
    },
  });
}
