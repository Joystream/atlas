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
    --color-core-neutral-900: #0b0c0f;
    --color-core-neutral-900-lighten: #b7c8fa0f;
    --color-core-neutral-900-darken: #010205f5;
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
    --color-text-muted: var(--color-core-neutral-400);
    --color-text: var(--color-core-neutral-500);
    --color-text-strong: var(--color-core-neutral-600);
    --color-text-primary: var(--color-core-blue-300);
    --color-text-error: var(--color-core-red-300);
    --color-text-success: var(--color-core-green-300);
    --color-border-muted: var(--color-core-neutral-700);
    --color-border-muted-alpha: var(--color-core-neutral-700-lighten);
    --color-border: var(--color-core-neutral-500);
    --color-border-alpha: var(--color-core-neutral-500-lighten);
    --color-border-strong: var(--color-core-neutral-300);
    --color-border-strong-alpha: var(--color-core-neutral-300-lighten);
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
    --effect-dividers-top: 0 1px 0 0 var(--color-border-muted-alpha);
    --effect-dividers-bottom: 0 -1px 0 0 var(--color-border-muted-alpha);
    --effect-dividers-left: 1px 0 0 0 var(--color-border-muted-alpha);
    --effect-dividers-right: -1px 0 0 0 var(--color-border-muted-alpha);
    --effect-elevation-8-layer1: 0 8px 16px 0 #0000001f;
    --effect-elevation-8-layer2: 0 4px 4px 0 #0000001a;
    --effect-elevation-16-layer1: 0 16px 32px 0 #00000029;
    --effect-elevation-16-layer2: 0 4px 8px 0 #0000001a;
    --effect-elevation-24-layer1: 0 24px 40px 0 #00000029;
    --effect-elevation-24-layer2: 0 8px 8px 0 ##0000001f;
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
    --typography-font-weights-light: 300;
    --typography-font-weights-normal: 400;
    --typography-font-weights-medium: 500;
    --typography-font-weights-semibold: 600;
    --typography-font-weights-bold: 700;
    --typography-desktop-h900: var(--typography-font-weights-semibold) var(--typography-font-sizes-14) / 5rem
      var(--typography-fonts-primary);
    --typography-desktop-h800: var(--typography-font-weights-semibold) var(--typography-font-sizes-12) / 4rem
      var(--typography-fonts-primary);
    --typography-desktop-h700: var(--typography-font-weights-semibold) var(--typography-font-sizes-10) / 3.5rem
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
    --typography-desktop-h900-letter-spacing: -0.01em;
    --typography-desktop-h800-letter-spacing: -0.005em;
    --typography-desktop-h700-letter-spacing: 0;
    --typography-desktop-h600-letter-spacing: 0;
    --typography-desktop-h500-letter-spacing: 0;
    --typography-desktop-h400-letter-spacing: 0.005em;
    --typography-desktop-h300-letter-spacing: 0.01em;
    --typography-desktop-h200-letter-spacing: 0.01em;
    --typography-desktop-h100-letter-spacing: 0.07em;
    --typography-desktop-t300-letter-spacing: 0;
    --typography-desktop-t300-strong-letter-spacing: 0;
    --typography-desktop-t200-letter-spacing: 0.005em;
    --typography-desktop-t200-strong-letter-spacing: 0.005em;
    --typography-desktop-t100-letter-spacing: 0.01em;
    --typography-desktop-t100-strong-letter-spacing: 0.01em;
    --typography-mobile-h900-letter-spacing: 0;
    --typography-mobile-h800-letter-spacing: 0;
    --typography-mobile-h700-letter-spacing: 0;
    --typography-mobile-h600-letter-spacing: 0;
    --typography-mobile-h500-letter-spacing: 0.005em;
    --typography-mobile-h400-letter-spacing: 0.01em;
    --typography-mobile-h300-letter-spacing: 0.01em;
    --typography-mobile-h200-letter-spacing: 0.02em;
    --typography-mobile-h100-letter-spacing: 0.07em;
    --typography-mobile-t300-letter-spacing: 0;
    --typography-mobile-t300-strong-letter-spacing: 0;
    --typography-mobile-t200-letter-spacing: 0.005em;
    --typography-mobile-t200-strong-letter-spacing: 0.005em;
    --typography-mobile-t100-letter-spacing: 0.01em;
    --typography-mobile-t100-strong-letter-spacing: 0.01em;
    --typography-desktop-h900-text-transform: none;
    --typography-desktop-h800-text-transform: none;
    --typography-desktop-h700-text-transform: none;
    --typography-desktop-h600-text-transform: none;
    --typography-desktop-h500-text-transform: none;
    --typography-desktop-h400-text-transform: none;
    --typography-desktop-h300-text-transform: none;
    --typography-desktop-h200-text-transform: none;
    --typography-desktop-h100-text-transform: uppercase;
    --typography-desktop-t300-text-transform: none;
    --typography-desktop-t300-strong-text-transform: none;
    --typography-desktop-t200-text-transform: none;
    --typography-desktop-t200-strong-text-transform: none;
    --typography-desktop-t100-text-transform: none;
    --typography-desktop-t100-strong-text-transform: none;
    --typography-mobile-h900-text-transform: none;
    --typography-mobile-h800-text-transform: none;
    --typography-mobile-h700-text-transform: none;
    --typography-mobile-h600-text-transform: none;
    --typography-mobile-h500-text-transform: none;
    --typography-mobile-h400-text-transform: none;
    --typography-mobile-h300-text-transform: none;
    --typography-mobile-h200-text-transform: none;
    --typography-mobile-h100-text-transform: uppercase;
    --typography-mobile-t300-text-transform: none;
    --typography-mobile-t300-strong-text-transform: none;
    --typography-mobile-t200-text-transform: none;
    --typography-mobile-t200-strong-text-transform: none;
    --typography-mobile-t100-text-transform: none;
    --typography-mobile-t100-strong-text-transform: none;
  }
`
export const theme = {
  animationTimingFast: 'var(--animation-timing-fast)',
  animationTimingMedium: 'var(--animation-timing-medium)',
  animationTimingSlow: 'var(--animation-timing-slow)',
  animationEasingFast: 'var(--animation-easing-fast)',
  animationEasingMedium: 'var(--animation-easing-medium)',
  animationEasingBounce: 'var(--animation-easing-bounce)',
  animationTransitionFast: 'var(--animation-transition-fast)',
  animationTransitionMedium: 'var(--animation-transition-medium)',
  animationTransitionSlow: 'var(--animation-transition-slow)',
  animationTransitionCallout: 'var(--animation-transition-callout)',
  colorCoreNeutral50: 'var(--color-core-neutral-50)',
  colorCoreNeutral50Lighten: 'var(--color-core-neutral-50-lighten)',
  colorCoreNeutral50Darken: 'var(--color-core-neutral-50-darken)',
  colorCoreNeutral100: 'var(--color-core-neutral-100)',
  colorCoreNeutral100Lighten: 'var(--color-core-neutral-100-lighten)',
  colorCoreNeutral100Darken: 'var(--color-core-neutral-100-darken)',
  colorCoreNeutral200: 'var(--color-core-neutral-200)',
  colorCoreNeutral200Lighten: 'var(--color-core-neutral-200-lighten)',
  colorCoreNeutral200Darken: 'var(--color-core-neutral-200-darken)',
  colorCoreNeutral300: 'var(--color-core-neutral-300)',
  colorCoreNeutral300Lighten: 'var(--color-core-neutral-300-lighten)',
  colorCoreNeutral300Darken: 'var(--color-core-neutral-300-darken)',
  colorCoreNeutral400: 'var(--color-core-neutral-400)',
  colorCoreNeutral400Lighten: 'var(--color-core-neutral-400-lighten)',
  colorCoreNeutral400Darken: 'var(--color-core-neutral-400-darken)',
  colorCoreNeutral500: 'var(--color-core-neutral-500)',
  colorCoreNeutral500Lighten: 'var(--color-core-neutral-500-lighten)',
  colorCoreNeutral500Darken: 'var(--color-core-neutral-500-darken)',
  colorCoreNeutral600: 'var(--color-core-neutral-600)',
  colorCoreNeutral600Lighten: 'var(--color-core-neutral-600-lighten)',
  colorCoreNeutral600Darken: 'var(--color-core-neutral-600-darken)',
  colorCoreNeutral700: 'var(--color-core-neutral-700)',
  colorCoreNeutral700Lighten: 'var(--color-core-neutral-700-lighten)',
  colorCoreNeutral700Darken: 'var(--color-core-neutral-700-darken)',
  colorCoreNeutral800: 'var(--color-core-neutral-800)',
  colorCoreNeutral800Lighten: 'var(--color-core-neutral-800-lighten)',
  colorCoreNeutral800Darken: 'var(--color-core-neutral-800-darken)',
  colorCoreNeutral900: 'var(--color-core-neutral-900)',
  colorCoreNeutral900Lighten: 'var(--color-core-neutral-900-lighten)',
  colorCoreNeutral900Darken: 'var(--color-core-neutral-900-darken)',
  colorCoreBlue50: 'var(--color-core-blue-50)',
  colorCoreBlue100: 'var(--color-core-blue-100)',
  colorCoreBlue200: 'var(--color-core-blue-200)',
  colorCoreBlue300: 'var(--color-core-blue-300)',
  colorCoreBlue400: 'var(--color-core-blue-400)',
  colorCoreBlue500: 'var(--color-core-blue-500)',
  colorCoreBlue600: 'var(--color-core-blue-600)',
  colorCoreBlue700: 'var(--color-core-blue-700)',
  colorCoreBlue800: 'var(--color-core-blue-800)',
  colorCoreBlue900: 'var(--color-core-blue-900)',
  colorCoreGreen50: 'var(--color-core-green-50)',
  colorCoreGreen100: 'var(--color-core-green-100)',
  colorCoreGreen200: 'var(--color-core-green-200)',
  colorCoreGreen300: 'var(--color-core-green-300)',
  colorCoreGreen400: 'var(--color-core-green-400)',
  colorCoreGreen500: 'var(--color-core-green-500)',
  colorCoreGreen600: 'var(--color-core-green-600)',
  colorCoreGreen700: 'var(--color-core-green-700)',
  colorCoreGreen800: 'var(--color-core-green-800)',
  colorCoreGreen900: 'var(--color-core-green-900)',
  colorCoreRed50: 'var(--color-core-red-50)',
  colorCoreRed100: 'var(--color-core-red-100)',
  colorCoreRed200: 'var(--color-core-red-200)',
  colorCoreRed300: 'var(--color-core-red-300)',
  colorCoreRed400: 'var(--color-core-red-400)',
  colorCoreRed500: 'var(--color-core-red-500)',
  colorCoreRed600: 'var(--color-core-red-600)',
  colorCoreRed700: 'var(--color-core-red-700)',
  colorCoreRed800: 'var(--color-core-red-800)',
  colorCoreRed900: 'var(--color-core-red-900)',
  colorCoreYellow50: 'var(--color-core-yellow-50)',
  colorCoreYellow100: 'var(--color-core-yellow-100)',
  colorCoreYellow200: 'var(--color-core-yellow-200)',
  colorCoreYellow300: 'var(--color-core-yellow-300)',
  colorCoreYellow400: 'var(--color-core-yellow-400)',
  colorCoreYellow500: 'var(--color-core-yellow-500)',
  colorCoreYellow600: 'var(--color-core-yellow-600)',
  colorCoreYellow700: 'var(--color-core-yellow-700)',
  colorCoreYellow800: 'var(--color-core-yellow-800)',
  colorCoreYellow900: 'var(--color-core-yellow-900)',
  colorTextMuted: 'var(--color-text-muted)',
  colorText: 'var(--color-text)',
  colorTextStrong: 'var(--color-text-strong)',
  colorTextPrimary: 'var(--color-text-primary)',
  colorTextError: 'var(--color-text-error)',
  colorTextSuccess: 'var(--color-text-success)',
  colorBorderMuted: 'var(--color-border-muted)',
  colorBorderMutedAlpha: 'var(--color-border-muted-alpha)',
  colorBorder: 'var(--color-border)',
  colorBorderAlpha: 'var(--color-border-alpha)',
  colorBorderStrong: 'var(--color-border-strong)',
  colorBorderStrongAlpha: 'var(--color-border-strong-alpha)',
  colorBackgroundMuted: 'var(--color-background-muted)',
  colorBackgroundMutedAlpha: 'var(--color-background-muted-alpha)',
  colorBackground: 'var(--color-background)',
  colorBackgroundAlpha: 'var(--color-background-alpha)',
  colorBackgroundStrong: 'var(--color-background-strong)',
  colorBackgroundStrongAlpha: 'var(--color-background-strong-alpha)',
  colorBackgroundElevated: 'var(--color-background-elevated)',
  colorBackgroundElevatedAlpha: 'var(--color-background-elevated-alpha)',
  colorBackgroundOverlay: 'var(--color-background-overlay)',
  colorBackgroundPrimaryMuted: 'var(--color-background-primary-muted)',
  colorBackgroundPrimary: 'var(--color-background-primary)',
  colorBackgroundPrimaryStrong: 'var(--color-background-primary-strong)',
  colorBackgroundErrorMuted: 'var(--color-background-error-muted)',
  colorBackgroundError: 'var(--color-background-error)',
  colorBackgroundErrorStrong: 'var(--color-background-error-strong)',
  colorBackgroundSuccessMuted: 'var(--color-background-success-muted)',
  colorBackgroundSuccess: 'var(--color-background-success)',
  colorBackgroundSuccessStrong: 'var(--color-background-success-strong)',
  effectDividersTop: 'var(--effect-dividers-top)',
  effectDividersBottom: 'var(--effect-dividers-bottom)',
  effectDividersLeft: 'var(--effect-dividers-left)',
  effectDividersRight: 'var(--effect-dividers-right)',
  effectElevation8Layer1: 'var(--effect-elevation-8-layer1)',
  effectElevation8Layer2: 'var(--effect-elevation-8-layer2)',
  effectElevation16Layer1: 'var(--effect-elevation-16-layer1)',
  effectElevation16Layer2: 'var(--effect-elevation-16-layer2)',
  effectElevation24Layer1: 'var(--effect-elevation-24-layer1)',
  effectElevation24Layer2: 'var(--effect-elevation-24-layer2)',
  typographyFontsPrimary: 'var(--typography-fonts-primary)',
  typographyFontsSecondary: 'var(--typography-fonts-secondary)',
  typographyFontSizes1: 'var(--typography-font-sizes-1)',
  typographyFontSizes2: 'var(--typography-font-sizes-2)',
  typographyFontSizes3: 'var(--typography-font-sizes-3)',
  typographyFontSizes4: 'var(--typography-font-sizes-4)',
  typographyFontSizes5: 'var(--typography-font-sizes-5)',
  typographyFontSizes6: 'var(--typography-font-sizes-6)',
  typographyFontSizes7: 'var(--typography-font-sizes-7)',
  typographyFontSizes8: 'var(--typography-font-sizes-8)',
  typographyFontSizes9: 'var(--typography-font-sizes-9)',
  typographyFontSizes10: 'var(--typography-font-sizes-10)',
  typographyFontSizes11: 'var(--typography-font-sizes-11)',
  typographyFontSizes12: 'var(--typography-font-sizes-12)',
  typographyFontSizes13: 'var(--typography-font-sizes-13)',
  typographyFontSizes14: 'var(--typography-font-sizes-14)',
  typographyFontWeightsLight: 'var(--typography-font-weights-light)',
  typographyFontWeightsNormal: 'var(--typography-font-weights-normal)',
  typographyFontWeightsMedium: 'var(--typography-font-weights-medium)',
  typographyFontWeightsSemibold: 'var(--typography-font-weights-semibold)',
  typographyFontWeightsBold: 'var(--typography-font-weights-bold)',
  typographyDesktopH900: 'var(--typography-desktop-h900)',
  typographyDesktopH800: 'var(--typography-desktop-h800)',
  typographyDesktopH700: 'var(--typography-desktop-h700)',
  typographyDesktopH600: 'var(--typography-desktop-h600)',
  typographyDesktopH500: 'var(--typography-desktop-h500)',
  typographyDesktopH400: 'var(--typography-desktop-h400)',
  typographyDesktopH300: 'var(--typography-desktop-h300)',
  typographyDesktopH200: 'var(--typography-desktop-h200)',
  typographyDesktopH100: 'var(--typography-desktop-h100)',
  typographyDesktopT300: 'var(--typography-desktop-t300)',
  typographyDesktopT300Strong: 'var(--typography-desktop-t300-strong)',
  typographyDesktopT200: 'var(--typography-desktop-t200)',
  typographyDesktopT200Strong: 'var(--typography-desktop-t200-strong)',
  typographyDesktopT100: 'var(--typography-desktop-t100)',
  typographyDesktopT100Strong: 'var(--typography-desktop-t100-strong)',
  typographyMobileH900: 'var(--typography-mobile-h900)',
  typographyMobileH800: 'var(--typography-mobile-h800)',
  typographyMobileH700: 'var(--typography-mobile-h700)',
  typographyMobileH600: 'var(--typography-mobile-h600)',
  typographyMobileH500: 'var(--typography-mobile-h500)',
  typographyMobileH400: 'var(--typography-mobile-h400)',
  typographyMobileH300: 'var(--typography-mobile-h300)',
  typographyMobileH200: 'var(--typography-mobile-h200)',
  typographyMobileH100: 'var(--typography-mobile-h100)',
  typographyMobileT300: 'var(--typography-mobile-t300)',
  typographyMobileT300Strong: 'var(--typography-mobile-t300-strong)',
  typographyMobileT200: 'var(--typography-mobile-t200)',
  typographyMobileT200Strong: 'var(--typography-mobile-t200-strong)',
  typographyMobileT100: 'var(--typography-mobile-t100)',
  typographyMobileT100Strong: 'var(--typography-mobile-t100-strong)',
  typographyDesktopH900LetterSpacing: 'var(--typography-desktop-h900-letter-spacing)',
  typographyDesktopH800LetterSpacing: 'var(--typography-desktop-h800-letter-spacing)',
  typographyDesktopH700LetterSpacing: 'var(--typography-desktop-h700-letter-spacing)',
  typographyDesktopH600LetterSpacing: 'var(--typography-desktop-h600-letter-spacing)',
  typographyDesktopH500LetterSpacing: 'var(--typography-desktop-h500-letter-spacing)',
  typographyDesktopH400LetterSpacing: 'var(--typography-desktop-h400-letter-spacing)',
  typographyDesktopH300LetterSpacing: 'var(--typography-desktop-h300-letter-spacing)',
  typographyDesktopH200LetterSpacing: 'var(--typography-desktop-h200-letter-spacing)',
  typographyDesktopH100LetterSpacing: 'var(--typography-desktop-h100-letter-spacing)',
  typographyDesktopT300LetterSpacing: 'var(--typography-desktop-t300-letter-spacing)',
  typographyDesktopT300StrongLetterSpacing: 'var(--typography-desktop-t300-strong-letter-spacing)',
  typographyDesktopT200LetterSpacing: 'var(--typography-desktop-t200-letter-spacing)',
  typographyDesktopT200StrongLetterSpacing: 'var(--typography-desktop-t200-strong-letter-spacing)',
  typographyDesktopT100LetterSpacing: 'var(--typography-desktop-t100-letter-spacing)',
  typographyDesktopT100StrongLetterSpacing: 'var(--typography-desktop-t100-strong-letter-spacing)',
  typographyMobileH900LetterSpacing: 'var(--typography-mobile-h900-letter-spacing)',
  typographyMobileH800LetterSpacing: 'var(--typography-mobile-h800-letter-spacing)',
  typographyMobileH700LetterSpacing: 'var(--typography-mobile-h700-letter-spacing)',
  typographyMobileH600LetterSpacing: 'var(--typography-mobile-h600-letter-spacing)',
  typographyMobileH500LetterSpacing: 'var(--typography-mobile-h500-letter-spacing)',
  typographyMobileH400LetterSpacing: 'var(--typography-mobile-h400-letter-spacing)',
  typographyMobileH300LetterSpacing: 'var(--typography-mobile-h300-letter-spacing)',
  typographyMobileH200LetterSpacing: 'var(--typography-mobile-h200-letter-spacing)',
  typographyMobileH100LetterSpacing: 'var(--typography-mobile-h100-letter-spacing)',
  typographyMobileT300LetterSpacing: 'var(--typography-mobile-t300-letter-spacing)',
  typographyMobileT300StrongLetterSpacing: 'var(--typography-mobile-t300-strong-letter-spacing)',
  typographyMobileT200LetterSpacing: 'var(--typography-mobile-t200-letter-spacing)',
  typographyMobileT200StrongLetterSpacing: 'var(--typography-mobile-t200-strong-letter-spacing)',
  typographyMobileT100LetterSpacing: 'var(--typography-mobile-t100-letter-spacing)',
  typographyMobileT100StrongLetterSpacing: 'var(--typography-mobile-t100-strong-letter-spacing)',
  typographyDesktopH900TextTransform: 'var(--typography-desktop-h900-text-transform)',
  typographyDesktopH800TextTransform: 'var(--typography-desktop-h800-text-transform)',
  typographyDesktopH700TextTransform: 'var(--typography-desktop-h700-text-transform)',
  typographyDesktopH600TextTransform: 'var(--typography-desktop-h600-text-transform)',
  typographyDesktopH500TextTransform: 'var(--typography-desktop-h500-text-transform)',
  typographyDesktopH400TextTransform: 'var(--typography-desktop-h400-text-transform)',
  typographyDesktopH300TextTransform: 'var(--typography-desktop-h300-text-transform)',
  typographyDesktopH200TextTransform: 'var(--typography-desktop-h200-text-transform)',
  typographyDesktopH100TextTransform: 'var(--typography-desktop-h100-text-transform)',
  typographyDesktopT300TextTransform: 'var(--typography-desktop-t300-text-transform)',
  typographyDesktopT300StrongTextTransform: 'var(--typography-desktop-t300-strong-text-transform)',
  typographyDesktopT200TextTransform: 'var(--typography-desktop-t200-text-transform)',
  typographyDesktopT200StrongTextTransform: 'var(--typography-desktop-t200-strong-text-transform)',
  typographyDesktopT100TextTransform: 'var(--typography-desktop-t100-text-transform)',
  typographyDesktopT100StrongTextTransform: 'var(--typography-desktop-t100-strong-text-transform)',
  typographyMobileH900TextTransform: 'var(--typography-mobile-h900-text-transform)',
  typographyMobileH800TextTransform: 'var(--typography-mobile-h800-text-transform)',
  typographyMobileH700TextTransform: 'var(--typography-mobile-h700-text-transform)',
  typographyMobileH600TextTransform: 'var(--typography-mobile-h600-text-transform)',
  typographyMobileH500TextTransform: 'var(--typography-mobile-h500-text-transform)',
  typographyMobileH400TextTransform: 'var(--typography-mobile-h400-text-transform)',
  typographyMobileH300TextTransform: 'var(--typography-mobile-h300-text-transform)',
  typographyMobileH200TextTransform: 'var(--typography-mobile-h200-text-transform)',
  typographyMobileH100TextTransform: 'var(--typography-mobile-h100-text-transform)',
  typographyMobileT300TextTransform: 'var(--typography-mobile-t300-text-transform)',
  typographyMobileT300StrongTextTransform: 'var(--typography-mobile-t300-strong-text-transform)',
  typographyMobileT200TextTransform: 'var(--typography-mobile-t200-text-transform)',
  typographyMobileT200StrongTextTransform: 'var(--typography-mobile-t200-strong-text-transform)',
  typographyMobileT100TextTransform: 'var(--typography-mobile-t100-text-transform)',
  typographyMobileT100StrongTextTransform: 'var(--typography-mobile-t100-strong-text-transform)',
}
export const cVar = (key: keyof typeof theme) => {
  return theme[key]
}
