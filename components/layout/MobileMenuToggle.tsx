"use client";

import { useState } from "react";

export function MobileMenuToggle() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    const aside = document.querySelector("aside");
    if (aside) {
      aside.classList.toggle("open", next);
    }
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 px-3 py-2 rounded-lg text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
        onClick={toggle}
        aria-label="菜单"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={toggle}
        />
      )}
    </>
  );
}
