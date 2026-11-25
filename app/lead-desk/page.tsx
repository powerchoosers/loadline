import type { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import { AccountCard } from '@/components/panels';
import { AssignmentsPanel, EmailPanel, ListPanel } from '@/components/desk-panels';

export const metadata: Metadata = {
  title: 'Lead desk',
  description: 'The Lead desk in Loadline AI: accounts and contacts with their energy facts, focused lists, assignments, email and reminders.',
};

const rows = [
  {
    id: 'accounts',
    name: 'Accounts and contacts',
    title: 'The record a consultant actually needs.',
    text: 'Each account carries its current supplier, contract end date and usage alongside the people you talk to. Open one and the rest of the window follows it.',
    points: ['Energy survey details live on the account.', 'Notes, calls and activity stay with the record.', 'Search any account or contact with Ctrl K.'],
    visual: <AccountCard />,
  },
  {
    id: 'lists',
    name: 'Lists and saved views',
    title: 'Work a focused list, not the whole book.',
    text: 'Build a list for a territory, a renewal window or a campaign, and keep the views you return to one click away.',
    points: ['Search within a list.', 'Add records to a list as you find them.'],
    visual: <ListPanel />,
  },
  {
    id: 'assignments',
    name: 'Assignments',
    title: 'Everyone knows whose move it is.',
    text: 'Deals pass between survey, booking and closing. Assignments show what is waiting on you, why it is a priority and what happened before it reached you.',
    points: ['See survey readiness before you pick a deal up.', 'Review handoff history and the latest call recap.', 'Step through a queue without losing your place.'],
    visual: <AssignmentsPanel />,
  },
  {
    id: 'email',
    name: 'Email and reminders',
    title: 'The inbox, next to the account it is about.',
    text: 'Connect Outlook to read and search mail inside the workspace, with the related account beside each message.',
    points: ['Set a reminder that depends on whether they reply.', 'Tasks and reminders keep the next step from slipping.', 'Outlook is an optional connection you make yourself.'],
    visual: <EmailPanel />,
  },
];

const also = [
  ['Reporting', 'A weekly view of recorded activity across the team.'],
  ['Quick Add', 'Create a record or a task from anywhere in the window.'],
  ['Notifications', 'What changed on your accounts since you last looked.'],
  ['Roles', 'Owners, admins and members each see what their role allows.'],
];

export default function LeadDeskPage() {
  return (
    <ProductPage
      title="Your book of business, with the energy built in."
      lede="The Lead desk is the CRM inside Loadline AI. It is shaped around commercial energy deals, so contract dates, suppliers and usage are part of every record."
      rows={rows}
      also={also}
      alsoTitle="Also on the Lead desk"
    />
  );
}
