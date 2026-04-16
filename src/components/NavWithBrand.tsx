import React from 'react';
import { Nav, VisdomBrand } from '@virtuslab/visdom-ui';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Insights', href: '#insights' },
  { label: 'AI Radar', href: '#radar' },
  { label: 'Matrix', href: 'https://visdom-ai-maturity-matrix.pages.dev', external: true },
];

const cta = { label: 'Get in Touch', href: '#contact' };

export function NavWithBrand() {
  return (
    <Nav
      brand={<VisdomBrand product="2.0 AI-Native SDLC" />}
      links={links}
      cta={cta}
    />
  );
}
