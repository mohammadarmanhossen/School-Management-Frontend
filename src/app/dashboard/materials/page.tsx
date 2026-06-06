"use client";

import { useState } from "react";
import { Folder, Upload, FileText, File as FileIcon, Video, Download, Trash2, HardDrive } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockStudyMaterials } from "@/lib/mock-data";

export default function StudyMaterialsPage() {
  const [materials] = useState(mockStudyMaterials);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="h-8 w-8 text-rose-500" />;
      case "video": return <Video className="h-8 w-8 text-blue-500" />;
      case "doc": return <FileIcon className="h-8 w-8 text-blue-400" />;
      default: return <FileIcon className="h-8 w-8 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Study Materials"
        description="Upload, organize, and share educational resources with your students."
        breadcrumbs={[
          { label: "Dashboard", href: "/teacher/dashboard" },
          { label: "Study Materials" },
        ]}
        actions={
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        }
      />

      {/* Storage and Upload Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-white/[0.08] bg-zinc-950">
          <CardHeader className="border-b border-white/[0.06] bg-zinc-900/50">
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-blue-400" />
              Storage Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-white">Cloud Storage</span>
                <span className="text-blue-400">4.2 GB / 10 GB</span>
              </div>
              <Progress value={42} className="h-2 bg-zinc-800 [&>div]:bg-blue-500" />
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  PDF Documents
                </div>
                <span className="text-zinc-500 font-medium">1.8 GB</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  Video Lectures
                </div>
                <span className="text-zinc-500 font-medium">2.1 GB</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  Other Files
                </div>
                <span className="text-zinc-500 font-medium">300 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Dropzone Mock */}
        <Card className="md:col-span-2 border-white/[0.08] bg-zinc-950 border-dashed border-2 border-zinc-800 hover:border-blue-500/50 transition-colors group cursor-pointer flex items-center justify-center min-h-[250px]">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Drag & drop files here</p>
              <p className="text-sm text-zinc-400 mt-1">or click to browse from your computer</p>
            </div>
            <p className="text-xs text-zinc-500">Supports PDF, DOCX, MP4, and ZIP files up to 500MB</p>
          </CardContent>
        </Card>
      </div>

      {/* Materials Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Folder className="h-5 w-5 text-zinc-400" />
            Uploaded Resources
          </h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 cursor-pointer">All</Badge>
            <Badge variant="outline" className="border-white/[0.1] text-zinc-400 cursor-pointer">Class 10</Badge>
            <Badge variant="outline" className="border-white/[0.1] text-zinc-400 cursor-pointer">Class 9</Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((item) => (
            <Card key={item.id} className="border-white/[0.08] bg-zinc-950 hover:bg-zinc-900/50 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center">
                    {getFileIcon(item.type)}
                  </div>
                  <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-white/[0.1]">
                    {item.className}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-white line-clamp-1 mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 h-10 mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="w-full bg-zinc-900 border-white/[0.1] hover:bg-white/10 gap-2">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="px-3 bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
