import { useQuery } from "@tanstack/react-query";
import { Category, type DecorationItem } from "../backend.d";
import { useActor } from "./useActor";

export type { DecorationItem };
export { Category };

export function useGetAllItems() {
  const { actor, isFetching } = useActor();
  return useQuery<DecorationItem[]>({
    queryKey: ["items"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetItemsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<DecorationItem[]>({
    queryKey: ["items", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) return actor.getAllItems();
      return actor.getItemsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}
