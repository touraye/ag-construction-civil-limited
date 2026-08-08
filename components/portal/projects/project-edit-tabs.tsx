"use client";

import type { _Project, _ProjectPartner, ProjectPhase } from "@/types";
import ProjectForm from "./project-form";
import PartnersPanel from "./partner-panel";
import TimelinePanel from "./timeline-panel";
import SettingsPanel from "./panels/settings-panel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PaymentsPanel from "./payment-panel";
import { usePortalAuth } from "@/context/portal-auth-context";
import SharePanel from "./panels/share-pannel";

interface Props {
    project: _Project;
    partners: _ProjectPartner[];
    phases: ProjectPhase[];
}

export default function ProjectEditTabs({ project, partners, phases }: Props) {
    const { isSuperAdmin } = usePortalAuth();
    
    return (
        <div className="w-full">
            <Tabs defaultValue="details" className="w-full">

                {/* === Tabs Navigation === */}
                <div className="overflow-x-auto pb-2 mb-6">
                    <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl h-auto flex w-max min-w-full justify-start md:justify-center">

                        {/* Details Tab */}
                        <TabsTrigger
                            value="details"
                            className="rounded-lg px-6 py-2.5 font-semibold text-slate-500 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#0056e0] dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                        >
                            Project Details
                        </TabsTrigger>

                        {/* Partners Tab */}
                        <TabsTrigger
                            value="partners"
                            className="rounded-lg px-6 py-2.5 font-semibold text-slate-500 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#0056e0] dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                        >
                            Partners
                            {partners.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {partners.length}
                                </Badge>
                            )}
                        </TabsTrigger>

                        {/* Timeline Tab */}
                        <TabsTrigger
                            value="timeline"
                            className="rounded-lg px-6 py-2.5 font-semibold text-slate-500 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#0056e0] dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                        >
                            Timeline
                            {phases.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {phases.length}
                                </Badge>
                            )}
                        </TabsTrigger>

                        {/* Payments Tab */}
                        <TabsTrigger
                            value="payments"
                            className="rounded-lg px-6 py-2.5 font-semibold text-slate-500 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#0056e0] dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                        >
                            Payments
                            {phases.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {phases.length}
                                </Badge>
                            )}
                        </TabsTrigger>

                        {/* Share Tab */}
                        {isSuperAdmin && (<TabsTrigger
                            value="share"
                            className="rounded-lg px-6 py-2.5 font-semibold text-slate-500 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#0056e0] dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                        >
                            Share
                        </TabsTrigger>)}

                        {/* Settings Tab */}
                        {isSuperAdmin && (<TabsTrigger
                            value="settings"
                            className="rounded-lg px-6 py-2.5 font-semibold text-slate-500 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#0056e0] dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                        >
                            Settings                           
                        </TabsTrigger>)}

                    </TabsList>
                </div>

                {/* === Tabs Content Areas === */}
                {/* 
          Using mt-0 and outline-none to prevent jarring UI jumps 
          and blue focus rings when switching tabs 
        */}
                <TabsContent value="details" className="mt-0 focus-visible:outline-none">
                    <ProjectForm mode="edit" project={project} />
                </TabsContent>

                <TabsContent value="partners" className="mt-0 focus-visible:outline-none">
                    <PartnersPanel projectId={project.id} partners={partners} />
                </TabsContent>

                <TabsContent value="timeline" className="mt-0 focus-visible:outline-none">
                    <TimelinePanel projectId={project.id} phases={phases} />
                </TabsContent>
                
                <TabsContent value="payments" className="mt-0 focus-visible:outline-none">
                    <PaymentsPanel projectId={project.id}  />
                </TabsContent>

                <TabsContent value="share" className="mt-0 focus-visible:outline-none">
                    <SharePanel projectId={project.id} projectName={project.name} />
                </TabsContent>     

                <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                    <SettingsPanel projectId={project.id} />
                </TabsContent>

            </Tabs>
        </div>
    );
}