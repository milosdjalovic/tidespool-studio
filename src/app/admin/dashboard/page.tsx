"use client";

import { LoaderCircle, LogOut, Mail, Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminContentEditor, AdminThemeEditor } from "@/components/admin/AdminEditors";
import { AdminField, AdminInput, AdminTextarea } from "@/components/admin/AdminFields";
import { CustomSelect } from "@/components/CustomSelect";
import type { ContactMessage, PortfolioItem, SiteContent, SiteTheme } from "@/lib/types";

const tabs = [
  { id: "messages", label: "Messages" },
  { id: "content", label: "Website text" },
  { id: "colors", label: "Colors" },
  { id: "portfolio", label: "Portfolio" },
] as const;

type TabId = (typeof tabs)[number]["id"];

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
  const [activeTab, setActiveTab] = useState<TabId>("messages");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [theme, setTheme] = useState<SiteTheme | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);
  const [storageMessage, setStorageMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [portfolioResponse, settingsResponse] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/admin/settings"),
      ]);

      if (portfolioResponse.status === 401 || settingsResponse.status === 401) {
        router.push("/admin/login");
        return;
      }

      const portfolioData = await portfolioResponse.json();
      const settingsData = await settingsResponse.json();

      setItems(portfolioData);
      setMessages(settingsData.messages || []);
      setContent(settingsData.content);
      setTheme(settingsData.theme);
      setStorageConfigured(Boolean(settingsData.storageConfigured));
      setStorageMessage(settingsData.storage?.message || "");
    } catch {
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function saveContent() {
    if (!content) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setContent(data.content);
      setStorageConfigured(Boolean(data.storage?.persistent));
      setStorageMessage(data.storage?.message || "");
      if (data.persisted) {
        setSuccess("Website text saved.");
      } else {
        setSuccess("Changes updated in this session.");
        setError(
          data.warning ||
            data.saveError ||
            data.storage?.connectionError ||
            "Saved in memory only — Blob storage is not active.",
        );
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function saveTheme() {
    if (!theme) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setTheme(data.theme);
      setStorageConfigured(Boolean(data.storage?.persistent));
      setStorageMessage(data.storage?.message || "");
      if (data.persisted) {
        setSuccess("Colors saved.");
      } else {
        setSuccess("Changes updated in this session.");
        setError(
          data.warning ||
            data.saveError ||
            data.storage?.connectionError ||
            "Saved in memory only — Blob storage is not active.",
        );
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function resetPortfolioForm() {
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
    setActiveTab("portfolio");
  }

  async function handlePortfolioSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(editingId ? `/api/portfolio/${editingId}` : "/api/portfolio", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save item.");
      resetPortfolioForm();
      await loadDashboard();
      setSuccess(editingId ? "Portfolio item updated." : "Portfolio item added.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this portfolio item?")) return;
    const response = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete item.");
      return;
    }
    await loadDashboard();
    setSuccess("Portfolio item deleted.");
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

  if (loading || !content || !theme) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin text-muted" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background section-pad py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
              <ExternalLink size={14} />
              View live website
            </Link>
            <h1 className="section-title mt-4">Site manager</h1>
            <p className="mt-2 text-sm text-muted">
              Update text, colors, portfolio, and read contact messages — all in one place.
            </p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary self-start">
            <LogOut size={14} className="mr-2 inline" />
            Log out
          </button>
        </div>

        {!storageConfigured ? (
          <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {storageMessage || "Storage not connected — changes may reset after redeploy. Enable Vercel Blob in your Vercel project."}
          </div>
        ) : storageMessage ? (
          <div className="mt-6 rounded-lg border border-line bg-surface-warm px-4 py-3 text-sm text-muted">
            {storageMessage}
          </div>
        ) : null}

        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="mt-6 text-sm text-accent-warm">{success}</p> : null}

        <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
                setSuccess("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-foreground text-foreground-light"
                  : "text-muted hover:bg-surface-warm hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.id === "messages" && messages.filter((m) => !m.read).length > 0
                ? ` (${messages.filter((m) => !m.read).length})`
                : ""}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "messages" ? (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-muted">No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className={`rounded-xl border p-5 ${
                      message.read ? "border-line bg-surface" : "border-accent-warm/40 bg-surface-warm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{message.name}</p>
                        <p className="text-sm text-muted">{message.email}</p>
                      </div>
                      <Mail size={16} className="text-muted" />
                    </div>
                    {message.service ? <p className="eyebrow mt-3">{message.service}</p> : null}
                    <p className="mt-3 text-sm leading-7 text-muted">{message.message}</p>
                    <div className="mt-4 flex gap-4">
                      {!message.read ? (
                        <button type="button" className="text-sm text-accent-warm" onClick={() => markMessageRead(message.id)}>
                          Mark as read
                        </button>
                      ) : null}
                      <button type="button" className="text-sm text-red-600" onClick={() => deleteMessage(message.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          ) : null}

          {activeTab === "content" ? (
            <div>
              <AdminContentEditor content={content} onChange={setContent} />
              <button type="button" className="btn-primary mt-8" disabled={saving} onClick={saveContent}>
                {saving ? "Saving..." : "Save website text"}
              </button>
            </div>
          ) : null}

          {activeTab === "colors" ? (
            <div>
              <AdminThemeEditor theme={theme} onChange={setTheme} />
              <button type="button" className="btn-primary mt-8" disabled={saving} onClick={saveTheme}>
                {saving ? "Saving..." : "Save colors"}
              </button>
            </div>
          ) : null}

          {activeTab === "portfolio" ? (
            <div className="grid gap-10 xl:grid-cols-[1fr_1fr]">
              <section className="rounded-xl border border-line bg-surface p-6">
                <h2 className="text-lg font-semibold">{editingId ? "Edit item" : "Add item"}</h2>
                <form onSubmit={handlePortfolioSubmit} className="mt-6 space-y-5">
                  <AdminField label="Title">
                    <AdminInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
                  </AdminField>
                  <AdminField label="Description">
                    <AdminTextarea value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
                  </AdminField>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Type">
                      <CustomSelect
                        value={form.type}
                        onChange={(v) => setForm({ ...form, type: v as PortfolioItem["type"] })}
                        options={[
                          { value: "video", label: "Video" },
                          { value: "photo", label: "Photo" },
                        ]}
                        placeholder="Select type"
                      />
                    </AdminField>
                    <AdminField label="Category">
                      <CustomSelect
                        value={form.category}
                        onChange={(v) => setForm({ ...form, category: v as PortfolioItem["category"] })}
                        options={[
                          { value: "promotional", label: "Promotional" },
                          { value: "event", label: "Event" },
                          { value: "photography", label: "Photography" },
                        ]}
                        placeholder="Select category"
                      />
                    </AdminField>
                  </div>
                  <AdminField label="Media URL" hint="YouTube embed link or image URL.">
                    <AdminInput value={form.mediaUrl} onChange={(v) => setForm({ ...form, mediaUrl: v })} />
                  </AdminField>
                  <AdminField label="Thumbnail URL (optional)">
                    <AdminInput value={form.thumbnailUrl} onChange={(v) => setForm({ ...form, thumbnailUrl: v })} />
                  </AdminField>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update item" : "Add item"}
                  </button>
                  {editingId ? (
                    <button type="button" className="btn-secondary ml-3" onClick={resetPortfolioForm}>
                      Cancel
                    </button>
                  ) : null}
                </form>
              </section>

              <section className="rounded-xl border border-line bg-surface p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">All items</h2>
                  <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={resetPortfolioForm}>
                    <Plus size={14} className="mr-1 inline" />
                    New
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <article key={item.id} className="border-t border-line pt-4">
                      <p className="text-xs uppercase tracking-wide text-muted">
                        {item.type} · {item.category}
                      </p>
                      <h3 className="mt-1 font-medium">{item.title}</h3>
                      <div className="mt-3 flex gap-2">
                        <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => startEdit(item)}>
                          <Pencil size={12} className="mr-1 inline" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={12} className="mr-1 inline" />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
