"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import {
  useAdminArticles, useCreateArticle, useUpdateArticle, useDeleteArticle,
} from "@/hooks/useArticles";
import { fileToBase64 } from "@/services/article.service";
import { Article, ArticleFormData } from "@/type/api";

const emptyForm: ArticleFormData = {
  articleName: "",
  articleText: "",
  articleLink: "",
  articleLogo: "",
};

export default function ArticlesAdminPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (!token) router.replace("/Admin/login");
    else setIsAuthenticated(true);
  }, [router]);

  const { data: articles = [], isLoading } = useAdminArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleFormData>(emptyForm);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  if (!isMounted || !isAuthenticated) return null;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setLogoPreview(null);
    setDialogOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditing(article);
    setForm({
      articleName: article.articleName,
      articleText: article.articleText,
      articleLink: article.articleLink,
      articleLogo: article.articleLogo,
    });
    setLogoPreview(article.articleLogo || null);
    setDialogOpen(true);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo image 2MB se chhoti honi chahiye.");
      return;
    }

    setConverting(true);
    try {
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, articleLogo: base64 }));
      setLogoPreview(base64);
    } catch {
      toast.error("Image process karne mein error aaya, dobara try karo.");
    } finally {
      setConverting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.articleName.trim() || !form.articleText.trim() || !form.articleLink.trim()) {
      toast.error("Article name, text aur link sab required hain.");
      return;
    }
    if (!form.articleLogo) {
      toast.error("Article logo upload karna zaroori hai.");
      return;
    }

    try {
      if (editing) {
        await updateArticle.mutateAsync({ id: editing._id, data: form });
        toast.success("Article updated.");
      } else {
        await createArticle.mutateAsync(form);
        toast.success("Article added.");
      }
      setDialogOpen(false);
    } catch (err) {
      const message =
        (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message) ||
        "Kuch galat ho gaya, dobara try karo.";
      toast.error(message);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm(`Delete "${article.articleName}"? Ye action undo nahi ho sakta.`)) return;
    try {
      await deleteArticle.mutateAsync(article._id);
      toast.success("Article deleted.");
    } catch (err) {
      const message =
        (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message) ||
        "Delete fail ho gaya.";
      toast.error(message);
    }
  };

  const saving = createArticle.isPending || updateArticle.isPending;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-zinc-400 hover:text-zinc-100"
            onClick={() => router.push("/Admin/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to bookings
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-white">Published Articles</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage the &quot;Published Articles&quot; cards shown on the Resources page
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Article
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">All Articles</CardTitle>
          <CardDescription className="text-zinc-500">{articles.length} total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400 font-medium">Logo</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Name</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Text</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Link</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-zinc-800">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full bg-zinc-800" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : articles.length === 0 ? (
                  <TableRow className="border-zinc-800">
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                      Koi article nahi mila. &quot;Add Article&quot; se naya add karo.
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article._id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.articleLogo}
                          alt={article.articleName}
                          className="w-10 h-10 rounded-md object-cover bg-zinc-800"
                        />
                      </TableCell>
                      <TableCell className="text-zinc-100 font-medium max-w-[180px]">
                        {article.articleName}
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm max-w-[320px] truncate">
                        {article.articleText}
                      </TableCell>
                      <TableCell>
                        <a
                          href={article.articleLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline text-sm flex items-center gap-1"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                            onClick={() => openEdit(article)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(article)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "Add Article"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Article Name</Label>
              <Input
                value={form.articleName}
                onChange={(e) => setForm((f) => ({ ...f, articleName: e.target.value }))}
                placeholder="Unheeded wisdom and a materialistic superpower"
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Article Text</Label>
              <Textarea
                value={form.articleText}
                onChange={(e) => setForm((f) => ({ ...f, articleText: e.target.value }))}
                placeholder="Short description / excerpt shown on the card"
                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Article Link</Label>
              <Input
                type="url"
                value={form.articleLink}
                onChange={(e) => setForm((f) => ({ ...f, articleLink: e.target.value }))}
                placeholder="https://timesofindia.indiatimes.com/..."
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Article Logo {editing && "(leave empty to keep current)"}</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="bg-zinc-800 border-zinc-700"
              />
              {converting && <p className="text-xs text-zinc-500">Processing image...</p>}
              {logoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-md object-cover mt-2 border border-zinc-700"
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-zinc-700"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || converting}>
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
