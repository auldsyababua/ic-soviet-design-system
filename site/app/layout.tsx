import type { Metadata } from 'next';
import '@facility/ds/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'INDISTINCT CHATTERING — THE FACILITY',
  description:
    'indistinct Chattering — transmissions from a decaying black-hole research complex. Console access: media, discography, tour dispatch, gallery, personnel, press, requisitions, facility terminal.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
