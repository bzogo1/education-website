import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './v-accordion-11-utils/accordion';
import { Input } from './v-accordion-11-utils/input';

const faqs = [
  {
    content:
      'Go to the login page and click "Forgot password". You\'ll receive a reset link within a few minutes. The link expires after 24 hours.',
    trigger: 'How do I reset my password?',
    value: 'q1',
  },
  {
    content:
      'Yes, you can upgrade or downgrade at any time from account settings. Changes take effect at the start of your next billing cycle.',
    trigger: 'Can I change my subscription plan?',
    value: 'q2',
  },
  {
    content: 'All new accounts start with a 14-day free trial on the Pro plan. No credit card is required to start.',
    trigger: 'Is there a free trial available?',
    value: 'q3',
  },
  {
    content:
      'Navigate to Settings > Data & Privacy > Export. You can export in CSV or JSON format. Large exports may take a few minutes.',
    trigger: 'How do I export my data?',
    value: 'q4',
  },
  {
    content:
      'We accept all major credit cards (Visa, Mastercard, AmEx), PayPal, and bank transfers for annual enterprise plans.',
    trigger: 'What payment methods do you accept?',
    value: 'q5',
  },
  {
    content:
      'From your dashboard, go to Settings > Team, then click "Invite Member". Enter their email and select a role. They\'ll receive an invite within minutes.',
    trigger: 'How do I invite team members?',
    value: 'q6',
  },
];

export default function Pattern() {
  const [query, setQuery] = useState('');
  const filtered = faqs.filter(
    (faq) =>
      faq.trigger.toLowerCase().includes(query.toLowerCase()) ||
      faq.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="relative flex w-full justify-center bg-bgDark2 px-6 py-20 lg:py-28">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="block-subtitle mb-4">Have any questions?</p>
          <h2 className="block-big-title">Frequently Asked Questions</h2>
          <p className="mt-4 text-secondaryText">Search or browse answers below.</p>
        </div>
        <div className="relative mb-5">
          <SearchIcon className="text-secondaryText absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            className="pl-11"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions..."
            value={query}
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-secondaryText py-8 text-center text-sm">No results for &quot;{query}&quot;</p>
        ) : (
          <Accordion className="w-full" multiple>
            {filtered.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value}>
                <AccordionTrigger>{faq.trigger}</AccordionTrigger>
                <AccordionContent>{faq.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}