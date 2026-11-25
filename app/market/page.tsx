import type { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import { MarketPanel, RadarPanel } from '@/components/desk-panels';

export const metadata: Metadata = {
  title: 'Market',
  description: 'Texas load-zone prices, ERCOT demand, natural gas and a contract expiration radar inside Loadline AI.',
};

const rows = [
  {
    id: 'snapshot',
    name: 'Market snapshot',
    title: 'The numbers clients ask about, already open.',
    text: 'The Market page gathers Texas load-zone settlement prices, ERCOT demand, Henry Hub natural gas and U.S. gas storage in one view, so you can speak to the market without leaving the workspace.',
    points: ['Switch between load zones.', 'See recent trends, not only the latest figure.', 'The figures shown on this site are samples, not live prices.'],
    visual: <MarketPanel />,
  },
  {
    id: 'radar',
    name: 'Contract radar',
    title: 'See which contracts are coming up, in order.',
    text: 'The contract expiration radar lines up your accounts by when their agreements end and how large the opportunity is estimated to be.',
    points: ['Filter the radar, or search by company or supplier.', 'Open the account straight from the radar.', 'Ranking uses contract timing and an estimated opportunity, so treat it as a guide.'],
    visual: <RadarPanel />,
  },
];

const also = [
  ['On the wire', 'Recent energy reporting, grouped by topic and searchable.'],
  ['EIA reports', 'Open government energy reports from inside the app.'],
  ['Home ticker', 'A market ticker on the home screen for a quick read.'],
  ['Ask about it', 'Highlight any figure and ask Intelligence what it means.'],
];

export default function MarketPage() {
  return (
    <ProductPage
      title="Know the market before the client asks."
      lede="Prices, demand and your own contract calendar sit one click from the account, so market context is part of every conversation."
      rows={rows}
      also={also}
      alsoTitle="Also on the Market page"
    />
  );
}
