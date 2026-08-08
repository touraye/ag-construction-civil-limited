"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, MessageCircle, Mail, Ban, Plus,
    MoreHorizontal, Edit, Trash2, Link as LinkIcon, Loader2,
    ChevronLeft, ChevronRight, Clock
} from "lucide-react";
import type { ProjectShareToken } from "@/types";

import { getProjectShareTokens, createShareToken, revokeShareToken } from "@/app/(portal)/portal/actions/project/share-tokens";
import { sendShareEmail } from "@/app/(portal)/portal/actions/project/send-share-email";
import { buildWhatsAppShareUrl } from "@/lib/utils/share-links";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    projectId: string;
    projectName: string;
}

const VALIDITY_OPTIONS = [
    { label: "24 hours", hours: 24 },
    { label: "48 hours", hours: 48 },
    { label: "7 days", hours: 168 },
    { label: "30 days", hours: 720 },
];

const ITEMS_PER_PAGE = 4;

export default function SharePanel({ projectId, projectName }: Props) {
    const [ tokens, setTokens ] = useState<ProjectShareToken[]>([]);
    const [ loading, setLoading ] = useState(true);

    // UI States
    const [ showForm, setShowForm ] = useState(false);
    const [ creating, setCreating ] = useState(false);
    const [ copiedId, setCopiedId ] = useState<string | null>(null);

    // Pagination & Filtering
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ sortOrder, setSortOrder ] = useState<"newest" | "oldest">("newest");

    // Forms
    const [ form, setForm ] = useState({
        label: "",
        include_financials: false,
        validity_hours: 168,
        max_uses: "",
    });

    // Send dialogs
    const [ sendingTokenId, setSendingTokenId ] = useState<string | null>(null);
    const [ activeSendMethod, setActiveSendMethod ] = useState<"whatsapp" | "email" | null>(null);
    const [ emailAddress, setEmailAddress ] = useState("");
    const [ whatsappPhone, setWhatsappPhone ] = useState("");
    const [ sendingEmail, setSendingEmail ] = useState(false);

    const loadTokens = useCallback(async () => {
        setLoading(true);
        const result = await getProjectShareTokens(projectId);
        setLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }
        setTokens(result.data);
    }, [ projectId ]);

    useEffect(() => { loadTokens(); }, [ loadTokens ]);

    // --- Filtering & Pagination ---
    const sortedTokens = useMemo(() => {
        const sorted = [ ...tokens ];
        // Reverses array assuming backend returns oldest first, or just relies on array index
        return sortOrder === "newest" ? sorted : sorted.reverse();
    }, [ tokens, sortOrder ]);

    const totalPages = Math.ceil(sortedTokens.length / ITEMS_PER_PAGE);
    const paginatedTokens = sortedTokens.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // --- Core Functionalities (Unchanged) ---
    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);

        const result = await createShareToken({
            project_id: projectId,
            label: form.label || undefined,
            include_financials: form.include_financials,
            validity_hours: form.validity_hours,
            max_uses: form.max_uses ? Number(form.max_uses) : undefined,
        });

        setCreating(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(result.message ?? "Share link created");
        setTokens((prev) => [ result.data, ...prev ]);
        setForm({ label: "", include_financials: false, validity_hours: 168, max_uses: "" });
        setShowForm(false);
    }

    async function handleRevoke(id: string) {
        if (!confirm("Revoke this share link? The client will no longer be able to access it.")) return;

        const result = await revokeShareToken(id, projectId);
        if (!result.success) { toast.error(result.error); return; }

        toast.success(result.message ?? "Link revoked");
        setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, revoked: true } : t)));
    }

    function getShareUrl(token: string) {
        return `${window.location.origin}/share/${projectId}?code=${token}`;
    }

    async function handleCopy(shareToken: ProjectShareToken) {
        await navigator.clipboard.writeText(getShareUrl(shareToken.token));
        setCopiedId(shareToken.id);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    }

    function handleSendWhatsApp(shareToken: ProjectShareToken) {
        if (!whatsappPhone.trim()) { toast.error("Enter a phone number first"); return; }

        const url = buildWhatsAppShareUrl({
            phone: whatsappPhone.replace(/\D/g, ""),
            projectName,
            shareUrl: getShareUrl(shareToken.token),
            token: shareToken.token,
            expiresAt: shareToken.expires_at,
        });

        window.open(url, "_blank");
        toast.success("Opening WhatsApp...");
        setSendingTokenId(null);
        setActiveSendMethod(null);
        setWhatsappPhone("");
    }

    async function handleSendEmail(shareToken: ProjectShareToken) {
        if (!emailAddress.trim()) { toast.error("Enter an email address first"); return; }

        setSendingEmail(true);
        const result = await sendShareEmail({
            to: emailAddress,
            projectName,
            shareUrl: getShareUrl(shareToken.token),
            token: shareToken.token,
            expiresAt: shareToken.expires_at,
        });
        setSendingEmail(false);

        if (!result.success) { toast.error(result.error); return; }

        toast.success(result.message ?? "Email sent");
        setSendingTokenId(null);
        setActiveSendMethod(null);
        setEmailAddress("");
    }

    function getTokenStatus(token: ProjectShareToken) {
        if (token.revoked) return { label: "Revoked", className: "bg-red-500/10 text-red-500 border-red-500/20" };
        if (new Date(token.expires_at) < new Date()) return { label: "Expired", className: "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700" };
        if (token.max_uses !== null && token.use_count >= token.max_uses) return { label: "Limit reached", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
        return { label: "Active", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
    }

    // === LOADING SKELETON ===
    if (loading) {
        return (
            <div className="w-full space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    {[ 1, 2, 3 ].map(i => (
                        <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">

            {/* === HEADER & FILTERS === */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        Client Share Links
                    </h3>
                    <p className="text-slate-500 text-sm">
                        Generate secure, time-limited links for clients to view project progress.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Select value={sortOrder} onValueChange={(val: any) => { setSortOrder(val); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[140px] h-9 dark:bg-slate-900">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setShowForm(true)} className="bg-[#0056e0] hover:bg-[#0048c2] text-white h-9">
                        <Plus className="w-4 h-4 mr-2" /> Generate Link
                    </Button>
                </div>
            </div>

            {/* === CREATE LINK MODAL (DIALOG) === */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle>Generate Share Link</DialogTitle>
                        <DialogDescription>Create a secure access token for {projectName}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Label (optional)</Label>
                            <Input placeholder="e.g. Sent to James Mensah" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="dark:bg-slate-900" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Validity Period</Label>
                                <Select value={form.validity_hours.toString()} onValueChange={v => setForm({ ...form, validity_hours: Number(v) })}>
                                    <SelectTrigger className="dark:bg-slate-900"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {VALIDITY_OPTIONS.map(opt => <SelectItem key={opt.hours} value={opt.hours.toString()}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Max Uses (optional)</Label>
                                <Input type="number" min={1} placeholder="Unlimited" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} className="dark:bg-slate-900" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <Switch checked={form.include_financials} onCheckedChange={c => setForm({ ...form, include_financials: c })} className="data-[state=checked]:bg-[#0056e0]" />
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold cursor-pointer" onClick={() => setForm({ ...form, include_financials: !form.include_financials })}>Include Financials</Label>
                                <p className="text-xs text-slate-500">Show contract value, payments, and balance.</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={creating}>Cancel</Button>
                            <Button type="submit" disabled={creating} className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                {creating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : "Generate Link"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* === TOKENS LIST === */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {paginatedTokens.map((token) => {
                        const status = getTokenStatus(token);
                        const isActive = status.label === "Active";

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                key={token.id}
                                className="p-5 md:p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                            >
                                {/* Header Row */}
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                                <LinkIcon className="w-4 h-4 text-[#0056e0]" />
                                                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wider">
                                                    {token.token}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                        </div>
                                        {token.label && <div className="text-slate-500 text-sm mt-1">{token.label}</div>}
                                    </div>

                                    {/* Actions Button (Dropdown) */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>Link Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleCopy(token)} className="cursor-pointer">
                                                <Copy className="w-4 h-4 mr-2 text-slate-500" /> Copy Link
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setSendingTokenId(token.id); setActiveSendMethod("whatsapp"); }} className="cursor-pointer">
                                                <MessageCircle className="w-4 h-4 mr-2 text-slate-500" /> Send WhatsApp
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setSendingTokenId(token.id); setActiveSendMethod("email"); }} className="cursor-pointer">
                                                <Mail className="w-4 h-4 mr-2 text-slate-500" /> Send Email
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            {/* Non-Functional Buttons as requested */}
                                            <DropdownMenuItem disabled className="cursor-not-allowed text-slate-400">
                                                <Edit className="w-4 h-4 mr-2" /> Edit Link
                                            </DropdownMenuItem>
                                            <DropdownMenuItem disabled className="cursor-not-allowed text-slate-400">
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete Link
                                            </DropdownMenuItem>

                                            {isActive && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleRevoke(token.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                                                        <Ban className="w-4 h-4 mr-2" /> Revoke Access
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span>Expires: {new Date(token.expires_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>Used: {token.use_count}{token.max_uses ? ` / ${token.max_uses}` : " (unlimited)"}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className={token.include_financials ? "text-[#0056e0]" : ""}>
                                        Financials: {token.include_financials ? "Included" : "Hidden"}
                                    </span>
                                </div>

                                {/* Expandable Send Panels */}
                                <AnimatePresence>
                                    {sendingTokenId === token.id && activeSendMethod && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                            className="pt-2 overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                                                {activeSendMethod === "whatsapp" ? (
                                                    <>
                                                        <Input type="tel" placeholder="Phone (e.g. 2207123456)" value={whatsappPhone} onChange={e => setWhatsappPhone(e.target.value)} className="bg-white dark:bg-slate-950" />
                                                        <Button onClick={() => handleSendWhatsApp(token)} className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0">
                                                            Send WhatsApp
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Input type="email" placeholder="client@email.com" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} className="bg-white dark:bg-slate-950" />
                                                        <Button onClick={() => handleSendEmail(token)} disabled={sendingEmail} className="bg-[#0056e0] hover:bg-[#0048c2] text-white shrink-0">
                                                            {sendingEmail ? "Sending..." : "Send Email"}
                                                        </Button>
                                                    </>
                                                )}
                                                <Button variant="ghost" onClick={() => { setSendingTokenId(null); setActiveSendMethod(null); }}>Cancel</Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {tokens.length === 0 && (
                    <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950">
                        <LinkIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium text-lg">No share links generated yet.</p>
                        <p className="text-slate-400 text-sm mt-1">Generate a link to give clients secure, read-only access to progress.</p>
                    </div>
                )}
            </div>

            {/* === PAGINATION === */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="text-sm font-medium text-slate-500 px-4">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

        </div>
    );
}