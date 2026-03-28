"use client";

import { useState } from "react";

type Props = {
  content: string;
  onReplace: (searchTerm: string, replaceTerm: string, replaceAll: boolean, useRegex: boolean) => void;
  onClose: () => void;
};

export default function SearchReplace({ content, onReplace, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matches, setMatches] = useState<number>(0);

  const findMatches = (term: string) => {
    if (!term) {
      setMatches(0);
      return;
    }

    try {
      if (useRegex) {
        const flags = caseSensitive ? "g" : "gi";
        const regex = new RegExp(term, flags);
        const found = content.match(regex);
        setMatches(found ? found.length : 0);
      } else {
        const flags = caseSensitive ? "g" : "gi";
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, flags);
        const found = content.match(regex);
        setMatches(found ? found.length : 0);
      }
    } catch (e) {
      setMatches(0);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    findMatches(term);
  };

  const handleReplace = (all: boolean) => {
    if (!searchTerm) return;
    onReplace(searchTerm, replaceTerm, all, useRegex);
    findMatches(searchTerm);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="card bg-black/95 border-white/20 p-6 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Search & Replace</h3>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/70 mb-1 block">Search for:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter search term..."
              className="input"
              autoFocus
            />
            {searchTerm && (
              <div className="text-xs text-white/60 mt-1">
                Found {matches} match{matches !== 1 ? "es" : ""}
              </div>
            )}
          </div>

          {/* Replace Input */}
          <div>
            <label className="text-xs text-white/70 mb-1 block">Replace with:</label>
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Enter replacement text..."
              className="input"
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => {
                  setCaseSensitive(e.target.checked);
                  findMatches(searchTerm);
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-white/80">Case sensitive</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => {
                  setUseRegex(e.target.checked);
                  findMatches(searchTerm);
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-white/80">Use regex</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleReplace(false)}
              disabled={!searchTerm || matches === 0}
              className="btn btn-soft flex-1"
            >
              Replace Next
            </button>
            <button
              onClick={() => handleReplace(true)}
              disabled={!searchTerm || matches === 0}
              className="btn btn-primary flex-1"
            >
              Replace All ({matches})
            </button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-[10px] text-white/40 pt-2 border-t border-white/10">
            <strong>Tips:</strong> Use regex for patterns like <code className="px-1 bg-white/10 rounded">\d+</code> (numbers) or <code className="px-1 bg-white/10 rounded">\w+</code> (words)
          </div>
        </div>
      </div>
    </div>
  );
}
