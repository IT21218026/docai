"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Reorder } from "framer-motion";
import { Code2, Folder } from "lucide-react";
import * as React from "react";
import { create } from "zustand";
import { Card } from "@/components/ui/card";
import type { FileIconConfig } from "@/core/config/file-icons";
import { cn } from "../../../lib/utils";
import FileViewer from "./file-viewer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
import DocumentPipeline from "../pipeline/documentation/DocumentPipeline";
import Documentation from "./Documentation";
import { useSearchParams } from "next/navigation";
import VisualAid from "../visualaid/VisualAid";

/* --------------------------------------------------
 * File Icons
 * -------------------------------------------------- */
const getFileIcon = (fileName: string) => {
  if (fileName.endsWith(".tsx")) return <Icon icon="logos:react" />;
  if (fileName.endsWith(".ts")) return <Icon icon="logos:typescript-icon" />;
  if (fileName.endsWith(".js")) return <Icon icon="logos:javascript" />;
  if (fileName.endsWith(".json")) return <Icon icon="logos:javascript" />;
  if (fileName.endsWith(".git")) return <Icon icon="logos:git" />;
  if (fileName.endsWith("global.css"))
    return <Icon icon="logos:css-3-official" />;
  if (fileName.endsWith(".css")) return <Icon icon="logos:css-3-official" />;
  // Fallback icon
  return <Icon icon="mdi:file" />;
};

/* --------------------------------------------------
 * File Tree Types
 * -------------------------------------------------- */
interface FileExplorer {
  name: string;
  type: "file" | "directory";
  children?: FileExplorer[];
  content?: string;
  language?: string;
}

interface IDEProps {
  root: FileExplorer;
  theme?: "light" | "dark" | "system";
  defaultCollapsed?: boolean;
  defaultOpen?: boolean;
  maxFilesOpen?: number;
  folderColor?: string;
  defaultSelectedPath?: string;
  colorfulIcons?: boolean;
  defaultSettings?: Partial<SettingsState>;
  rootName?: string;
  showIndentGuides?: boolean;
  customIcons?: (fileName: string) => FileIconConfig;
}

/* --------------------------------------------------
 * Zustand Store
 * -------------------------------------------------- */
interface FileStoreState {
  expandedPaths: Set<string>;
  selectedPath: string | null;
  toggleExpanded: (path: string) => void;
  setSelectedPath: (path: string) => void;
  openedFiles: string[];
  setOpenedFiles: (files: string[]) => void;
}

const useFileStore = create<FileStoreState>((set) => ({
  expandedPaths: new Set<string>(),
  selectedPath: null,
  toggleExpanded: (path: string) =>
    set((state) => {
      const newExpanded = new Set(state.expandedPaths);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return { expandedPaths: newExpanded };
    }),
  setSelectedPath: (path) => set({ selectedPath: path }),
  openedFiles: [],
  setOpenedFiles: (files) => set({ openedFiles: files }),
}));

/* --------------------------------------------------
 * Utility: Check for Binary Files
 * -------------------------------------------------- */
type BinaryFileTypes =
  | ".ico"
  | ".woff"
  | ".woff2"
  | ".ttf"
  | ".eot"
  | ".png"
  | ".jpg"
  | ".jpeg"
  | ".gif"
  | ".webp";

const isBinaryFile = (fileName: string): boolean => {
  const extension = fileName
    .slice(fileName.lastIndexOf("."))
    .toLowerCase() as BinaryFileTypes;
  const binaryExtensions: BinaryFileTypes[] = [
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
  ];
  return binaryExtensions.includes(extension);
};

/* --------------------------------------------------
 * Settings
 * -------------------------------------------------- */
type SettingsState = {
  theme: "light" | "dark" | "system";
  colorfulIcons: boolean;
  fontSize: number;
  activeTabColor: "blue" | "purple" | "pink" | "green" | "orange";
  lineNumbers: boolean;
  wordWrap: boolean;
  showIndentGuides: boolean;
};

/* --------------------------------------------------
 * IDE Component
 * -------------------------------------------------- */
export default function IDE({
  root,
  theme = "light", // Default to light
  defaultCollapsed = false,
  defaultOpen = true,
  maxFilesOpen = 5,
  defaultSelectedPath,
  colorfulIcons = false,
  defaultSettings = {},
  rootName = "project-root",
}: IDEProps) {
  // Initialize settings with defaults
  const [settings, setSettings] = React.useState<SettingsState>({
    theme: theme,
    colorfulIcons: colorfulIcons,
    fontSize: 13,
    activeTabColor: "blue",
    lineNumbers: true,
    wordWrap: false,
    showIndentGuides: true,
    ...defaultSettings,
  });

  const searchParams = useSearchParams();
  const feature = searchParams.get("feature");

  const { selectedPath, openedFiles, setSelectedPath, setOpenedFiles } =
    useFileStore();

  React.useEffect(() => {
    if (defaultSelectedPath) {
      setSelectedPath(defaultSelectedPath);
    }
  }, [defaultSelectedPath, setSelectedPath]);

  const handleCloseFile = (path: string) => {
    setOpenedFiles(openedFiles.filter((f) => f !== path));
    // If the currently selected file was closed, switch to the previous file.
    if (selectedPath === path) {
      setSelectedPath(openedFiles[openedFiles.length - 2]);
    }
  };

  // Recursively locate file content by path
  const findFileContent = (
    node: FileExplorer,
    targetPath: string
  ): { content?: string; language?: string } | null => {
    const nodePath = `/${node.name}`;
    if (nodePath === targetPath) {
      return { content: node.content, language: node.language };
    }
    if (node.children) {
      for (const child of node.children) {
        // Strip matched portion of path before recursing
        const result = findFileContent(child, targetPath.replace(nodePath, ""));
        if (result) return result;
      }
    }
    return null;
  };

  // Get content of selected file
  const selectedFile = selectedPath
    ? findFileContent(root, selectedPath)
    : null;

  return (
    <Card
      className={cn(
        "w-full h-screen max-h-[92vh] overflow-hidden rounded-none border",
        // Light theme styles:
        "bg-white border-gray-300 text-gray-800"
      )}
    >
      <ResizablePanelGroup direction="horizontal" className="max-w-full border-gray-300">
        {/* Left Sidebar: File Tree */}
        <ResizablePanel defaultSize={100}>
          <div className="max-h-[92vh] overflow-y-auto overflow-x-hidden">
            <Reorder.Group axis="y" values={[root]} onReorder={() => {}}>
              <FileTree
                item={root}
                defaultCollapsed={defaultCollapsed}
                defaultOpen={defaultOpen}
                maxFilesOpen={maxFilesOpen}
                folderColor="text-gray-400"
                colorfulIcons={settings.colorfulIcons}
                rootName={rootName}
                showIndentGuides={settings.showIndentGuides}
                handleFileSelect={(path: string) => {
                  // This is provided in the code, but not used in the snippet
                  // If needed, implement your own logic here
                  setSelectedPath(path);
                }}
              />
            </Reorder.Group>
          </div>
        </ResizablePanel>

        <ResizableHandle className="border-gray-300" />

        {/* Middle: File Viewer */}
        <ResizablePanel defaultSize={500}>
          <div className="flex-1 bg-white">
            {selectedFile?.content ? (
              <FileViewer
                content={selectedFile.content}
                language={selectedFile.language}
                theme={"light"} // Force to light if desired
                openedFiles={openedFiles}
                selectedPath={selectedPath}
                onCloseFile={handleCloseFile}
                onSelectFile={setSelectedPath}
                fontSize={settings.fontSize}
                activeTabColor={settings.activeTabColor}
                lineNumbers={settings.lineNumbers}
                wordWrap={settings.wordWrap}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Code2 size={24} className="text-gray-400" />
                </div>
                <div className="items-center space-y-1">
                  <p className="text-sm text-center font-medium">
                    No file selected
                  </p>
                  <p className="text-xs text-center text-gray-500">
                    Select a file from the sidebar to view its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle className="border-gray-300" />

        {/* Conditional Panels */}
        {feature === "documentation" && (
          <ResizablePanel defaultSize={500}>
            <div className="max-h-[92vh] overflow-y-auto bg-white">
              <DocumentPipeline />
            </div>
          </ResizablePanel>
        )}

        {feature === "visual" && (
          <ResizablePanel defaultSize={500}>
            <div className="max-h-[92vh] overflow-y-auto bg-white">
              <VisualAid />
            </div>
          </ResizablePanel>
        )}

        <ResizableHandle className="border-gray-300" />

        {feature === "documentation" && (
          <ResizablePanel defaultSize={500}>
            <div className="max-h-[92vh] overflow-y-auto bg-white">
              <Documentation />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </Card>
  );
}

/* --------------------------------------------------
 * FileTree
 * -------------------------------------------------- */
type FileTreeProps = {
  item: FileExplorer;
  path?: string;
  depth?: number;
  defaultCollapsed: boolean;
  handleFileSelect: (path: string) => void;
  defaultOpen?: boolean;
  maxFilesOpen?: number;
  folderColor?: string;
  colorfulIcons?: boolean;
  rootName?: string;
  showIndentGuides?: boolean;
};

const FileTree: React.FC<FileTreeProps> = ({
  item,
  path = "",
  depth = 0,
  defaultCollapsed,
  handleFileSelect,
  defaultOpen,
  maxFilesOpen,
  folderColor,
  colorfulIcons = false,
  rootName = "project-root",
  showIndentGuides = true,
}: FileTreeProps) => {
  const { selectedPath, setSelectedPath, openedFiles, setOpenedFiles } =
    useFileStore();
  const fullPath = `${path}/${item.name}`;
  const isBinary = item.type === "file" && isBinaryFile(item.name);

  const handleFileOpen = (filePath: string) => {
    if (!openedFiles.includes(filePath)) {
      if (openedFiles.length >= (maxFilesOpen || 5)) {
        const fileToClose = openedFiles[0];
        setOpenedFiles(openedFiles.filter((file) => file !== fileToClose));
      }
      setOpenedFiles([...openedFiles, filePath]);
    }
    setSelectedPath(filePath);
  };

  if (item.type === "directory") {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value={fullPath}>
          <AccordionTrigger
            className={cn(
              "flex items-start gap-2 py-1.5 px-2 text-sm group relative w-full transition-colors",
              "cursor-pointer hover:text-gray-700",
              "text-gray-700"
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            <div className="flex gap-2">
              <Folder className="h-4 w-4" />
              {item.name}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {item.children
              ?.sort((a, b) => {
                // Directories first, then files
                if (a.type === "directory" && b.type === "file") return -1;
                if (a.type === "file" && b.type === "directory") return 1;
                return a.name.localeCompare(b.name);
              })
              .map((child) => (
                <FileTree
                  key={child.name}
                  item={child}
                  path={fullPath}
                  depth={depth + 1}
                  defaultCollapsed={defaultCollapsed}
                  handleFileSelect={handleFileSelect}
                  defaultOpen={defaultOpen}
                  maxFilesOpen={maxFilesOpen}
                  folderColor={folderColor}
                  colorfulIcons={colorfulIcons}
                  rootName={rootName}
                  showIndentGuides={showIndentGuides}
                />
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // File
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1.5 px-2 text-sm group relative w-full transition-colors",
        selectedPath === fullPath
          ? // Highlight the selected file
            "bg-gray-200 text-gray-900"
          : "text-gray-700",
        isBinary ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        !isBinary && "hover:bg-gray-50 hover:text-gray-900"
      )}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
      onClick={() => !isBinary && handleFileOpen(fullPath)}
    >
      {getFileIcon(item.name)}
      <span className="truncate">{item.name}</span>
    </div>
  );
};
