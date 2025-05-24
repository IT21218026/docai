"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Code as DefaultIcon,
  File,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "../../lib/utils";

import { Button } from "@/components/ui/button";
import {
  ANIMATION_VARIANTS,
  COPY_VARIANTS,
  TOAST_VARIANTS,
} from "./animations";

/**
 * Example of a light theme for react-syntax-highlighter
 */
const customLightTheme = {
  'code[class*="language-"]': {
    color: '#24292e',
    background: '#ffffff',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '14px',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#24292e',
    background: '#ffffff',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  comment: {
    color: '#6a737d',
    fontStyle: 'italic',
  },
  punctuation: {
    color: '#24292e',
  },
  property: {
    color: '#005cc5',
  },
  string: {
    color: '#032f62',
  },
  keyword: {
    color: '#d73a49',
  },
  'class-name': {
    color: '#6f42c1',
  },
  function: {
    color: '#6f42c1',
  },
  operator: {
    color: '#d73a49',
  },
  number: {
    color: '#005cc5',
  },
  'attr-name': {
    color: '#005cc5',
  },
  'attr-value': {
    color: '#032f62',
  },
  parameter: {
    color: '#24292e',
  },
  selector: {
    color: '#22863a',
  },
  regex: {
    color: '#032f62',
  },
  variable: {
    color: '#005cc5',
  },
  constant: {
    color: '#005cc5',
  },
  builtin: {
    color: '#005cc5',
  },
};

import * as Icons from "./icons";

/* --------------------------------------------------
 * Helper Functions
 * -------------------------------------------------- */

function getLanguageIcon(language: string) {
  switch (language.toLowerCase()) {
    case "typescript":
      return <Icons.TypescriptIcon size={16} />;
    case "python":
      return <Icons.PythonIcon size={16} />;
    case "rust":
      return <Icons.RustIcon size={16} />;
    case "sql":
    case "drizzle":
      return <Icons.SqlLogo size={16} />;
    default:
      return <DefaultIcon size={16} />;
  }
}

function calculateCodeStats(code: string) {
  if (typeof code !== "string") {
    console.error("Expected code to be a string, but received:", typeof code);
    return { lines: 0, chars: 0, words: 0 };
  }
  const lines = code.split("\n").length;
  const chars = code.length;
  const words = code.trim().split(/\s+/).length;
  return { lines, chars, words };
}

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "custom";

interface BadgeProps {
  variant?: BadgeVariant;
  customColor?: string;
}

function getBadgeClasses({
  variant = "default",
  customColor,
}: BadgeProps): string {
  const baseClasses =
    "px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200";

  if (variant === "custom" && customColor) {
    return `${baseClasses} border border-${customColor}-500/30 bg-${customColor}-500/10 text-${customColor}-400 hover:border-${customColor}-400 hover:text-${customColor}-300`;
  }

  switch (variant) {
    case "primary":
      return `${baseClasses} border border-blue-500/30 bg-blue-500/10 text-blue-600 hover:border-blue-600 hover:text-blue-800`;
    case "secondary":
      return `${baseClasses} border border-purple-500/30 bg-purple-500/10 text-purple-600 hover:border-purple-600 hover:text-purple-800`;
    case "success":
      return `${baseClasses} border border-green-500/30 bg-green-500/10 text-green-600 hover:border-green-600 hover:text-green-800`;
    case "warning":
      return `${baseClasses} border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 hover:border-yellow-600 hover:text-yellow-800`;
    case "danger":
      return `${baseClasses} border border-red-500/30 bg-red-500/10 text-red-600 hover:border-red-600 hover:text-red-800`;
    default:
      // "default" badge = subtle grayscale
      return `${baseClasses} border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200`;
  }
}

type Badge = {
  text: string;
  variant: BadgeVariant;
};

export type CodeBlockProps = {
  code: string;
  language: string;
  fileName?: string;
  badges?: Badge[];
  showLineNumbers?: boolean;
  enableLineHighlight?: boolean;
  showMetaInfo?: boolean;
  maxHeight?: string;
  className?: string;
  onCopy?: (code: string) => void;
  onLineClick?: (lineNumber: number) => void;
  onSearch?: (query: string, results: number[]) => void;
  badgeVariant?: BadgeVariant;
  badgeColor?: string;
  fileNameColor?: string;
  initialSearchQuery?: string;
  initialSearchResults?: number[];
  initialHighlightedLines?: number[];
};

/* --------------------------------------------------
 * CodeBlock Component
 * -------------------------------------------------- */

export function CodeBlock({
  code,
  language,
  fileName,
  badges = [],
  showLineNumbers = true,
  enableLineHighlight = false,
  showMetaInfo = true,
  maxHeight = "600px",
  onCopy,
  onLineClick,
  onSearch,
  badgeVariant = "default",
  badgeColor,
  fileNameColor,
  initialSearchQuery = "",
  initialSearchResults = [],
  initialHighlightedLines = [],
}: CodeBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearching, setIsSearching] = useState(!!initialSearchQuery);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState<number[]>(initialSearchResults);
  const [currentResultIndex, setCurrentResultIndex] = useState(
    initialSearchResults.length > 0 ? 0 : -1
  );
  con
