import { css } from '@emotion/react'

export const variables = css`
  :root {
    --animation-timing-fast: 150ms;
    --animation-timing-medium: 250ms;
    --animation-timing-slow: 500ms;
    --animation-easing-fast: cubic-bezier(0, 0, 0.3, 1);
    --animation-easing-medium: cubic-bezier(0.03, 0.5, 0.25, 1);
    --animation-easing-bounce: cubic-bezier(0.3, 1.5, 0.6, 0.95);
    --animation-transition-fast: var(--animation-timing-fast) var(--animation-easing-fast);
    --animation-transition-medium: var(--animation-timing-medium) var(--animation-easing-medium);
    --animation-transition-slow: var(--animation-timing-slow) var(--animation-easing-medium);
    --animation-transition-callout: var(--animation-timing-medium) var(--animation-easing-bounce);
    --color-core-base-black: #000;
    --color-core-base-white: #fff;
    --color-core-neutral-50: #f4f6f8;
    --color-core-neutral-50-lighten: #fafafafa;
    --color-core-neutral-50-darken: #234a710d;
    --color-core-neutral-100: #dae2eb;
    --color-core-neutral-100-lighten: #f2f2f3ed;
    --color-core-neutral-100-darken: #083c7826;
    --color-core-neutral-200: #b5c1c9;
    --color-core-neutral-200-lighten: #f2f2f3c9;
    --color-core-neutral-200-darken: #082f4a4d;
    --color-core-neutral-300: #7b8a95;
    --color-core-neutral-300-lighten: #e4e6e796;
    --color-core-neutral-300-darken: #0a1c2985;
    --color-core-neutral-400: #52616b;
    --color-core-neutral-400-lighten: #dce1e56b;
    --color-core-neutral-400-darken: #0c1317ad;
    --color-core-neutral-500: #424e57;
    --color-core-neutral-500-lighten: #d2dde559;
    --color-core-neutral-500-darken: #101214bf;
    --color-core-neutral-600: #343d44;
    --color-core-neutral-600-lighten: #cbe0f145;
    --color-core-neutral-600-darken: #090a0bcc;
    --color-core-neutral-700: #272d33;
    --color-core-neutral-700-lighten: #c2e0ff33;
    --color-core-neutral-700-darken: #070808d9;
    --color-core-neutral-800: #181c20;
    --color-core-neutral-800-lighten: #bbd9f621;
    --color-core-neutral-800-darken: #050505e8;
    --color-core-neutral-900: #0f1114;
    --color-core-neutral-900-lighten: #bcd5fa14;
    --color-core-neutral-900-darken: #020408f2;
    --color-core-blue-50: #becaff;
    --color-core-blue-100: #9facff;
    --color-core-blue-200: #8890ff;
    --color-core-blue-300: #7174ff;
    --color-core-blue-400: #5a58ff;
    --color-core-blue-500: #4038ff;
    --color-core-blue-600: #342ecf;
    --color-core-blue-700: #2823a0;
    --color-core-blue-800: #1b186c;
    --color-core-blue-900: #08071e;
    --color-core-green-50: #75e1a2;
    --color-core-green-100: #12cc60;
    --color-core-green-200: #0eb152;
    --color-core-green-300: #0c9846;
    --color-core-green-400: #0a823c;
    --color-core-green-500: #096c32;
    --color-core-green-600: #075829;
    --color-core-green-700: #05441f;
    --color-core-green-800: #042d15;
    --color-core-green-900: #010d06;
    --color-core-red-50: #ffbbb7;
    --color-core-red-100: #ff948d;
    --color-core-red-200: #ff695f;
    --color-core-red-300: #f34235;
    --color-core-red-400: #cf382d;
    --color-core-red-500: #ae2f26;
    --color-core-red-600: #8d261f;
    --color-core-red-700: #6d1e18;
    --color-core-red-800: #4a1410;
    --color-core-red-900: #150605;
    --color-core-yellow-50: #fee879;
    --color-core-yellow-100: #ecc502;
    --color-core-yellow-200: #caa802;
    --color-core-yellow-300: #ac9002;
    --color-core-yellow-400: #917901;
    --color-core-yellow-500: #786401;
    --color-core-yellow-600: #615001;
    --color-core-yellow-700: #4a3d01;
    --color-core-yellow-800: #302800;
    --color-core-yellow-900: #0a0900;
    --color-text-muted: var(--color-core-neutral-300);
    --color-text: var(--color-core-neutral-200);
    --color-text-strong: var(--color-core-neutral-50);
    --color-text-primary: var(--color-core-blue-300);
    --color-text-error: var(--color-core-red-200);
    --color-text-success: var(--color-core-green-300);
    --color-text-caution: var(--color-core-yellow-200);
    --color-border-muted: var(--color-core-neutral-800);
    --color-border-muted-alpha: var(--color-core-neutral-800-lighten);
    --color-border: var(--color-core-neutral-600);
    --color-border-alpha: var(--color-core-neutral-600-lighten);
    --color-border-strong: var(--color-core-neutral-400);
    --color-border-strong-alpha: var(--color-core-neutral-400-lighten);
    --color-border-primary: var(--color-core-blue-500);
    --color-border-error: var(--color-core-red-200);
    --color-background-muted: var(--color-core-neutral-900);
    --color-background-muted-alpha: var(--color-core-neutral-900-lighten);
    --color-background: var(--color-core-neutral-800);
    --color-background-alpha: var(--color-core-neutral-800-lighten);
    --color-background-strong: var(--color-core-neutral-700);
    --color-background-strong-alpha: var(--color-core-neutral-700-lighten);
    --color-background-elevated: var(--color-core-neutral-600);
    --color-background-elevated-alpha: var(--color-core-neutral-600-lighten);
    --color-background-overlay: var(--color-core-neutral-500-darken);
    --color-background-primary-muted: var(--color-core-blue-600);
    --color-background-primary: var(--color-core-blue-500);
    --color-background-primary-strong: var(--color-core-blue-400);
    --color-background-error-muted: var(--color-core-red-600);
    --color-background-error: var(--color-core-red-500);
    --color-background-error-strong: var(--color-core-red-400);
    --color-background-success-muted: var(--color-core-green-600);
    --color-background-success: var(--color-core-green-500);
    --color-background-success-strong: var(--color-core-green-400);
    --color-background-caution-muted: var(--color-core-yellow-300);
    --color-background-caution: var(--color-core-yellow-200);
    --color-background-caution-strong: var(--color-core-yellow-100);
    --effect-dividers-top: inset 0 1px 0 0 var(--color-border-muted-alpha);
    --effect-dividers-bottom: inset 0 -1px 0 0 var(--color-border-muted-alpha);
    --effect-dividers-left: inset 1px 0 0 0 var(--color-border-muted-alpha);
    --effect-dividers-right: inset -1px 0 0 0 var(--color-border-muted-alpha);
    --effect-elevation-1-layer1: 0 1px 2px 0 #00000052;
    --effect-elevation-8-layer1: 0 8px 16px 0 #0000001f;
    --effect-elevation-8-layer2: 0 4px 4px 0 #0000001a;
    --effect-elevation-16-layer1: 0 16px 32px 0 #00000029;
    --effect-elevation-16-layer2: 0 4px 8px 0 #0000001a;
    --effect-elevation-24-layer1: 0 24px 40px 0 #00000029;
    --effect-elevation-24-layer2: 0 8px 8px 0 #0000001f;
    --filter-effect-dividers-top: drop-shadow(0 1px 0 var(--color-border-muted-alpha));
    --filter-effect-dividers-bottom: drop-shadow(0 -1px 0 var(--color-border-muted-alpha));
    --filter-effect-dividers-left: drop-shadow(1px 0 0 var(--color-border-muted-alpha));
    --filter-effect-dividers-right: drop-shadow(-1px 0 0 var(--color-border-muted-alpha));
    --filter-effect-elevation-1-layer1: drop-shadow(0 1px 2px #00000052);
    --filter-effect-elevation-8-layer1: drop-shadow(0 8px 16px #0000001f);
    --filter-effect-elevation-8-layer2: drop-shadow(0 4px 4px #0000001a);
    --filter-effect-elevation-16-layer1: drop-shadow(0 16px 32px #00000029);
    --filter-effect-elevation-16-layer2: drop-shadow(0 4px 8px #0000001a);
    --filter-effect-elevation-24-layer1: drop-shadow(0 24px 40px #00000029);
    --filter-effect-elevation-24-layer2: drop-shadow(0 8px 8px #0000001f);
    --radius-small: 2px;
    --radius-medium: 4px;
    --radius-large: 8px;
    --typography-fonts-primary: IBM Plex Sans, -apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Segoe UI,
      Helvetica Neue, Helvetica, Ubuntu, Roboto, Noto, Arial, sans-serif;
    --typography-fonts-secondary: Inter, -apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Segoe UI,
      Helvetica Neue, Helvetica, Ubuntu, Roboto, Noto, Arial, sans-serif;
    --typography-font-sizes-1: 0.75rem;
    --typography-font-sizes-2: 0.875rem;
    --typography-font-sizes-3: 1rem;
    --typography-font-sizes-4: 1.125rem;
    --typography-font-sizes-5: 1.3125rem;
    --typography-font-sizes-6: 1.5rem;
    --typography-font-sizes-7: 1.75rem;
    --typography-font-sizes-8: 2rem;
    --typography-font-sizes-9: 2.25rem;
    --typography-font-sizes-10: 2.625rem;
    --typography-font-sizes-11: 3rem;
    --typography-font-sizes-12: 3.4375rem;
    --typography-font-sizes-13: 3.9375rem;
    --typography-font-sizes-14: 4.5625rem;
    --typography-font-sizes-15: 5.25rem;
    --typography-font-sizes-16: 6rem;
    --typography-font-weights-light: 300;
    --typography-font-weights-normal: 400;
    --typography-font-weights-medium: 500;
    --typography-font-weights-semibold: 600;
    --typography-font-weights-bold: 700;
    --typography-desktop-h1100: var(--typography-font-weights-bold) var(--typography-font-sizes-16) / 7rem
      var(--typography-fonts-primary);
    --typography-desktop-h1000: var(--typography-font-weights-semibold) var(--typography-font-sizes-14) / 5rem
      var(--typography-fonts-primary);
    --typography-desktop-h900: var(--typography-font-weights-semibold) var(--typography-font-sizes-13) / 4.5rem
      var(--typography-fonts-primary);
    --typography-desktop-h800: var(--typography-font-weights-semibold) var(--typography-font-sizes-12) / 4rem
      var(--typography-fonts-primary);
    --typography-desktop-h700: var(--typography-font-weights-semibold) var(--typography-font-sizes-10) / 3rem
      var(--typography-fonts-primary);
    --typography-desktop-h600: var(--typography-font-weights-semibold) var(--typography-font-sizes-8) / 2.5rem
      var(--typography-fonts-primary);
    --typography-desktop-h500: var(--typography-font-weights-semibold) var(--typography-font-sizes-6) / 2rem
      var(--typography-fonts-primary);
    --typography-desktop-h400: var(--typography-font-weights-semibold) var(--typography-font-sizes-4) / 1.5rem
      var(--typography-fonts-primary);
    --typography-desktop-h300: var(--typography-font-weights-semibold) var(--typography-font-sizes-3) / 1.5rem
      var(--typography-fonts-primary);
    --typography-desktop-h200: var(--typography-font-weights-semibold) var(--typography-font-sizes-2) / 1.25rem
      var(--typography-fonts-primary);
    --typography-desktop-h100: var(--typography-font-weights-bold) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-primary);
    --typography-desktop-t500: var(--typography-font-weights-normal) var(--typography-font-sizes-8) / 2.75rem
      var(--typography-fonts-secondary);
    --typography-desktop-t500-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-8) / 2.75rem
      var(--typography-fonts-secondary);
    --typography-desktop-t400: var(--typography-font-weights-normal) var(--typography-font-sizes-5) / 2rem
      var(--typography-fonts-secondary);
    --typography-desktop-t400-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-5) / 2rem
      var(--typography-fonts-secondary);
    --typography-desktop-t300: var(--typography-font-weights-normal) var(--typography-font-sizes-3) / 1.5rem
      var(--typography-fonts-secondary);
    --typography-desktop-t300-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-3) / 1.5rem
      var(--typography-fonts-secondary);
    --typography-desktop-t200: var(--typography-font-weights-normal) var(--typography-font-sizes-2) / 1.25rem
      var(--typography-fonts-secondary);
    --typography-desktop-t200-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-2) / 1.25rem
      var(--typography-fonts-secondary);
    --typography-desktop-t100: var(--typography-font-weights-medium) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-secondary);
    --typography-desktop-t100-strong: var(--typography-font-weights-bold) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-secondary);
    --typography-mobile-h1100: var(--typography-font-weights-semibold) var(--typography-font-sizes-10) / 3.25rem
      var(--typography-fonts-primary);
    --typography-mobile-h1000: var(--typography-font-weights-semibold) var(--typography-font-sizes-9) / 2.75rem
      var(--typography-fonts-primary);
    --typography-mobile-h900: var(--typography-font-weights-semibold) var(--typography-font-sizes-8) / 2.5rem
      var(--typography-fonts-primary);
    --typography-mobile-h800: var(--typography-font-weights-semibold) var(--typography-font-sizes-7) / 2rem
      var(--typography-fonts-primary);
    --typography-mobile-h700: var(--typography-font-weights-semibold) var(--typography-font-sizes-6) / 2rem
      var(--typography-fonts-primary);
    --typography-mobile-h600: var(--typography-font-weights-semibold) var(--typography-font-sizes-5) / 1.5rem
      var(--typography-fonts-primary);
    --typography-mobile-h500: var(--typography-font-weights-semibold) var(--typography-font-sizes-4) / 1.5rem
      var(--typography-fonts-primary);
    --typography-mobile-h400: var(--typography-font-weights-semibold) var(--typography-font-sizes-3) / 1.5rem
      var(--typography-fonts-primary);
    --typography-mobile-h300: var(--typography-font-weights-semibold) var(--typography-font-sizes-2) / 1.25rem
      var(--typography-fonts-primary);
    --typography-mobile-h200: var(--typography-font-weights-bold) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-primary);
    --typography-mobile-h100: var(--typography-font-weights-bold) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-primary);
    --typography-mobile-t500: var(--typography-font-weights-normal) var(--typography-font-sizes-5) / 1.75rem
      var(--typography-fonts-secondary);
    --typography-mobile-t500-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-5) / 1.75rem
      var(--typography-fonts-secondary);
    --typography-mobile-t400: var(--typography-font-weights-normal) var(--typography-font-sizes-4) / 1.5rem
      var(--typography-fonts-secondary);
    --typography-mobile-t400-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-4) / 1.5rem
      var(--typography-fonts-secondary);
    --typography-mobile-t300: var(--typography-font-weights-normal) var(--typography-font-sizes-3) / 1.5rem
      var(--typography-fonts-secondary);
    --typography-mobile-t300-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-3) / 1.5rem
      var(--typography-fonts-secondary);
    --typography-mobile-t200: var(--typography-font-weights-normal) var(--typography-font-sizes-2) / 1.25rem
      var(--typography-fonts-secondary);
    --typography-mobile-t200-strong: var(--typography-font-weights-semibold) var(--typography-font-sizes-2) / 1.25rem
      var(--typography-fonts-secondary);
    --typography-mobile-t100: var(--typography-font-weights-medium) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-secondary);
    --typography-mobile-t100-strong: var(--typography-font-weights-bold) var(--typography-font-sizes-1) / 1rem
      var(--typography-fonts-secondary);
    --typography-desktop-h1100-letter-spacing: -0.01em;
    --typography-desktop-h1000-letter-spacing: -0.01em;
    --typography-desktop-h900-letter-spacing: -0.01em;
    --typography-desktop-h800-letter-spacing: -0.005em;
    --typography-desktop-h700-letter-spacing: 0;
    --typography-desktop-h600-letter-spacing: 0;
    --typography-desktop-h500-letter-spacing: 0;
    --typography-desktop-h400-letter-spacing: 0.005em;
    --typography-desktop-h300-letter-spacing: 0.01em;
    --typography-desktop-h200-letter-spacing: 0.01em;
    --typography-desktop-h100-letter-spacing: 0.07em;
    --typography-desktop-t500-letter-spacing: 0;
    --typography-desktop-t500-strong-letter-spacing: 0;
    --typography-desktop-t400-letter-spacing: 0;
    --typography-desktop-t400-strong-letter-spacing: 0;
    --typography-desktop-t300-letter-spacing: 0;
    --typography-desktop-t300-strong-letter-spacing: 0;
    --typography-desktop-t200-letter-spacing: 0.005em;
    --typography-desktop-t200-strong-letter-spacing: 0.005em;
    --typography-desktop-t100-letter-spacing: 0.01em;
    --typography-desktop-t100-strong-letter-spacing: 0.01em;
    --typography-mobile-h1100-letter-spacing: -0.01em;
    --typography-mobile-h1000-letter-spacing: 0;
    --typography-mobile-h900-letter-spacing: 0;
    --typography-mobile-h800-letter-spacing: 0;
    --typography-mobile-h700-letter-spacing: 0;
    --typography-mobile-h600-letter-spacing: 0;
    --typography-mobile-h500-letter-spacing: 0.005em;
    --typography-mobile-h400-letter-spacing: 0.01em;
    --typography-mobile-h300-letter-spacing: 0.01em;
    --typography-mobile-h200-letter-spacing: 0.02em;
    --typography-mobile-h100-letter-spacing: 0.07em;
    --typography-mobile-t500-letter-spacing: 0;
    --typography-mobile-t500-strong-letter-spacing: 0;
    --typography-mobile-t400-letter-spacing: 0;
    --typography-mobile-t400-strong-letter-spacing: 0;
    --typography-mobile-t300-letter-spacing: 0;
    --typography-mobile-t300-strong-letter-spacing: 0;
    --typography-mobile-t200-letter-spacing: 0.005em;
    --typography-mobile-t200-strong-letter-spacing: 0.005em;
    --typography-mobile-t100-letter-spacing: 0.01em;
    --typography-mobile-t100-strong-letter-spacing: 0.01em;
    --typography-desktop-h1100-text-transform: none;
    --typography-desktop-h1000-text-transform: none;
    --typography-desktop-h900-text-transform: none;
    --typography-desktop-h800-text-transform: none;
    --typography-desktop-h700-text-transform: none;
    --typography-desktop-h600-text-transform: none;
    --typography-desktop-h500-text-transform: none;
    --typography-desktop-h400-text-transform: none;
    --typography-desktop-h300-text-transform: none;
    --typography-desktop-h200-text-transform: none;
    --typography-desktop-h100-text-transform: uppercase;
    --typography-desktop-t500-text-transform: none;
    --typography-desktop-t500-strong-text-transform: none;
    --typography-desktop-t400-text-transform: none;
    --typography-desktop-t400-strong-text-transform: none;
    --typography-desktop-t300-text-transform: none;
    --typography-desktop-t300-strong-text-transform: none;
    --typography-desktop-t200-text-transform: none;
    --typography-desktop-t200-strong-text-transform: none;
    --typography-desktop-t100-text-transform: none;
    --typography-desktop-t100-strong-text-transform: none;
    --typography-mobile-h1100-text-transform: none;
    --typography-mobile-h1000-text-transform: none;
    --typography-mobile-h900-text-transform: none;
    --typography-mobile-h800-text-transform: none;
    --typography-mobile-h700-text-transform: none;
    --typography-mobile-h600-text-transform: none;
    --typography-mobile-h500-text-transform: none;
    --typography-mobile-h400-text-transform: none;
    --typography-mobile-h300-text-transform: none;
    --typography-mobile-h200-text-transform: none;
    --typography-mobile-h100-text-transform: uppercase;
    --typography-mobile-t500-text-transform: none;
    --typography-mobile-t500-strong-text-transform: none;
    --typography-mobile-t400-text-transform: none;
    --typography-mobile-t400-strong-text-transform: none;
    --typography-mobile-t300-text-transform: none;
    --typography-mobile-t300-strong-text-transform: none;
    --typography-mobile-t200-text-transform: none;
    --typography-mobile-t200-strong-text-transform: none;
    --typography-mobile-t100-text-transform: none;
    --typography-mobile-t100-strong-text-transform: none;
  }
`
export const theme = {
  animationTimingFast: { variable: 'var(--animation-timing-fast)', value: '150ms' },
  animationTimingMedium: { variable: 'var(--animation-timing-medium)', value: '250ms' },
  animationTimingSlow: { variable: 'var(--animation-timing-slow)', value: '500ms' },
  animationEasingFast: { variable: 'var(--animation-easing-fast)', value: 'cubic-bezier(0,0,0.3,1)' },
  animationEasingMedium: { variable: 'var(--animation-easing-medium)', value: 'cubic-bezier(0.03,0.5,0.25,1)' },
  animationEasingBounce: { variable: 'var(--animation-easing-bounce)', value: 'cubic-bezier(0.3,1.5,0.6,0.95)' },
  animationTransitionFast: { variable: 'var(--animation-transition-fast)', value: '150ms cubic-bezier(0,0,0.3,1)' },
  animationTransitionMedium: {
    variable: 'var(--animation-transition-medium)',
    value: '250ms cubic-bezier(0.03,0.5,0.25,1)',
  },
  animationTransitionSlow: {
    variable: 'var(--animation-transition-slow)',
    value: '500ms cubic-bezier(0.03,0.5,0.25,1)',
  },
  animationTransitionCallout: {
    variable: 'var(--animation-transition-callout)',
    value: '250ms cubic-bezier(0.3,1.5,0.6,0.95)',
  },
  colorCoreBaseBlack: { variable: 'var(--color-core-base-black)', value: '#000' },
  colorCoreBaseWhite: { variable: 'var(--color-core-base-white)', value: '#FFF' },
  colorCoreNeutral50: { variable: 'var(--color-core-neutral-50)', value: '#F4F6F8' },
  colorCoreNeutral50Lighten: { variable: 'var(--color-core-neutral-50-lighten)', value: '#FAFAFAFA' },
  colorCoreNeutral50Darken: { variable: 'var(--color-core-neutral-50-darken)', value: '#234A710D' },
  colorCoreNeutral100: { variable: 'var(--color-core-neutral-100)', value: '#DAE2EB' },
  colorCoreNeutral100Lighten: { variable: 'var(--color-core-neutral-100-lighten)', value: '#F2F2F3ED' },
  colorCoreNeutral100Darken: { variable: 'var(--color-core-neutral-100-darken)', value: '#083C7826' },
  colorCoreNeutral200: { variable: 'var(--color-core-neutral-200)', value: '#B5C1C9' },
  colorCoreNeutral200Lighten: { variable: 'var(--color-core-neutral-200-lighten)', value: '#F2F2F3C9' },
  colorCoreNeutral200Darken: { variable: 'var(--color-core-neutral-200-darken)', value: '#082F4A4D' },
  colorCoreNeutral300: { variable: 'var(--color-core-neutral-300)', value: '#7B8A95' },
  colorCoreNeutral300Lighten: { variable: 'var(--color-core-neutral-300-lighten)', value: '#E4E6E796' },
  colorCoreNeutral300Darken: { variable: 'var(--color-core-neutral-300-darken)', value: '#0A1C2985' },
  colorCoreNeutral400: { variable: 'var(--color-core-neutral-400)', value: '#52616B' },
  colorCoreNeutral400Lighten: { variable: 'var(--color-core-neutral-400-lighten)', value: '#DCE1E56B' },
  colorCoreNeutral400Darken: { variable: 'var(--color-core-neutral-400-darken)', value: '#0C1317AD' },
  colorCoreNeutral500: { variable: 'var(--color-core-neutral-500)', value: '#424E57' },
  colorCoreNeutral500Lighten: { variable: 'var(--color-core-neutral-500-lighten)', value: '#D2DDE559' },
  colorCoreNeutral500Darken: { variable: 'var(--color-core-neutral-500-darken)', value: '#101214BF' },
  colorCoreNeutral600: { variable: 'var(--color-core-neutral-600)', value: '#343D44' },
  colorCoreNeutral600Lighten: { variable: 'var(--color-core-neutral-600-lighten)', value: '#CBE0F145' },
  colorCoreNeutral600Darken: { variable: 'var(--color-core-neutral-600-darken)', value: '#090A0BCC' },
  colorCoreNeutral700: { variable: 'var(--color-core-neutral-700)', value: '#272D33' },
  colorCoreNeutral700Lighten: { variable: 'var(--color-core-neutral-700-lighten)', value: '#C2E0FF33' },
  colorCoreNeutral700Darken: { variable: 'var(--color-core-neutral-700-darken)', value: '#070808D9' },
  colorCoreNeutral800: { variable: 'var(--color-core-neutral-800)', value: '#181C20' },
  colorCoreNeutral800Lighten: { variable: 'var(--color-core-neutral-800-lighten)', value: '#BBD9F621' },
  colorCoreNeutral800Darken: { variable: 'var(--color-core-neutral-800-darken)', value: '#050505E8' },
  colorCoreNeutral900: { variable: 'var(--color-core-neutral-900)', value: '#0F1114' },
  colorCoreNeutral900Lighten: { variable: 'var(--color-core-neutral-900-lighten)', value: '#BCD5FA14' },
  colorCoreNeutral900Darken: { variable: 'var(--color-core-neutral-900-darken)', value: '#020408F2' },
  colorCoreBlue50: { variable: 'var(--color-core-blue-50)', value: '#BECAFF' },
  colorCoreBlue100: { variable: 'var(--color-core-blue-100)', value: '#9FACFF' },
  colorCoreBlue200: { variable: 'var(--color-core-blue-200)', value: '#8890FF' },
  colorCoreBlue300: { variable: 'var(--color-core-blue-300)', value: '#7174FF' },
  colorCoreBlue400: { variable: 'var(--color-core-blue-400)', value: '#5A58FF' },
  colorCoreBlue500: { variable: 'var(--color-core-blue-500)', value: '#4038FF' },
  colorCoreBlue600: { variable: 'var(--color-core-blue-600)', value: '#342ECF' },
  colorCoreBlue700: { variable: 'var(--color-core-blue-700)', value: '#2823A0' },
  colorCoreBlue800: { variable: 'var(--color-core-blue-800)', value: '#1B186C' },
  colorCoreBlue900: { variable: 'var(--color-core-blue-900)', value: '#08071E' },
  colorCoreGreen50: { variable: 'var(--color-core-green-50)', value: '#75E1A2' },
  colorCoreGreen100: { variable: 'var(--color-core-green-100)', value: '#12CC60' },
  colorCoreGreen200: { variable: 'var(--color-core-green-200)', value: '#0EB152' },
  colorCoreGreen300: { variable: 'var(--color-core-green-300)', value: '#0C9846' },
  colorCoreGreen400: { variable: 'var(--color-core-green-400)', value: '#0A823C' },
  colorCoreGreen500: { variable: 'var(--color-core-green-500)', value: '#096C32' },
  colorCoreGreen600: { variable: 'var(--color-core-green-600)', value: '#075829' },
  colorCoreGreen700: { variable: 'var(--color-core-green-700)', value: '#05441F' },
  colorCoreGreen800: { variable: 'var(--color-core-green-800)', value: '#042D15' },
  colorCoreGreen900: { variable: 'var(--color-core-green-900)', value: '#010D06' },
  colorCoreRed50: { variable: 'var(--color-core-red-50)', value: '#FFBBB7' },
  colorCoreRed100: { variable: 'var(--color-core-red-100)', value: '#FF948D' },
  colorCoreRed200: { variable: 'var(--color-core-red-200)', value: '#FF695F' },
  colorCoreRed300: { variable: 'var(--color-core-red-300)', value: '#F34235' },
  colorCoreRed400: { variable: 'var(--color-core-red-400)', value: '#CF382D' },
  colorCoreRed500: { variable: 'var(--color-core-red-500)', value: '#AE2F26' },
  colorCoreRed600: { variable: 'var(--color-core-red-600)', value: '#8D261F' },
  colorCoreRed700: { variable: 'var(--color-core-red-700)', value: '#6D1E18' },
  colorCoreRed800: { variable: 'var(--color-core-red-800)', value: '#4A1410' },
  colorCoreRed900: { variable: 'var(--color-core-red-900)', value: '#150605' },
  colorCoreYellow50: { variable: 'var(--color-core-yellow-50)', value: '#FEE879' },
  colorCoreYellow100: { variable: 'var(--color-core-yellow-100)', value: '#ECC502' },
  colorCoreYellow200: { variable: 'var(--color-core-yellow-200)', value: '#CAA802' },
  colorCoreYellow300: { variable: 'var(--color-core-yellow-300)', value: '#AC9002' },
  colorCoreYellow400: { variable: 'var(--color-core-yellow-400)', value: '#917901' },
  colorCoreYellow500: { variable: 'var(--color-core-yellow-500)', value: '#786401' },
  colorCoreYellow600: { variable: 'var(--color-core-yellow-600)', value: '#615001' },
  colorCoreYellow700: { variable: 'var(--color-core-yellow-700)', value: '#4A3D01' },
  colorCoreYellow800: { variable: 'var(--color-core-yellow-800)', value: '#302800' },
  colorCoreYellow900: { variable: 'var(--color-core-yellow-900)', value: '#0A0900' },
  colorTextMuted: { variable: 'var(--color-text-muted)', value: '#7B8A95' },
  colorText: { variable: 'var(--color-text)', value: '#B5C1C9' },
  colorTextStrong: { variable: 'var(--color-text-strong)', value: '#F4F6F8' },
  colorTextPrimary: { variable: 'var(--color-text-primary)', value: '#7174FF' },
  colorTextError: { variable: 'var(--color-text-error)', value: '#FF695F' },
  colorTextSuccess: { variable: 'var(--color-text-success)', value: '#0C9846' },
  colorTextCaution: { variable: 'var(--color-text-caution)', value: '#CAA802' },
  colorBorderMuted: { variable: 'var(--color-border-muted)', value: '#181C20' },
  colorBorderMutedAlpha: { variable: 'var(--color-border-muted-alpha)', value: '#BBD9F621' },
  colorBorder: { variable: 'var(--color-border)', value: '#343D44' },
  colorBorderAlpha: { variable: 'var(--color-border-alpha)', value: '#CBE0F145' },
  colorBorderStrong: { variable: 'var(--color-border-strong)', value: '#52616B' },
  colorBorderStrongAlpha: { variable: 'var(--color-border-strong-alpha)', value: '#DCE1E56B' },
  colorBorderPrimary: { variable: 'var(--color-border-primary)', value: '#4038FF' },
  colorBorderError: { variable: 'var(--color-border-error)', value: '#FF695F' },
  colorBackgroundMuted: { variable: 'var(--color-background-muted)', value: '#0F1114' },
  colorBackgroundMutedAlpha: { variable: 'var(--color-background-muted-alpha)', value: '#BCD5FA14' },
  colorBackground: { variable: 'var(--color-background)', value: '#181C20' },
  colorBackgroundAlpha: { variable: 'var(--color-background-alpha)', value: '#BBD9F621' },
  colorBackgroundStrong: { variable: 'var(--color-background-strong)', value: '#272D33' },
  colorBackgroundStrongAlpha: { variable: 'var(--color-background-strong-alpha)', value: '#C2E0FF33' },
  colorBackgroundElevated: { variable: 'var(--color-background-elevated)', value: '#343D44' },
  colorBackgroundElevatedAlpha: { variable: 'var(--color-background-elevated-alpha)', value: '#CBE0F145' },
  colorBackgroundOverlay: { variable: 'var(--color-background-overlay)', value: '#101214BF' },
  colorBackgroundPrimaryMuted: { variable: 'var(--color-background-primary-muted)', value: '#342ECF' },
  colorBackgroundPrimary: { variable: 'var(--color-background-primary)', value: '#4038FF' },
  colorBackgroundPrimaryStrong: { variable: 'var(--color-background-primary-strong)', value: '#5A58FF' },
  colorBackgroundErrorMuted: { variable: 'var(--color-background-error-muted)', value: '#8D261F' },
  colorBackgroundError: { variable: 'var(--color-background-error)', value: '#AE2F26' },
  colorBackgroundErrorStrong: { variable: 'var(--color-background-error-strong)', value: '#CF382D' },
  colorBackgroundSuccessMuted: { variable: 'var(--color-background-success-muted)', value: '#075829' },
  colorBackgroundSuccess: { variable: 'var(--color-background-success)', value: '#096C32' },
  colorBackgroundSuccessStrong: { variable: 'var(--color-background-success-strong)', value: '#0A823C' },
  colorBackgroundCautionMuted: { variable: 'var(--color-background-caution-muted)', value: '#AC9002' },
  colorBackgroundCaution: { variable: 'var(--color-background-caution)', value: '#CAA802' },
  colorBackgroundCautionStrong: { variable: 'var(--color-background-caution-strong)', value: '#ECC502' },
  effectDividersTop: { variable: 'var(--effect-dividers-top)', value: 'inset 0 1px 0 0 #BBD9F621' },
  effectDividersBottom: { variable: 'var(--effect-dividers-bottom)', value: 'inset 0 -1px 0 0 #BBD9F621' },
  effectDividersLeft: { variable: 'var(--effect-dividers-left)', value: 'inset 1px 0 0 0 #BBD9F621' },
  effectDividersRight: { variable: 'var(--effect-dividers-right)', value: 'inset -1px 0 0 0 #BBD9F621' },
  effectElevation1Layer1: { variable: 'var(--effect-elevation-1-layer1)', value: ' 0 1px 2px 0 #00000052' },
  effectElevation8Layer1: { variable: 'var(--effect-elevation-8-layer1)', value: ' 0 8px 16px 0 #0000001F' },
  effectElevation8Layer2: { variable: 'var(--effect-elevation-8-layer2)', value: ' 0 4px 4px 0 #0000001A' },
  effectElevation16Layer1: { variable: 'var(--effect-elevation-16-layer1)', value: ' 0 16px 32px 0 #00000029' },
  effectElevation16Layer2: { variable: 'var(--effect-elevation-16-layer2)', value: ' 0 4px 8px 0 #0000001A' },
  effectElevation24Layer1: { variable: 'var(--effect-elevation-24-layer1)', value: ' 0 24px 40px 0 #00000029' },
  effectElevation24Layer2: { variable: 'var(--effect-elevation-24-layer2)', value: ' 0 8px 8px 0 #0000001F' },
  filterEffectDividersTop: { variable: 'var(--filter-effect-dividers-top)', value: 'drop-shadow(0 1px 0 #BBD9F621)' },
  filterEffectDividersBottom: {
    variable: 'var(--filter-effect-dividers-bottom)',
    value: 'drop-shadow(0 -1px 0 #BBD9F621)',
  },
  filterEffectDividersLeft: { variable: 'var(--filter-effect-dividers-left)', value: 'drop-shadow(1px 0 0 #BBD9F621)' },
  filterEffectDividersRight: {
    variable: 'var(--filter-effect-dividers-right)',
    value: 'drop-shadow(-1px 0 0 #BBD9F621)',
  },
  filterEffectElevation1Layer1: {
    variable: 'var(--filter-effect-elevation-1-layer1)',
    value: 'drop-shadow(0 1px 2px #00000052)',
  },
  filterEffectElevation8Layer1: {
    variable: 'var(--filter-effect-elevation-8-layer1)',
    value: 'drop-shadow(0 8px 16px #0000001F)',
  },
  filterEffectElevation8Layer2: {
    variable: 'var(--filter-effect-elevation-8-layer2)',
    value: 'drop-shadow(0 4px 4px #0000001A)',
  },
  filterEffectElevation16Layer1: {
    variable: 'var(--filter-effect-elevation-16-layer1)',
    value: 'drop-shadow(0 16px 32px #00000029)',
  },
  filterEffectElevation16Layer2: {
    variable: 'var(--filter-effect-elevation-16-layer2)',
    value: 'drop-shadow(0 4px 8px #0000001A)',
  },
  filterEffectElevation24Layer1: {
    variable: 'var(--filter-effect-elevation-24-layer1)',
    value: 'drop-shadow(0 24px 40px #00000029)',
  },
  filterEffectElevation24Layer2: {
    variable: 'var(--filter-effect-elevation-24-layer2)',
    value: 'drop-shadow(0 8px 8px #0000001F)',
  },
  radiusSmall: { variable: 'var(--radius-small)', value: '2px' },
  radiusMedium: { variable: 'var(--radius-medium)', value: '4px' },
  radiusLarge: { variable: 'var(--radius-large)', value: '8px' },
  typographyFontsPrimary: {
    variable: 'var(--typography-fonts-primary)',
    value:
      'IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyFontsSecondary: {
    variable: 'var(--typography-fonts-secondary)',
    value:
      'Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyFontSizes1: { variable: 'var(--typography-font-sizes-1)', value: '0.75rem' },
  typographyFontSizes2: { variable: 'var(--typography-font-sizes-2)', value: '0.875rem' },
  typographyFontSizes3: { variable: 'var(--typography-font-sizes-3)', value: '1rem' },
  typographyFontSizes4: { variable: 'var(--typography-font-sizes-4)', value: '1.125rem' },
  typographyFontSizes5: { variable: 'var(--typography-font-sizes-5)', value: '1.3125rem' },
  typographyFontSizes6: { variable: 'var(--typography-font-sizes-6)', value: '1.5rem' },
  typographyFontSizes7: { variable: 'var(--typography-font-sizes-7)', value: '1.75rem' },
  typographyFontSizes8: { variable: 'var(--typography-font-sizes-8)', value: '2rem' },
  typographyFontSizes9: { variable: 'var(--typography-font-sizes-9)', value: '2.25rem' },
  typographyFontSizes10: { variable: 'var(--typography-font-sizes-10)', value: '2.625rem' },
  typographyFontSizes11: { variable: 'var(--typography-font-sizes-11)', value: '3rem' },
  typographyFontSizes12: { variable: 'var(--typography-font-sizes-12)', value: '3.4375rem' },
  typographyFontSizes13: { variable: 'var(--typography-font-sizes-13)', value: '3.9375rem' },
  typographyFontSizes14: { variable: 'var(--typography-font-sizes-14)', value: '4.5625rem' },
  typographyFontSizes15: { variable: 'var(--typography-font-sizes-15)', value: '5.25rem' },
  typographyFontSizes16: { variable: 'var(--typography-font-sizes-16)', value: '6rem' },
  typographyFontWeightsLight: { variable: 'var(--typography-font-weights-light)', value: '300' },
  typographyFontWeightsNormal: { variable: 'var(--typography-font-weights-normal)', value: '400' },
  typographyFontWeightsMedium: { variable: 'var(--typography-font-weights-medium)', value: '500' },
  typographyFontWeightsSemibold: { variable: 'var(--typography-font-weights-semibold)', value: '600' },
  typographyFontWeightsBold: { variable: 'var(--typography-font-weights-bold)', value: '700' },
  typographyDesktopH1100: {
    variable: 'var(--typography-desktop-h1100)',
    value:
      '700 6rem/7rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH1000: {
    variable: 'var(--typography-desktop-h1000)',
    value:
      '600 4.5625rem/5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH900: {
    variable: 'var(--typography-desktop-h900)',
    value:
      '600 3.9375rem/4.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH800: {
    variable: 'var(--typography-desktop-h800)',
    value:
      '600 3.4375rem/4rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH700: {
    variable: 'var(--typography-desktop-h700)',
    value:
      '600 2.625rem/3rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH600: {
    variable: 'var(--typography-desktop-h600)',
    value:
      '600 2rem/2.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH500: {
    variable: 'var(--typography-desktop-h500)',
    value:
      '600 1.5rem/2rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH400: {
    variable: 'var(--typography-desktop-h400)',
    value:
      '600 1.125rem/1.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH300: {
    variable: 'var(--typography-desktop-h300)',
    value:
      '600 1rem/1.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH200: {
    variable: 'var(--typography-desktop-h200)',
    value:
      '600 0.875rem/1.25rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH100: {
    variable: 'var(--typography-desktop-h100)',
    value:
      '700 0.75rem/1rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT500: {
    variable: 'var(--typography-desktop-t500)',
    value:
      '400 2rem/2.75rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT500Strong: {
    variable: 'var(--typography-desktop-t500-strong)',
    value:
      '600 2rem/2.75rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT400: {
    variable: 'var(--typography-desktop-t400)',
    value:
      '400 1.3125rem/2rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT400Strong: {
    variable: 'var(--typography-desktop-t400-strong)',
    value:
      '600 1.3125rem/2rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT300: {
    variable: 'var(--typography-desktop-t300)',
    value:
      '400 1rem/1.5rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT300Strong: {
    variable: 'var(--typography-desktop-t300-strong)',
    value:
      '600 1rem/1.5rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT200: {
    variable: 'var(--typography-desktop-t200)',
    value:
      '400 0.875rem/1.25rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT200Strong: {
    variable: 'var(--typography-desktop-t200-strong)',
    value:
      '600 0.875rem/1.25rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT100: {
    variable: 'var(--typography-desktop-t100)',
    value:
      '500 0.75rem/1rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopT100Strong: {
    variable: 'var(--typography-desktop-t100-strong)',
    value:
      '700 0.75rem/1rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH1100: {
    variable: 'var(--typography-mobile-h1100)',
    value:
      '600 2.625rem/3.25rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH1000: {
    variable: 'var(--typography-mobile-h1000)',
    value:
      '600 2.25rem/2.75rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH900: {
    variable: 'var(--typography-mobile-h900)',
    value:
      '600 2rem/2.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH800: {
    variable: 'var(--typography-mobile-h800)',
    value:
      '600 1.75rem/2rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH700: {
    variable: 'var(--typography-mobile-h700)',
    value:
      '600 1.5rem/2rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH600: {
    variable: 'var(--typography-mobile-h600)',
    value:
      '600 1.3125rem/1.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH500: {
    variable: 'var(--typography-mobile-h500)',
    value:
      '600 1.125rem/1.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH400: {
    variable: 'var(--typography-mobile-h400)',
    value:
      '600 1rem/1.5rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH300: {
    variable: 'var(--typography-mobile-h300)',
    value:
      '600 0.875rem/1.25rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH200: {
    variable: 'var(--typography-mobile-h200)',
    value:
      '700 0.75rem/1rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileH100: {
    variable: 'var(--typography-mobile-h100)',
    value:
      '700 0.75rem/1rem IBM Plex Sans,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT500: {
    variable: 'var(--typography-mobile-t500)',
    value:
      '400 1.3125rem/1.75rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT500Strong: {
    variable: 'var(--typography-mobile-t500-strong)',
    value:
      '600 1.3125rem/1.75rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT400: {
    variable: 'var(--typography-mobile-t400)',
    value:
      '400 1.125rem/1.5rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT400Strong: {
    variable: 'var(--typography-mobile-t400-strong)',
    value:
      '600 1.125rem/1.5rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT300: {
    variable: 'var(--typography-mobile-t300)',
    value:
      '400 1rem/1.5rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT300Strong: {
    variable: 'var(--typography-mobile-t300-strong)',
    value:
      '600 1rem/1.5rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT200: {
    variable: 'var(--typography-mobile-t200)',
    value:
      '400 0.875rem/1.25rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT200Strong: {
    variable: 'var(--typography-mobile-t200-strong)',
    value:
      '600 0.875rem/1.25rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT100: {
    variable: 'var(--typography-mobile-t100)',
    value:
      '500 0.75rem/1rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyMobileT100Strong: {
    variable: 'var(--typography-mobile-t100-strong)',
    value:
      '700 0.75rem/1rem Inter,-apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Segoe UI,Helvetica Neue,Helvetica,Ubuntu,Roboto,Noto,Arial,sans-serif',
  },
  typographyDesktopH1100LetterSpacing: { variable: 'var(--typography-desktop-h1100-letter-spacing)', value: '-0.01em' },
  typographyDesktopH1000LetterSpacing: { variable: 'var(--typography-desktop-h1000-letter-spacing)', value: '-0.01em' },
  typographyDesktopH900LetterSpacing: { variable: 'var(--typography-desktop-h900-letter-spacing)', value: '-0.01em' },
  typographyDesktopH800LetterSpacing: { variable: 'var(--typography-desktop-h800-letter-spacing)', value: '-0.005em' },
  typographyDesktopH700LetterSpacing: { variable: 'var(--typography-desktop-h700-letter-spacing)', value: '0' },
  typographyDesktopH600LetterSpacing: { variable: 'var(--typography-desktop-h600-letter-spacing)', value: '0' },
  typographyDesktopH500LetterSpacing: { variable: 'var(--typography-desktop-h500-letter-spacing)', value: '0' },
  typographyDesktopH400LetterSpacing: { variable: 'var(--typography-desktop-h400-letter-spacing)', value: '0.005em' },
  typographyDesktopH300LetterSpacing: { variable: 'var(--typography-desktop-h300-letter-spacing)', value: '0.01em' },
  typographyDesktopH200LetterSpacing: { variable: 'var(--typography-desktop-h200-letter-spacing)', value: '0.01em' },
  typographyDesktopH100LetterSpacing: { variable: 'var(--typography-desktop-h100-letter-spacing)', value: '0.07em' },
  typographyDesktopT500LetterSpacing: { variable: 'var(--typography-desktop-t500-letter-spacing)', value: '0' },
  typographyDesktopT500StrongLetterSpacing: {
    variable: 'var(--typography-desktop-t500-strong-letter-spacing)',
    value: '0',
  },
  typographyDesktopT400LetterSpacing: { variable: 'var(--typography-desktop-t400-letter-spacing)', value: '0' },
  typographyDesktopT400StrongLetterSpacing: {
    variable: 'var(--typography-desktop-t400-strong-letter-spacing)',
    value: '0',
  },
  typographyDesktopT300LetterSpacing: { variable: 'var(--typography-desktop-t300-letter-spacing)', value: '0' },
  typographyDesktopT300StrongLetterSpacing: {
    variable: 'var(--typography-desktop-t300-strong-letter-spacing)',
    value: '0',
  },
  typographyDesktopT200LetterSpacing: { variable: 'var(--typography-desktop-t200-letter-spacing)', value: '0.005em' },
  typographyDesktopT200StrongLetterSpacing: {
    variable: 'var(--typography-desktop-t200-strong-letter-spacing)',
    value: '0.005em',
  },
  typographyDesktopT100LetterSpacing: { variable: 'var(--typography-desktop-t100-letter-spacing)', value: '0.01em' },
  typographyDesktopT100StrongLetterSpacing: {
    variable: 'var(--typography-desktop-t100-strong-letter-spacing)',
    value: '0.01em',
  },
  typographyMobileH1100LetterSpacing: { variable: 'var(--typography-mobile-h1100-letter-spacing)', value: '-0.01em' },
  typographyMobileH1000LetterSpacing: { variable: 'var(--typography-mobile-h1000-letter-spacing)', value: '0' },
  typographyMobileH900LetterSpacing: { variable: 'var(--typography-mobile-h900-letter-spacing)', value: '0' },
  typographyMobileH800LetterSpacing: { variable: 'var(--typography-mobile-h800-letter-spacing)', value: '0' },
  typographyMobileH700LetterSpacing: { variable: 'var(--typography-mobile-h700-letter-spacing)', value: '0' },
  typographyMobileH600LetterSpacing: { variable: 'var(--typography-mobile-h600-letter-spacing)', value: '0' },
  typographyMobileH500LetterSpacing: { variable: 'var(--typography-mobile-h500-letter-spacing)', value: '0.005em' },
  typographyMobileH400LetterSpacing: { variable: 'var(--typography-mobile-h400-letter-spacing)', value: '0.01em' },
  typographyMobileH300LetterSpacing: { variable: 'var(--typography-mobile-h300-letter-spacing)', value: '0.01em' },
  typographyMobileH200LetterSpacing: { variable: 'var(--typography-mobile-h200-letter-spacing)', value: '0.02em' },
  typographyMobileH100LetterSpacing: { variable: 'var(--typography-mobile-h100-letter-spacing)', value: '0.07em' },
  typographyMobileT500LetterSpacing: { variable: 'var(--typography-mobile-t500-letter-spacing)', value: '0' },
  typographyMobileT500StrongLetterSpacing: {
    variable: 'var(--typography-mobile-t500-strong-letter-spacing)',
    value: '0',
  },
  typographyMobileT400LetterSpacing: { variable: 'var(--typography-mobile-t400-letter-spacing)', value: '0' },
  typographyMobileT400StrongLetterSpacing: {
    variable: 'var(--typography-mobile-t400-strong-letter-spacing)',
    value: '0',
  },
  typographyMobileT300LetterSpacing: { variable: 'var(--typography-mobile-t300-letter-spacing)', value: '0' },
  typographyMobileT300StrongLetterSpacing: {
    variable: 'var(--typography-mobile-t300-strong-letter-spacing)',
    value: '0',
  },
  typographyMobileT200LetterSpacing: { variable: 'var(--typography-mobile-t200-letter-spacing)', value: '0.005em' },
  typographyMobileT200StrongLetterSpacing: {
    variable: 'var(--typography-mobile-t200-strong-letter-spacing)',
    value: '0.005em',
  },
  typographyMobileT100LetterSpacing: { variable: 'var(--typography-mobile-t100-letter-spacing)', value: '0.01em' },
  typographyMobileT100StrongLetterSpacing: {
    variable: 'var(--typography-mobile-t100-strong-letter-spacing)',
    value: '0.01em',
  },
  typographyDesktopH1100TextTransform: { variable: 'var(--typography-desktop-h1100-text-transform)', value: 'none' },
  typographyDesktopH1000TextTransform: { variable: 'var(--typography-desktop-h1000-text-transform)', value: 'none' },
  typographyDesktopH900TextTransform: { variable: 'var(--typography-desktop-h900-text-transform)', value: 'none' },
  typographyDesktopH800TextTransform: { variable: 'var(--typography-desktop-h800-text-transform)', value: 'none' },
  typographyDesktopH700TextTransform: { variable: 'var(--typography-desktop-h700-text-transform)', value: 'none' },
  typographyDesktopH600TextTransform: { variable: 'var(--typography-desktop-h600-text-transform)', value: 'none' },
  typographyDesktopH500TextTransform: { variable: 'var(--typography-desktop-h500-text-transform)', value: 'none' },
  typographyDesktopH400TextTransform: { variable: 'var(--typography-desktop-h400-text-transform)', value: 'none' },
  typographyDesktopH300TextTransform: { variable: 'var(--typography-desktop-h300-text-transform)', value: 'none' },
  typographyDesktopH200TextTransform: { variable: 'var(--typography-desktop-h200-text-transform)', value: 'none' },
  typographyDesktopH100TextTransform: { variable: 'var(--typography-desktop-h100-text-transform)', value: 'uppercase' },
  typographyDesktopT500TextTransform: { variable: 'var(--typography-desktop-t500-text-transform)', value: 'none' },
  typographyDesktopT500StrongTextTransform: {
    variable: 'var(--typography-desktop-t500-strong-text-transform)',
    value: 'none',
  },
  typographyDesktopT400TextTransform: { variable: 'var(--typography-desktop-t400-text-transform)', value: 'none' },
  typographyDesktopT400StrongTextTransform: {
    variable: 'var(--typography-desktop-t400-strong-text-transform)',
    value: 'none',
  },
  typographyDesktopT300TextTransform: { variable: 'var(--typography-desktop-t300-text-transform)', value: 'none' },
  typographyDesktopT300StrongTextTransform: {
    variable: 'var(--typography-desktop-t300-strong-text-transform)',
    value: 'none',
  },
  typographyDesktopT200TextTransform: { variable: 'var(--typography-desktop-t200-text-transform)', value: 'none' },
  typographyDesktopT200StrongTextTransform: {
    variable: 'var(--typography-desktop-t200-strong-text-transform)',
    value: 'none',
  },
  typographyDesktopT100TextTransform: { variable: 'var(--typography-desktop-t100-text-transform)', value: 'none' },
  typographyDesktopT100StrongTextTransform: {
    variable: 'var(--typography-desktop-t100-strong-text-transform)',
    value: 'none',
  },
  typographyMobileH1100TextTransform: { variable: 'var(--typography-mobile-h1100-text-transform)', value: 'none' },
  typographyMobileH1000TextTransform: { variable: 'var(--typography-mobile-h1000-text-transform)', value: 'none' },
  typographyMobileH900TextTransform: { variable: 'var(--typography-mobile-h900-text-transform)', value: 'none' },
  typographyMobileH800TextTransform: { variable: 'var(--typography-mobile-h800-text-transform)', value: 'none' },
  typographyMobileH700TextTransform: { variable: 'var(--typography-mobile-h700-text-transform)', value: 'none' },
  typographyMobileH600TextTransform: { variable: 'var(--typography-mobile-h600-text-transform)', value: 'none' },
  typographyMobileH500TextTransform: { variable: 'var(--typography-mobile-h500-text-transform)', value: 'none' },
  typographyMobileH400TextTransform: { variable: 'var(--typography-mobile-h400-text-transform)', value: 'none' },
  typographyMobileH300TextTransform: { variable: 'var(--typography-mobile-h300-text-transform)', value: 'none' },
  typographyMobileH200TextTransform: { variable: 'var(--typography-mobile-h200-text-transform)', value: 'none' },
  typographyMobileH100TextTransform: { variable: 'var(--typography-mobile-h100-text-transform)', value: 'uppercase' },
  typographyMobileT500TextTransform: { variable: 'var(--typography-mobile-t500-text-transform)', value: 'none' },
  typographyMobileT500StrongTextTransform: {
    variable: 'var(--typography-mobile-t500-strong-text-transform)',
    value: 'none',
  },
  typographyMobileT400TextTransform: { variable: 'var(--typography-mobile-t400-text-transform)', value: 'none' },
  typographyMobileT400StrongTextTransform: {
    variable: 'var(--typography-mobile-t400-strong-text-transform)',
    value: 'none',
  },
  typographyMobileT300TextTransform: { variable: 'var(--typography-mobile-t300-text-transform)', value: 'none' },
  typographyMobileT300StrongTextTransform: {
    variable: 'var(--typography-mobile-t300-strong-text-transform)',
    value: 'none',
  },
  typographyMobileT200TextTransform: { variable: 'var(--typography-mobile-t200-text-transform)', value: 'none' },
  typographyMobileT200StrongTextTransform: {
    variable: 'var(--typography-mobile-t200-strong-text-transform)',
    value: 'none',
  },
  typographyMobileT100TextTransform: { variable: 'var(--typography-mobile-t100-text-transform)', value: 'none' },
  typographyMobileT100StrongTextTransform: {
    variable: 'var(--typography-mobile-t100-strong-text-transform)',
    value: 'none',
  },
}
export const cVar = (key: keyof typeof theme, returnValue?: boolean) => {
  if (returnValue) return theme[key].value
  return theme[key].variable
}
