import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import HeroGlobe from './HeroGlobe';

afterEach(() => vi.unstubAllGlobals());

describe('HeroGlobe initial hydration tree', () => {
  it.each([
    { mode: 'mobile', width: 375, reducedMotion: false, webgl: true },
    { mode: 'reduced motion', width: 1440, reducedMotion: true, webgl: true },
    { mode: 'no WebGL', width: 1440, reducedMotion: false, webgl: false },
  ])('keeps the server tree stable with $mode browser capabilities', ({ width, reducedMotion, webgl }) => {
    vi.stubGlobal('window', undefined);
    const server = renderToString(createElement(HeroGlobe));

    vi.stubGlobal('window', {
      innerWidth: width,
      matchMedia: () => ({ matches: reducedMotion }),
    });
    vi.stubGlobal('document', {
      createElement: () => ({ getContext: () => webgl ? {} : null }),
    });
    const hydrationTree = renderToString(createElement(HeroGlobe));

    expect(hydrationTree).toBe(server);
    expect(hydrationTree).not.toContain('hero-globe-fallback');
  });
});
