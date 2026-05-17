import type { Metadata } from 'next';
import './globals.css';
import AppShell from './components/AppShell';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Askara',
  description: 'Digital conversation card app for warmer conversations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
