import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Torneos Deportivos | Simulación Monte Carlo',
  description:
    'Simulación interactiva de ligas deportivas con motor estocástico y análisis Monte Carlo. ' +
    'Proyecto académico de Modelos y Simulación — UNTDF.',
  keywords: ['simulación', 'torneo', 'monte carlo', 'liga', 'deportes', 'estadística'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
