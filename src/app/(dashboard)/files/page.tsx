"use client";

import React, { useState, useCallback, useReducer } from "react";
import { Card } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@dashboardpack/core/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dashboardpack/core/components/ui/dropdown-menu";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { EmptyState } from "@dashboardpack/core/components/shared/empty-state";
import { cn } from "@dashboardpack/core/lib/utils";
import {
  Folder,
  File,
  FileText,
  FileSpreadsheet,
  Image,
  FileCode,
  FileArchive,
  Video,
  Star,
  Search,
  Grid3X3,
  List,
  Upload,
  FolderPlus,
  MoreHorizontal,
  Trash2,
  Pencil,
  Download,
  Share2,
  ChevronRight,
  HardDrive,
  Clock,
  Users,
  Home,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import {
  getFiles,
  getStarredFiles,
  getRecentFiles,
  getSharedFiles,
  getStorageUsed,
  getBreadcrumbPath,
  toggleStar,
  renameFile,
  deleteFile,
  createFolder,
  uploadFile,
  formatFileSize,
} from "@dashboardpack/core/lib/data/files";
import type { FileItem, FileType, FileView } from "@dashboardpack/core/lib/data/files";

// ── File icon helper ──

const fileIconMap: Record<FileType, { icon: React.ElementType; color: string }> = {
  folder: { icon: Folder, color: "text-chart-1" },
  document: { icon: FileText, color: "text-chart-2" },
  spreadsheet: { icon: FileSpreadsheet, color: "text-emerald-500" },
  image: { icon: Image, color: "text-chart-4" },
  pdf: { icon: File, color: "text-destructive" },
  code: { icon: FileCode, color: "text-chart-3" },
  archive: { icon: FileArchive, color: "text-amber-600" },
  video: { icon: Video, color: "text-purple-500" },
};

function FileIcon({ type, size = "md" }: { type: FileType; size?: "sm" | "md" | "lg" }) {
  const { icon: Icon, color } = fileIconMap[type] || fileIconMap.document;
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-5 w-5";
  return <Icon className={cn(sizeClass, color)} />;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-02-22T14:00:00.000Z");
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Sidebar navigation type ──

type SidebarSection = "all" | "recent" | "starred" | "shared";

// ── FileSidebar ──

function FileSidebar({
  section,
  onSectionChange,
  className,
}: {
  section: SidebarSection;
  onSectionChange: (s: SidebarSection) => void;
  className?: string;
}) {
  const storage = getStorageUsed();
  const usedPercent = Math.round((storage.used / storage.total) * 100);

  const navItems: { id: SidebarSection; icon: React.ElementType; label: string }[] = [
    { id: "all", icon: FolderOpen, label: "All Files" },
    { id: "recent", icon: Clock, label: "Recent" },
    { id: "starred", icon: Star, label: "Starred" },
    { id: "shared", icon: Users, label: "Shared" },
  ];

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="space-y-1 p-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              section === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <Separator />

      {/* Storage usage */}
      <div className="mt-auto p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            Storage
          </div>
          <Progress value={usedPercent} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {formatFileSize(storage.used)} of {formatFileSize(storage.total)} used
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Breadcrumb ──

function FileBreadcrumb({
  currentFolder,
  onNavigate,
}: {
  currentFolder: string | null;
  onNavigate: (folderId: string | null) => void;
}) {
  const path = getBreadcrumbPath(currentFolder);

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => onNavigate(null)}
        className={cn(
          "flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-muted",
          !currentFolder ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        <Home className="h-3.5 w-3.5" />
        <span>Files</span>
      </button>
      {path.map((item) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <button
            onClick={() => onNavigate(item.id)}
            className={cn(
              "rounded px-1.5 py-0.5 transition-colors hover:bg-muted",
              item.id === currentFolder ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── FileToolbar ──

function FileToolbar({
  view,
  onViewChange,
  search,
  onSearchChange,
  onNewFolder,
  onUpload,
  currentFolder,
  onBack,
}: {
  view: FileView;
  onViewChange: (v: FileView) => void;
  search: string;
  onSearchChange: (s: string) => void;
  onNewFolder: () => void;
  onUpload: () => void;
  currentFolder: string | null;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        {currentFolder && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="relative flex-1">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search files..."
            className="h-9 ps-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-0.5">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => onViewChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => onViewChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={onNewFolder} className="hidden sm:flex">
          <FolderPlus className="me-2 h-4 w-4" />
          New Folder
        </Button>
        <Button size="sm" onClick={onUpload}>
          <Upload className="me-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  );
}

// ── FileContextMenu (dropdown) ──

function FileActions({
  file,
  onRename,
  onDelete,
  onToggleStar,
}: {
  file: FileItem;
  onRename: (f: FileItem) => void;
  onDelete: (f: FileItem) => void;
  onToggleStar: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onToggleStar(file.id)}>
          <Star className={cn("me-2 h-4 w-4", file.starred && "fill-current text-amber-500")} />
          {file.starred ? "Remove star" : "Add star"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRename(file)}>
          <Pencil className="me-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="me-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="me-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(file)} className="text-destructive focus:text-destructive">
          <Trash2 className="me-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Grid View ──

function FileGrid({
  files,
  onOpen,
  onRename,
  onDelete,
  onToggleStar,
}: {
  files: FileItem[];
  onOpen: (f: FileItem) => void;
  onRename: (f: FileItem) => void;
  onDelete: (f: FileItem) => void;
  onToggleStar: (id: string) => void;
}) {
  if (files.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen />}
        title="No files"
        description="This folder is empty. Upload files or create a new folder to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
          onDoubleClick={() => onOpen(file)}
          onClick={() => onOpen(file)}
        >
          {/* Star indicator */}
          {file.starred && (
            <Star className="absolute ltr:left-2 rtl:right-2 top-2 h-3 w-3 fill-amber-500 text-amber-500" />
          )}

          {/* Actions */}
          <div className="absolute ltr:right-1 rtl:left-1 top-1" onClick={(e) => e.stopPropagation()}>
            <FileActions file={file} onRename={onRename} onDelete={onDelete} onToggleStar={onToggleStar} />
          </div>

          {/* Icon */}
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            file.type === "folder" ? "bg-primary/10" : "bg-muted"
          )}>
            <FileIcon type={file.type} size="lg" />
          </div>

          {/* Name */}
          <p className="w-full truncate text-center text-xs font-medium">{file.name}</p>

          {/* Meta */}
          <p className="text-[10px] text-muted-foreground">
            {file.type === "folder" ? formatDate(file.modified) : formatFileSize(file.size)}
          </p>

          {/* Shared badge */}
          {file.shared && (
            <Badge variant="secondary" className="absolute bottom-1 ltr:right-1 rtl:left-1 h-4 px-1 text-[9px]">
              <Users className="me-0.5 h-2.5 w-2.5" />
              {file.sharedWith?.length || 0}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

// ── List View ──

function FileList({
  files,
  onOpen,
  onRename,
  onDelete,
  onToggleStar,
}: {
  files: FileItem[];
  onOpen: (f: FileItem) => void;
  onRename: (f: FileItem) => void;
  onDelete: (f: FileItem) => void;
  onToggleStar: (id: string) => void;
}) {
  if (files.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen />}
        title="No files"
        description="This folder is empty. Upload files or create a new folder to get started."
      />
    );
  }

  return (
    <div className="divide-y">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_120px_40px] gap-2 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid-cols-[1fr_100px_120px_120px_40px]">
        <span>Name</span>
        <span>Size</span>
        <span className="hidden sm:block">Modified</span>
        <span>Shared</span>
        <span />
      </div>

      {/* Rows */}
      {files.map((file) => (
        <div
          key={file.id}
          className="group grid cursor-pointer grid-cols-[1fr_100px_120px_40px] items-center gap-2 px-4 py-2.5 transition-colors hover:bg-muted/50 sm:grid-cols-[1fr_100px_120px_120px_40px]"
          onClick={() => onOpen(file)}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <FileIcon type={file.type} size="sm" />
            <span className="truncate text-sm font-medium">{file.name}</span>
            {file.starred && (
              <Star className="h-3 w-3 shrink-0 fill-amber-500 text-amber-500" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {file.type === "folder" ? "—" : formatFileSize(file.size)}
          </span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            {formatDate(file.modified)}
          </span>
          <span>
            {file.shared && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                <Users className="me-0.5 h-3 w-3" />
                {file.sharedWith?.length || 0}
              </Badge>
            )}
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            <FileActions file={file} onRename={onRename} onDelete={onDelete} onToggleStar={onToggleStar} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dialogs ──

function NewFolderDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RenameDialog({
  file,
  onOpenChange,
  onRename,
}: {
  file: FileItem | null;
  onOpenChange: (o: boolean) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [name, setName] = useState(file?.name || "");

  React.useEffect(() => {
    if (file) setName(file.name);
  }, [file]);

  function handleRename() {
    if (!file || !name.trim()) return;
    onRename(file.id, name.trim());
    onOpenChange(false);
  }

  return (
    <Dialog open={!!file} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New name"
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleRename} disabled={!name.trim()}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpload: (name: string, size: number) => void;
}) {
  // Simulated upload — in a real app this would handle actual file input
  const mockFiles = [
    { name: "presentation.pdf", size: 4194304 },
    { name: "screenshot.png", size: 2097152 },
    { name: "data-export.csv", size: 524288 },
    { name: "styles.css", size: 32768 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Dropzone */}
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Drop files here or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">Supports all file types up to 100MB</p>
            </div>
          </div>

          {/* Quick-add mock files */}
          <div className="mt-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Quick add (demo):</p>
            {mockFiles.map((f) => (
              <button
                key={f.name}
                onClick={() => {
                  onUpload(f.name, f.size);
                  onOpenChange(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <FileIcon type="document" size="sm" />
                <span className="flex-1 text-start">{f.name}</span>
                <span className="text-xs text-muted-foreground">{formatFileSize(f.size)}</span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──

export default function FilesPage() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [section, setSection] = useState<SidebarSection>("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [view, setView] = useState<FileView>("grid");
  const [search, setSearch] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

  // Get files based on current section
  const currentFiles = useCallback(() => {
    if (search) return getFiles(null, search);
    switch (section) {
      case "recent": return getRecentFiles(20);
      case "starred": return getStarredFiles();
      case "shared": return getSharedFiles();
      default: return getFiles(currentFolder);
    }
  }, [section, currentFolder, search]);

  const fileList = currentFiles();

  const handleOpen = useCallback((file: FileItem) => {
    if (file.type === "folder") {
      setCurrentFolder(file.id);
      setSection("all");
      setSearch("");
      setShowMobileSidebar(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (!currentFolder) return;
    const current = getBreadcrumbPath(currentFolder);
    if (current.length > 1) {
      setCurrentFolder(current[current.length - 2].id);
    } else {
      setCurrentFolder(null);
    }
  }, [currentFolder]);

  const handleSectionChange = useCallback((s: SidebarSection) => {
    setSection(s);
    setCurrentFolder(null);
    setSearch("");
    setShowMobileSidebar(false);
  }, []);

  const handleToggleStar = useCallback((id: string) => {
    toggleStar(id);
    forceUpdate();
  }, [forceUpdate]);

  const handleRename = useCallback((id: string, name: string) => {
    renameFile(id, name);
    forceUpdate();
  }, [forceUpdate]);

  const handleDelete = useCallback((file: FileItem) => {
    deleteFile(file.id);
    forceUpdate();
  }, [forceUpdate]);

  const handleCreateFolder = useCallback((name: string) => {
    createFolder(name, currentFolder);
    forceUpdate();
  }, [currentFolder, forceUpdate]);

  const handleUpload = useCallback((name: string, size: number) => {
    uploadFile(name, size, currentFolder);
    forceUpdate();
  }, [currentFolder, forceUpdate]);

  // Section title
  const sectionTitle = section === "all"
    ? currentFolder
      ? getBreadcrumbPath(currentFolder).pop()?.name || "Files"
      : "All Files"
    : section === "recent" ? "Recent" : section === "starred" ? "Starred" : "Shared";

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="File Manager"
          description="Manage your files and folders"
        />
      </div>

      <Card className="flex h-[calc(100vh-12rem)] overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "w-56 shrink-0 border-e",
          showMobileSidebar ? "flex" : "hidden md:flex"
        )}>
          <FileSidebar section={section} onSectionChange={handleSectionChange} />
        </div>

        {/* Main area */}
        <div className={cn(
          "flex flex-1 flex-col overflow-hidden",
          showMobileSidebar ? "hidden md:flex" : "flex"
        )}>
          {/* Toolbar */}
          <FileToolbar
            view={view}
            onViewChange={setView}
            search={search}
            onSearchChange={setSearch}
            onNewFolder={() => setShowNewFolder(true)}
            onUpload={() => setShowUpload(true)}
            currentFolder={currentFolder}
            onBack={handleBack}
          />

          {/* Breadcrumb (only in "all files" mode) */}
          {section === "all" && !search && (
            <div className="border-b px-4 pb-3">
              <FileBreadcrumb currentFolder={currentFolder} onNavigate={setCurrentFolder} />
            </div>
          )}

          {/* Section label for non-"all" sections */}
          {section !== "all" && !search && (
            <div className="border-b px-4 pb-3">
              <div className="flex items-center gap-2">
                {section === "recent" && <Clock className="h-4 w-4 text-muted-foreground" />}
                {section === "starred" && <Star className="h-4 w-4 text-amber-500" />}
                {section === "shared" && <Users className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium">{sectionTitle}</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">{fileList.length}</Badge>
              </div>
            </div>
          )}

          {/* Mobile back to sidebar */}
          <div className="flex items-center gap-2 border-b px-4 py-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileSidebar(true)}
            >
              <ArrowLeft className="me-2 h-4 w-4" />
              Back
            </Button>
            <span className="text-sm font-medium">{sectionTitle}</span>
          </div>

          {/* File display */}
          <div className="flex-1 overflow-y-auto">
            {view === "grid" ? (
              <FileGrid
                files={fileList}
                onOpen={handleOpen}
                onRename={setRenamingFile}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
              />
            ) : (
              <FileList
                files={fileList}
                onOpen={handleOpen}
                onRename={setRenamingFile}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Dialogs */}
      <NewFolderDialog
        open={showNewFolder}
        onOpenChange={setShowNewFolder}
        onCreate={handleCreateFolder}
      />
      <RenameDialog
        file={renamingFile}
        onOpenChange={() => setRenamingFile(null)}
        onRename={handleRename}
      />
      <UploadDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        onUpload={handleUpload}
      />
    </>
  );
}
