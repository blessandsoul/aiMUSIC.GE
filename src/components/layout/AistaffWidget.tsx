'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const AINOW_MARKETING_BOT_ID = '5044f2f0-ab9b-417f-83cc-cc5c633bb0d5';

function localizeLauncher(): void {
  const bubble = document.getElementById('widget-chat-bubble');
  if (!bubble) return;

  bubble.setAttribute('aria-label', 'AI ასისტენტის გახსნა');

  const compact = window.innerWidth < 768;
  const baseBottom = bubble.dataset.aimusicBaseBottom || window.getComputedStyle(bubble).bottom || '24px';
  bubble.dataset.aimusicBaseBottom = baseBottom;
  const consentPending = compact && Boolean(document.querySelector('[data-analytics-consent="true"]'));
  bubble.style.bottom = baseBottom;
  bubble.style.opacity = consentPending ? '0' : '1';
  bubble.style.pointerEvents = consentPending ? 'none' : 'auto';
  bubble.style.transform = consentPending ? 'scale(0.94)' : 'scale(1)';

  const themeHost = bubble.querySelector<HTMLElement>('.iai-theme-light');
  const cta = bubble.querySelector('.iai-cta') || themeHost?.shadowRoot?.querySelector('.iai-cta');
  const textNode = cta
    ? Array.from(cta.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)
    : undefined;
  if (textNode) textNode.nodeValue = 'მოგვწერეთ';
}

export function AistaffWidget(): React.ReactElement {
  useEffect(() => {
    let delayedSync: number | null = null;
    const retryTimers: number[] = [];
    const syncLauncher = (): void => {
      localizeLauncher();
      window.requestAnimationFrame(localizeLauncher);
      if (delayedSync !== null) window.clearTimeout(delayedSync);
      delayedSync = window.setTimeout(localizeLauncher, 300);
    };

    syncLauncher();
    const observer = new MutationObserver(syncLauncher);
    observer.observe(document.body, { childList: true, subtree: true });
    for (const delay of [700, 1400, 2800]) {
      retryTimers.push(window.setTimeout(localizeLauncher, delay));
    }
    window.addEventListener('resize', syncLauncher);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncLauncher);
      if (delayedSync !== null) window.clearTimeout(delayedSync);
      retryTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <Script
      src="https://aistaff.ge/widget.js?v=20260816-1"
      data-bot-id={AINOW_MARKETING_BOT_ID}
      strategy="afterInteractive"
      onReady={localizeLauncher}
    />
  );
}
