




"use client";

import { useMemo, useState } from "react";
import { UserCheck, UserX, Search, Inbox, CheckCircle, XCircle, AlertCircle } from "lucide-react";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // फ़िक्स किया हुआ सही पाथ

import { useApplicationStore } from "@/store/application-store";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

interface Applicant {
  id: string;
  full_name: string;
  status: "pending" | "accepted" | "rejected";
  class_name?: string;
  subject?: string;
}

/* ---------------- FILTER LOGIC ---------------- */
function filterData(items: Applicant[], search: string, status: StatusFilter) {
  return items.filter((i) => {
    const matchStatus = status === "all" || i.status === status;
    const matchSearch = i.full_name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
}

/* ---------------- BADGE VARIANTS ---------------- */
function getBadgeVariant(status: string) {
  switch (status) {
    case "accepted":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "warning";
  }
}

/* ---------------- PREMIUM DARK CARD ---------------- */
interface CardProps {
  item: Applicant;
  type: "student" | "teacher";
  onAccept: () => void;
  onReject: () => void;
}

function ApplicantCard({ item, type, onAccept, onReject }: CardProps) {
  const initials = item.full_name
    .split(" ")
    .map((n) => n)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="group relative overflow-hidden bg-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70">
      {/* Glow Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          {/* Avatar Container */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 font-semibold text-slate-300 border border-slate-700/60 transition-colors group-hover:bg-indigo-950/50 group-hover:text-indigo-400 group-hover:border-indigo-500/30">
            {initials}
          </div>

          {/* Details Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-100 truncate tracking-tight group-hover:text-white">
                {item.full_name}
              </h3>
              <Badge variant={getBadgeVariant(item.status)} className="capitalize shrink-0 bg-opacity-15">
                {item.status}
              </Badge>
            </div>

            <p className="text-xs font-medium text-slate-400 mt-1">
              {type === "student" ? `Class: ${item.class_name}` : `Subject: ${item.subject}`}
            </p>

            <p className="text-[11px] font-mono text-slate-500 mt-2">
              ID: {item.id}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        {item.status === "pending" && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="h-8 text-xs text-rose-400 border-rose-950 bg-rose-950/20 hover:bg-rose-900/40 hover:text-rose-300 hover:border-rose-500 transition-all"
            >
              <UserX className="w-3.5 h-3.5 mr-1.5" />
              Reject
            </Button>

            <Button
              size="sm"
              onClick={onAccept}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all border border-emerald-500/20"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              Accept
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- MAIN ADMISSIONS PAGE ---------------- */
export default function AdmissionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tab, setTab] = useState("students");

  const { students, teachers, updateStatus } = useApplicationStore();

  const filteredStudents = useMemo(() => filterData(students, search, status), [students, search, status]);
  const filteredTeachers = useMemo(() => filterData(teachers, search, status), [teachers, search, status]);

  const stats = useMemo(() => {
    const allItems = [...students, ...teachers];
    return {
      pending: allItems.filter((i) => i.status === "pending").length,
      accepted: allItems.filter((i) => i.status === "accepted").length,
      rejected: allItems.filter((i) => i.status === "rejected").length,
    };
  }, [students, teachers]);

  return (
    <div className="space-y-6 p-4 md:p-8 bg-black text-slate-100 min-h-screen selection:bg-indigo-500/30">
      {/* HEADER BAR */}
   

      {/* OVERVIEW STATS REGISTRY */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-t-0 border-r-0 border-b-0 border-l-4 border-l-amber-500 bg-slate-900/50 border-slate-800 shadow-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pending</p>
              <p className="text-2xl font-bold text-slate-50">{stats.pending}</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-0 border-r-0 border-b-0 border-l-4 border-l-emerald-500 bg-slate-900/50 border-slate-800 shadow-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accepted</p>
              <p className="text-2xl font-bold text-slate-50">{stats.accepted}</p>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-0 border-r-0 border-b-0 border-l-4 border-l-rose-500 bg-slate-900/50 border-slate-800 shadow-xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rejected</p>
              <p className="text-2xl font-bold text-slate-50">{stats.rejected}</p>
            </div>
            <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS & SEARCH OPERATION CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 shadow-lg backdrop-blur-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by full name..."
            className="pl-9 rounded-lg bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Shadcn Premium Select (Dark Version Integration) */}
        <div className="w-full sm:w-[180px] shrink-0">
          <Select value={status} onValueChange={(val) => setStatus(val as StatusFilter)}>
            <SelectTrigger className="rounded-lg bg-slate-950 border-slate-800 text-slate-300 focus:ring-indigo-500/50">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
              <SelectItem value="all" className="focus:bg-slate-800 focus:text-slate-50">All Status</SelectItem>
              <SelectItem value="pending" className="focus:bg-slate-800 focus:text-slate-50">Pending</SelectItem>
              <SelectItem value="accepted" className="focus:bg-slate-800 focus:text-slate-50">Accepted</SelectItem>
              <SelectItem value="rejected" className="focus:bg-slate-800 focus:text-slate-50">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CORE TABS NAVIGATION SECTION */}
      <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <TabsTrigger value="students" className="px-4 py-1.5 text-xs font-medium rounded-md data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
              Students Registry ({filteredStudents.length})
            </TabsTrigger>
            <TabsTrigger value="teachers" className="px-4 py-1.5 text-xs font-medium rounded-md data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
              Teachers Panel ({filteredTeachers.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* STUDENTS REGISTRY CONTENT */}
        <TabsContent value="students" className="outline-none focus:ring-0">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-6">
              <Inbox className="w-10 h-10 mb-3 text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-300">No student files tracked</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px]">Try adapting your active text query filters or system configurations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.map((s) => (
                <ApplicantCard
                  key={s.id}
                  item={s}
                  type="student"
                  onAccept={() => updateStatus("student", s.id, "accepted")}
                  onReject={() => updateStatus("student", s.id, "rejected")}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TEACHERS REGISTRY CONTENT */}
        <TabsContent value="teachers" className="outline-none focus:ring-0">
          {filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-6">
              <Inbox className="w-10 h-10 mb-3 text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-300">No teacher profiles found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px]">Try adapting your active text query filters or system configurations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTeachers.map((t) => (
                <ApplicantCard
                  key={t.id}
                  item={t}
                  type="teacher"
                  onAccept={() => updateStatus("teacher", t.id, "accepted")}
                  onReject={() => updateStatus("teacher", t.id, "rejected")}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}