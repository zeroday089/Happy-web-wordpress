import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";
import { ArticleFormData } from "@/type/api";

const PUBLIC_KEY = ["articles", "public"] as const;
const ADMIN_KEY = ["articles", "admin"] as const;

// Public — Resources page
export const useArticles = () => {
  return useQuery({
    queryKey: PUBLIC_KEY,
    queryFn: articleService.getPublishedArticles,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

// Admin — dashboard table
export const useAdminArticles = () => {
  return useQuery({
    queryKey: ADMIN_KEY,
    queryFn: articleService.getAllArticlesAdmin,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};

const invalidateArticles = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: PUBLIC_KEY });
  queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArticleFormData) => articleService.createArticle(data),
    onSuccess: () => invalidateArticles(queryClient),
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ArticleFormData> & { isActive?: boolean } }) =>
      articleService.updateArticle(id, data),
    onSuccess: () => invalidateArticles(queryClient),
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: () => invalidateArticles(queryClient),
  });
};
