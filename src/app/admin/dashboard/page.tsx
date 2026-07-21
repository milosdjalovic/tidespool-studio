"use client";

import { LoaderCircle, LogOut, Mail, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";
import type { ContactMessage, PortfolioItem } from "@/lib/types";

const emptyForm = {
  title: "",
  description: "",
  type: "video" as PortfolioItem["type"],
  category: "promotional" as PortfolioItem["category"],
  mediaUrl: "",
  thumbnailUrl: "",
  featured: false,
  order: 0,
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [storageConfigured, setStorageConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [portfolioResponse, statusResponse] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/admin/status"),
      ]);

      if (portfolioResponse.status === 401 || statusResponse.status === 401) {
        router.push("/admin/login");
        return;
      }

      const portfolioData = await portfolioResponse.json();
      const statusData = await statusResponse.json();

      setItems(portfolioData);
      setMessages(statusData.messages || []);
      setStorageConfigured(Boolean(statusData.storageConfigured));
    } catch {
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || "",
      featured: item.featured,
      order: item.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(editingId ? `/api/portfolio/${editingId}` : "/api/portfolio", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save portfolio item.");
      }

      if (!data.persisted) {
        setError(
          "Saved in memory only. Connect Vercel Blob storage to persist admin changes in production.",
        );
      }

      resetForm();
      await loadDashboard();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this portfolio item?")) {
      return;
    }

    const response = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete item.");
      return;
    }

    await loadDashboard();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function markMessageRead(id: string) {
    await fetch(`/api/messages/${id}`, { method: "PATCH" });
    await loadDashboard();
  }

  async function deleteMessage(id: string) {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    await loadDashboard();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin text-muted" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen section-pad py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="eyebrow link-underline">
              View website
            </Link>
            <h1 className="section-title mt-6">Dashboard</h1>
            <p className="mt-4 text-sm text-muted">
              Manage portfolio items and review contact messages.
            </p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary self-start">
            <LogOut size={14} className="mr-2 inline" />
            Log out
          </button>
        </div>

        {!storageConfigured ? (
          <div className="mt-8 border border-accent-warm/30 px-5 py-4 text-sm text-accent-warm">
            Production storage is not connected yet. Connect Vercel Blob to persist changes.
          </div>
        ) : null}

        {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}

        <div className="mt-12 grid gap-12 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="border border-line p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl uppercase tracking-wide text-foreground">
                {editingId ? "Edit Item" : "Add Item"}
              </h2>
              {editingId ? (
                <button type="button" className="eyebrow hover:text-foreground" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <label className="block">
                <span className="eyebrow">Title</span>
                <input
                  className="input-minimal mt-3"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className="eyebrow">Description</span>
                <textarea
                  className="textarea-minimal mt-3 min-h-28"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  required
                />
              </label>
              <div className="grid gap-8 md:grid-cols-2">
                <label className="block">
                  <span className="eyebrow">Type</span>
                  <div className="mt-3">
                    <CustomSelect
                      value={form.type}
                      onChange={(value) =>
                        setForm({ ...form, type: value as PortfolioItem["type"] })
                      }
                      options={[
                        { value: "video", label: "Video" },
                        { value: "photo", label: "Photo" },
                      ]}
                      placeholder="Select type"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="eyebrow">Category</span>
                  <div className="mt-3">
                    <CustomSelect
                      value={form.category}
                      onChange={(value) =>
                        setForm({ ...form, category: value as PortfolioItem["category"] })
                      }
                      options={[
                        { value: "promotional", label: "Promotional" },
                        { value: "event", label: "Event" },
                        { value: "photography", label: "Photography" },
                      ]}
                      placeholder="Select category"
                    />
                  </div>
                </label>
              </div>
              <label className="block">
                <span className="eyebrow">Media URL</span>
                <input
                  className="input-minimal mt-3"
                  value={form.mediaUrl}
                  onChange={(event) => setForm({ ...form, mediaUrl: event.target.value })}
                  placeholder="YouTube embed URL or direct image URL"
                  required
                />
              </label>
              <label className="block">
                <span className="eyebrow">Thumbnail URL (optional)</span>
                <input
                  className="input-minimal mt-3"
                  value={form.thumbnailUrl}
                  onChange={(event) => setForm({ ...form, thumbnailUrl: event.target.value })}
                />
              </label>
              <div className="grid gap-8 md:grid-cols-2">
                <label className="block">
                  <span className="eyebrow">Display order</span>
                  <input
                    className="input-minimal mt-3"
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(event) => setForm({ ...form, order: Number(event.target.value) })}
                  />
                </label>
                <label className="flex items-end gap-3 pb-4 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                  />
                  Featured item
                </label>
              </div>

              <button type="submit" className="btn-primary disabled:opacity-50" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Item" : "Add Item"}
              </button>
            </form>
          </section>

          <section className="border border-line p-6 md:p-8">
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground">Messages</h2>
            <div className="mt-8 space-y-6">
              {messages.length === 0 ? (
                <p className="text-sm text-muted">No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className={`border p-4 ${
                      message.read ? "border-line" : "border-accent-warm/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{message.name}</p>
                        <p className="text-sm text-muted">{message.email}</p>
                      </div>
                      <Mail size={16} className="text-muted" />
                    </div>
                    {message.service ? (
                      <p className="eyebrow mt-4">{message.service}</p>
                    ) : null}
                    <p className="mt-3 text-sm leading-7 text-muted">{message.message}</p>
                    <div className="mt-4 flex gap-4">
                      {!message.read ? (
                        <button
                          type="button"
                          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground"
                          onClick={() => markMessageRead(message.id)}
                        >
                          Mark read
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.2em] text-red-400 hover:text-red-300"
                        onClick={() => deleteMessage(message.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-12 border border-line p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground">
              Portfolio Items
            </h2>
            <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={resetForm}>
              <Plus size={14} className="mr-2 inline" />
              New
            </button>
          </div>

          <div className="mt-8 space-y-0">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="eyebrow">
                    {item.type} · {item.category}
                  </p>
                  <h3 className="mt-2 font-display text-lg uppercase text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn-secondary px-4 py-2 text-xs"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil size={14} className="mr-2 inline" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="border border-red-400/40 px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-red-400"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={14} className="mr-2 inline" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
