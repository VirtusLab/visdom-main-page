import React from 'react';
import { Nav, VirtusLabLogo } from '@virtuslab/visdom-ui';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Insights', href: '#insights' },
  { label: 'AI Radar', href: '#radar' },
  { label: 'Matrix', href: 'https://visdom-ai-maturity-matrix.pages.dev', external: true },
];

const cta = { label: 'Get in Touch', href: '#contact' };

function BrandBar() {
  return (
    <div className="bg-gray-950 text-white/90 text-xs">
      <div className="max-w-[1200px] mx-auto px-8 py-2 flex items-center justify-between">
        <a
          href="https://virtuslab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <VirtusLabLogo className="h-3.5 w-auto text-white/70" />
        </a>
        <a
          href="https://virtuslab.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-white/50 hover:text-emerald-400 transition-colors"
        >
          Built by VirtusLab
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
            <path d="M3 9l6-6M4.5 3H9v4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

function VisdomNavBrand() {
  return (
    <a href="/" className="text-lg font-bold tracking-tight no-underline hover:opacity-80 transition-opacity text-gray-900">
      Visdom
    </a>
  );
}

export function NavWithBrand() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <BrandBar />
        <Nav
          brand={<VisdomNavBrand />}
          links={links}
          cta={cta}
          className="relative top-auto left-auto right-auto"
        />
      </div>
      <div style={{ height: '104px' }} />
    </>
  );
}
