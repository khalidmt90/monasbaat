"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import { listHalls } from "@/lib/halls";

export interface TerminalCommand {
  command: string;
  output?: string | React.ReactNode;
}

interface TerminalProps {
  prompt?: string; // e.g. user@mona:~$
  initial?: TerminalCommand[];
  dir?: "rtl" | "ltr";
  className?: string;
}

// Lightweight in-memory command registry
const helpText = `Available commands:\nhelp - show this message\nclear - clear the screen\nls halls - list hall slugs\nhall <slug> - show hall info\ncolor <hex> - demo colored line`;

export default function Terminal({ prompt = "user@monasbaat:~$", initial = [], dir = "ltr", className }: TerminalProps) {
  const [lines, setLines] = useState<TerminalCommand[]>([...initial]);
  const [input, setInput] = useState("");
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll on new line
  useEffect(() => {
    const vp = viewportRef.current;
    if (vp) vp.scrollTop = vp.scrollHeight;
  }, [lines]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const run = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    if (cmd === "help") {
      setLines(l => [...l, { command: raw, output: helpText }]);
    } else if (cmd === "clear") {
      setLines([]);
    } else if (cmd === "ls" && args[0] === "halls") {
      const hallList = listHalls().map(h => h.slug).join("  ");
      setLines(l => [...l, { command: raw, output: hallList }]);
    } else if (cmd === "hall" && args[0]) {
      const hall = listHalls().find(h => h.slug === args[0]);
      setLines(l => [
        ...l,
        hall
          ? { command: raw, output: `${hall.name} | ${hall.city} - ${hall.area} | سعة ${hall.capacityMen + hall.capacityWomen} | السعر ${hall.basePrice}` }
          : { command: raw, output: `Hall not found: ${args[0]}` },
      ]);
    } else if (cmd === "color" && args[0]) {
      setLines(l => [
        ...l,
        {
          command: raw,
          output: <span style={{ color: args[0] }}>{`Sample colored output (${args[0]})`}</span>,
        },
      ]);
    } else {
      setLines(l => [...l, { command: raw, output: `Unknown command: ${cmd} (type 'help')` }]);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input;
    setInput("");
    run(val);
  };

  return (
    <div className={clsx("terminal-wrapper", className)} dir={dir}>
      <div className="terminal shadow-lg" onClick={() => inputRef.current?.focus()}>
        <div className="terminal__bar">
          <span className="dot red" />
            <span className="dot amber" />
            <span className="dot green" />
          <div className="title">Interactive Terminal</div>
        </div>
        <div ref={viewportRef} className="terminal__viewport" role="log" aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className="line">
              <div className="cmd"><span className="prompt">{prompt}</span> {l.command}</div>
              {l.output && (
                <pre className="output" dir={dir === "rtl" ? "rtl" : "ltr"}>{l.output}</pre>
              )}
            </div>
          ))}
          <form onSubmit={onSubmit} className="input-line" aria-label="Terminal input">
            <span className="prompt">{prompt}</span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Command"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
