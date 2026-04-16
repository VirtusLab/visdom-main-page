import React from 'react';
import { TopBar, Nav, VisdomBrand } from '@virtuslab/visdom-ui';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Insights', href: '#insights' },
  { label: 'AI Radar', href: '#radar' },
  { label: 'Matrix', href: 'https://visdom-ai-maturity-matrix.pages.dev', external: true },
];

const cta = { label: 'Get in Touch', href: '#contact' };

export function NavWithBrand() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar />
        <Nav
          brand={<VisdomBrand product="2.0 AI-Native SDLC" />}
          links={links}
          cta={cta}
          className="relative top-auto left-auto right-auto"
        />
      </div>
      <div style={{ height: '96px' }} />
    </>
  );
}
