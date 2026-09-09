import { ChevronDown } from 'lucide-react';
import { createContext, useContext, useState, type ReactNode } from 'react';

type AccordionContextValue = {
  openItems: string[];
  toggleItem: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function Accordion({ children, className = '', multiple = false }: { children: ReactNode; className?: string; multiple?: boolean }) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const toggleItem = (value: string) =>
    setOpenItems((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : multiple
          ? [...current, value]
          : [value],
    );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, value }: { children: ReactNode; value: string }) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div data-accordion-value={value} className="border-mainBorderSubtler border-b">
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used inside Accordion');
  const item = useContext(AccordionItemContext);
  return (
    <button
      type="button"
      className="text-primaryText flex w-full items-center justify-between gap-4 py-5 text-left font-semibold"
      aria-expanded={context.openItems.includes(item)}
      onClick={() => context.toggleItem(item)}
    >
      <span>{children}</span>
      <ChevronDown className={`text-secondaryColor size-5 shrink-0 transition-transform ${context.openItems.includes(item) ? 'rotate-180' : ''}`} />
    </button>
  );
}

const AccordionItemContext = createContext('');

export function AccordionContent({ children }: { children: ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used inside Accordion');
  const item = useContext(AccordionItemContext);
  const isOpen = context.openItems.includes(item);
  return (
    <div
      aria-hidden={!isOpen}
      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="text-secondaryText min-h-0 overflow-hidden pb-5 leading-relaxed">{children}</div>
    </div>
  );
}