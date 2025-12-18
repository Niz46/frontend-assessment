// src/components/ui/Dropdown.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  value?: Option | null;
  options: Option[];
  onChange: (o: Option) => void;
  placeholder?: string;
  className?: string;
  applyClassToTrigger?: boolean;
  ariaLabel?: string;
  compact?: boolean;
  compactWidth?: string;
  triggerBgClass?: string;
  triggerBorderClass?: string;
  popoverBgClass?: string;
  popoverBorderClass?: string;
  popoverWidth?: string;
  align?: 'left' | 'right' | 'center';
  showSearch?: boolean | 'auto';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  renderValue?: (value: Option | null, placeholder: string) => React.ReactNode;
  triggerFullHeight?: boolean;
  hideCaret?: boolean;
};

export default function Dropdown({
  value = null,
  options,
  onChange,
  placeholder = 'Select',
  className = '',
  applyClassToTrigger = false,
  ariaLabel,
  compact = false,
  compactWidth = 'w-24',
  triggerBgClass = 'bg-[#F7F7F7]',
  triggerBorderClass = 'border-[#E0E0E0]',
  popoverBgClass = 'bg-white',
  popoverBorderClass = 'border-[#E0E0E0]',
  popoverWidth = 'w-[264px]',
  align = 'right',
  showSearch = true,
  open: controlledOpen,
  onOpenChange,
  renderValue,
  triggerFullHeight = false,
  hideCaret = false,
}: Props) {
  const [openInternal, setOpenInternal] = useState(false);
  const open = controlledOpen ?? openInternal;
  const setOpen = (v: boolean) => {
    if (typeof onOpenChange === 'function') onOpenChange(v);
    if (controlledOpen === undefined) setOpenInternal(v);
  };

  const [q, setQ] = useState('');
  const [highlighted, setHighlighted] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!open) {
      setQ('');
      setHighlighted(-1);
    } else {
      const shouldShowSearch = showSearch === 'auto' ? options.length > 6 : showSearch;
      if (shouldShowSearch && inputRef.current) inputRef.current.focus();
    }
  }, [open, options.length, showSearch]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        scrollToHighlighted();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        scrollToHighlighted();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlighted >= 0 && highlighted < filtered.length) {
          selectOption(filtered[highlighted]);
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, highlighted]);

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(q.toLowerCase()) ||
      (o.meta?.toLowerCase() ?? '').includes(q.toLowerCase())
  );

  function selectOption(opt: Option) {
    onChange(opt);
    setOpen(false);
    setQ('');
    setHighlighted(-1);
  }

  function scrollToHighlighted() {
    if (!listRef.current) return;
    const item = listRef.current.children[highlighted] as HTMLElement | undefined;
    if (item) item.scrollIntoView({ block: 'nearest' });
  }

  const shouldShowSearch = showSearch === 'auto' ? options.length > 6 : showSearch;

  // trigger sizing classes
  const triggerWidthClass = compact ? compactWidth : 'w-full';
  const triggerHeightClass = triggerFullHeight ? 'h-full' : 'h-9';
  const triggerClasses = `${triggerWidthClass} ${triggerHeightClass} flex items-center justify-between rounded-[20px] border ${triggerBorderClass} px-3 py-2 ${triggerBgClass}`;

  const wrapperClasses = applyClassToTrigger
    ? 'relative inline-block'
    : `relative inline-block ${className}`;

  // compute popover position classes properly
  // left  -> left-0
  // right -> right-0
  // center -> left-1/2 transform -translate-x-1/2
  const popoverPositionClass =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'; // center

  // ---- NEW: Trigger content (icon + label) ----
  const renderTriggerContent = () => {
    if (renderValue) return renderValue(value, placeholder);

    if (!value) {
      return <span className="text-sm text-accent truncate">{placeholder}</span>;
    }

    // choose image size by compact state
    const imgSizeClass = compact ? 'w-5 h-5' : 'w-6 h-6';

    return (
      <div className="flex items-center gap-2">
        {value.icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.icon}
            alt=""
            className={`${imgSizeClass} flex-shrink-0 object-contain rounded-full`}
          />
        )}
        <span className="text-sm text-accent truncate">{value.label}</span>
      </div>
    );
  };
  // ----------------------------------------------

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      <button
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        type="button"
        className={applyClassToTrigger ? `${className} ${triggerClasses}` : triggerClasses}
      >
        <span className="">{renderTriggerContent()}</span>

        {!hideCaret && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-2 shrink-0">
            <path
              d="M7 10l5 5 5-5"
              stroke="#013941"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          className={`absolute z-30 mt-2 ${popoverPositionClass} ${popoverWidth} rounded-lg ${popoverBorderClass} ${popoverBgClass} shadow-lg`}
        >
          {shouldShowSearch && (
            <div className="p-3">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setHighlighted(0);
                }}
                placeholder="Search"
                className="w-full rounded-full border border-[#E0E0E0] px-3 py-2"
              />
            </div>
          )}

          <ul
            ref={listRef}
            role="listbox"
            aria-activedescendant={
              highlighted >= 0 ? `option-${filtered[highlighted].id}` : undefined
            }
            className="max-h-48 overflow-auto"
          >
            {filtered.map((opt, idx) => {
              const isHighlighted = idx === highlighted;

              // when popover is centered, show items center-aligned vertically (icon above label),
              // otherwise show default left-aligned row layout.
              const itemInnerClass =
                align === 'center'
                  ? 'flex flex-col items-center gap-1 text-center'
                  : 'flex items-center gap-3';

              const itemBtnClass = `w-full text-left px-4 py-3 ${isHighlighted ? 'bg-gray-50 rounded-sm' : ''}`;

              return (
                <li key={opt.id} id={`option-${opt.id}`}>
                  <button
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => selectOption(opt)}
                    className={itemBtnClass}
                    role="option"
                    aria-selected={value?.id === opt.id}
                    type="button"
                  >
                    <div className={itemInnerClass}>
                      {opt.icon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={opt.icon}
                          alt=""
                          className={
                            align === 'center'
                              ? 'w-10 h-10'
                              : 'w-6 h-6 flex-shrink-0 object-contain'
                          }
                        />
                      )}
                      <div
                        className={
                          align === 'center' ? 'text-sm text-accent font-medium' : 'flex flex-col'
                        }
                      >
                        <div
                          className={
                            align === 'center'
                              ? 'text-sm text-accent font-medium'
                              : 'text-sm text-accent font-medium'
                          }
                        >
                          {opt.label}
                        </div>
                        {opt.meta && (
                          <div
                            className={
                              align === 'center' ? 'text-xs text-gray-400' : 'text-xs text-gray-400'
                            }
                          >
                            {opt.meta}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
