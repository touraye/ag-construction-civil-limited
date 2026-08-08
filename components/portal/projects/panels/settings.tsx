"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";
import {
    Shield, UserPlus, Trash2, Link as LinkIcon,
    MessageSquare, Mail, Smartphone, Key, Eye, Edit3, Send
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Props {
    projectId: string;
}

// --- Framer Motion Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SettingsPanel({ projectId }: Props) {
    // --- UI Boilerplate States ---
    const [ isGenerating, setIsGenerating ] = useState(false);
    const [ trackingUrl, setTrackingUrl ] = useState("");

    // Mock Data for UI presentation
    const [ assignedManagers, setAssignedManagers ] = useState([
        { id: "1", name: "Sarah Jenkins", email: "sarah@conztru.com" }
    ]);

    const [ mockTickets, setMockTickets ] = useState([
        { id: "tk-001", code: "AGCCL-8X9P", sentVia: "WhatsApp", date: "Jul 1, 2026" }
    ]);

    // --- Placeholder Handlers ---
    const handleAssignManager = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Manager assigned successfully (Boilerplate)");
    };

    const handleRemoveManager = (id: string) => {
        toast.success("Manager removed (Boilerplate)");
        setAssignedManagers(prev => prev.filter(m => m.id !== id));
    };

    const handleGenerateTracking = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setTrackingUrl(`https://agconstructions.com/track/${code}`);
            setIsGenerating(false);
            toast.success("Unique tracking link generated!");
        }, 800);
    };

    const handleSendUpdate = (method: "email" | "whatsapp") => {
        if (!trackingUrl) return toast.error("Generate a tracking link first.");
        toast.success(`Update sent to client via ${method} (Boilerplate)`);
        setMockTickets([ { id: Math.random().toString(), code: trackingUrl.split('/').pop()!, sentVia: method, date: "Just now" }, ...mockTickets ]);
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-8"
        >

            {/* === 1. PERSONNEL & ASSIGNMENTS === */}
            <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
                        <div className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-[#0056e0]" />
                            <CardTitle className="text-xl">Project Management</CardTitle>
                        </div>
                        <CardDescription>Assign internal staff to oversee this project.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Assignment Form */}
                        <form onSubmit={handleAssignManager} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Project Manager</Label>
                                <Select>
                                    <SelectTrigger className="dark:bg-slate-900">
                                        <SelectValue placeholder="Select an admin/manager..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sarah">Sarah Jenkins</SelectItem>
                                        <SelectItem value="michael">Michael Chen</SelectItem>
                                        <SelectItem value="elena">Elena Rodriguez</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="bg-[#0056e0] hover:bg-[#0048c2] text-white">
                                Assign Manager
                            </Button>
                        </form>

                        {/* Current Managers List */}
                        <div className="space-y-3">
                            <Label className="text-slate-500">Currently Assigned</Label>
                            {assignedManagers.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No managers assigned yet.</p>
                            ) : (
                                assignedManagers.map(manager => (
                                    <div key={manager.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{manager.name}</p>
                                            <p className="text-xs text-slate-500">{manager.email}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveManager(manager.id)} className="text-slate-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>

                    </CardContent>
                </Card>
            </motion.div>

            {/* === 2. CLIENT COMMUNICATIONS & TICKETS === */}
            <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-[#FF5E14]" />
                            <CardTitle className="text-xl">Client Portal & Updates</CardTitle>
                        </div>
                        <CardDescription>Manage the client profile and send secure progress tracking links.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* Left Col: Client Info & Generator */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Client Contact Name</Label>
                                    <Input defaultValue="John Doe" className="dark:bg-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client Phone (WhatsApp)</Label>
                                    <Input defaultValue="+1 555-019-2834" className="dark:bg-slate-900" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Client Email</Label>
                                    <Input type="email" defaultValue="johndoe@horizondev.com" className="dark:bg-slate-900" />
                                </div>
                            </div>

                            <div className="p-4 bg-[#F5F7FA] dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-[#00103A] dark:text-white">Secure Tracking Link</Label>
                                    <Button variant="outline" size="sm" onClick={handleGenerateTracking} disabled={isGenerating}>
                                        <LinkIcon className="w-3 h-3 mr-2" />
                                        {isGenerating ? "Generating..." : "Generate New Code"}
                                    </Button>
                                </div>
                                {trackingUrl && (
                                    <div className="flex flex-col gap-3 pt-2">
                                        <Input readOnly value={trackingUrl} className="font-mono text-xs bg-white dark:bg-slate-950 text-[#0056e0]" />
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleSendUpdate('whatsapp')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                                                <Smartphone className="w-4 h-4 mr-2" /> Send WhatsApp
                                            </Button>
                                            <Button onClick={() => handleSendUpdate('email')} className="flex-1 bg-[#00103A] hover:bg-black text-white">
                                                <Mail className="w-4 h-4 mr-2" /> Send Email
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Col: Sent Tickets Log */}
                        <div className="space-y-3">
                            <Label className="text-slate-500">Update History (Tickets)</Label>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Access Code</th>
                                            <th className="px-4 py-3 font-semibold">Sent Via</th>
                                            <th className="px-4 py-3 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950">
                                        {mockTickets.map((ticket, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-mono font-medium text-[#0056e0]">{ticket.code}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className={ticket.sentVia === 'WhatsApp' ? 'text-emerald-500 border-emerald-200' : 'text-slate-600 dark:text-slate-300'}>
                                                        {ticket.sentVia}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 text-xs">{ticket.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>

            {/* === 3. PROJECT PERMISSIONS === */}
            <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <CardTitle className="text-xl">Access & Permissions</CardTitle>
                        </div>
                        <CardDescription>Control who can view and edit sensitive project data.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-[#0056e0]">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <div>
                                    <Label className="text-base font-semibold">Client Financial Visibility</Label>
                                    <p className="text-xs text-slate-500">Allow the client to view the &quot;Payments&quot; tab via their tracking link.</p>
                                </div>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                                    <Edit3 className="w-5 h-5" />
                                </div>
                                <div>
                                    <Label className="text-base font-semibold">Manager Financial Edit Access</Label>
                                    <p className="text-xs text-slate-500">Allow assigned Project Managers to add/edit payment milestones.</p>
                                </div>
                            </div>
                            <Switch className="data-[state=checked]:bg-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <Label className="text-base font-semibold">Require Auth for Tracking</Label>
                                    <p className="text-xs text-slate-500">Clients must enter their email address alongside the tracking code to view progress.</p>
                                </div>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                        </div>

                    </CardContent>
                </Card>
            </motion.div>

        </motion.div>
    );
}