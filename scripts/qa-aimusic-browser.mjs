import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.env.AIMUSIC_QA_URL || 'http://127.0.0.1:3107/';
const ROOT = resolve(import.meta.dirname, '..');
const profileDir = mkdtempSync(join(tmpdir(), 'aimusic-cdp-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--disable-background-networking',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=0',
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

async function waitForDevtools() {
  const portFile = join(profileDir, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
      if (port) return Number(port);
    } catch {
      // Chrome has not written the endpoint yet.
    }
    await sleep(100);
  }
  throw new Error('Chrome DevTools endpoint did not become ready.');
}

function createClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const eventWaiters = new Map();

  const ready = new Promise((resolveReady, rejectReady) => {
    socket.addEventListener('open', resolveReady, { once: true });
    socket.addEventListener('error', rejectReady, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
      return;
    }
    const waiters = eventWaiters.get(message.method);
    if (!waiters?.length) return;
    eventWaiters.delete(message.method);
    for (const waiter of waiters) waiter(message.params);
  });

  async function send(method, params = {}) {
    await ready;
    const id = nextId;
    nextId += 1;
    return new Promise((resolveSend, rejectSend) => {
      pending.set(id, { resolve: resolveSend, reject: rejectSend });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  function waitEvent(method, timeoutMs = 10000) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timer = setTimeout(() => rejectEvent(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const waiters = eventWaiters.get(method) || [];
      waiters.push((params) => {
        clearTimeout(timer);
        resolveEvent(params);
      });
      eventWaiters.set(method, waiters);
    });
  }

  return { send, waitEvent, close: () => socket.close() };
}

async function main() {
  const port = await waitForDevtools();
  const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(URL)}`, { method: 'PUT' }).then((response) => response.json());
  const client = createClient(target.webSocketDebuggerUrl);
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  async function evaluate(expression) {
    const result = await client.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
    return result.result.value;
  }

  async function navigate(width, height, mobile) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: width,
      screenHeight: height,
    });
    const loaded = client.waitEvent('Page.loadEventFired');
    await client.send('Page.navigate', { url: URL });
    await loaded;
    await evaluate(`localStorage.removeItem('ainow.analytics-consent.v1')`);
    const reloaded = client.waitEvent('Page.loadEventFired');
    await client.send('Page.reload', { ignoreCache: true });
    await reloaded;
    await sleep(1500);
  }

  async function capture(fileName) {
    const metrics = await client.send('Page.getLayoutMetrics');
    const size = metrics.cssContentSize;
    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 },
    });
    const output = join(ROOT, fileName);
    writeFileSync(output, Buffer.from(shot.data, 'base64'));
    return { output, width: size.width, height: size.height };
  }

  async function captureViewport(fileName) {
    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const output = join(ROOT, fileName);
    writeFileSync(output, Buffer.from(shot.data, 'base64'));
    return output;
  }

  await navigate(1440, 1000, false);
  const desktopInitial = await evaluate(`(() => {
    const consent = document.querySelector('aside[aria-label="ანალიტიკის არჩევა"]');
    const assistantScript = document.querySelector('script[src*="aistaff.ge/widget.js"]');
    const assistantBubble = document.querySelector('#widget-chat-bubble');
    const assistantCta = assistantBubble?.querySelector('.iai-theme-light')?.shadowRoot?.querySelector('.iai-cta');
    const consentRect = consent?.getBoundingClientRect();
    const assistantRect = assistantBubble?.getBoundingClientRect();
    const assistantVisible = assistantBubble ? Number.parseFloat(getComputedStyle(assistantBubble).opacity) > 0.1 : false;
    const consentOverlapsAssistant = Boolean(assistantVisible && consentRect && assistantRect && !(
      consentRect.right <= assistantRect.left || consentRect.left >= assistantRect.right ||
      consentRect.bottom <= assistantRect.top || consentRect.top >= assistantRect.bottom
    ));
    return {
      title: document.title,
      locale: document.documentElement.lang,
      viewport: [innerWidth, innerHeight],
      scrollWidth: document.documentElement.scrollWidth,
      cyrillicVisible: /[\u0400-\u04ff]/.test(document.body.innerText),
      staleCopyVisible: ['საქმე ხელით იწყება','ინფორმაცია სხვადასხვა ადგილასაა','შეცდომა გვიან ჩანს','Chat with us']
        .some((text) => document.body.innerText.includes(text)),
      demos: document.querySelectorAll('[data-landing-demo="true"]').length,
      heroState: document.querySelector('[data-demo-id="aimusic-venue-playlist"]')?.getAttribute('data-demo-state'),
      visibleSections: ['compare','dashboard','reviews','cases','integrations','resources','faq','cta'].filter((id) => document.getElementById(id)),
      analyticsBanner: {
        visible: Boolean(consent),
        manage: consent?.querySelector('summary')?.textContent?.replace('+', '').trim(),
        body: consent?.querySelector('p')?.textContent,
        buttons: [...(consent?.querySelectorAll('button') || [])].map((button) => button.textContent?.trim()),
        loaderBeforeConsent: Boolean(document.querySelector('#ainow-ga4-loader')),
        overlapsAssistant: consentOverlapsAssistant,
      },
      assistant: {
        scriptPresent: Boolean(assistantScript),
        botId: assistantScript?.getAttribute('data-bot-id'),
        renderedNodePresent: [...document.querySelectorAll('iframe, [id], [class]')].some((node) =>
          [node.id, node.className, node.getAttribute?.('src')]
            .map((value) => typeof value === 'string' ? value.toLowerCase() : '')
            .some((value) => value.includes('aistaff')),
        ),
        bubbleText: (assistantCta?.textContent || assistantBubble?.textContent || '').replace(/\\s+/g, ' ').trim(),
        bubbleAriaLabel: assistantBubble?.getAttribute('aria-label'),
      },
    };
  })()`);

  const consentShot = await captureViewport('_qa_aimusic_consent_desktop.png');

  const analyticsConsent = await evaluate(`(async () => {
    const accept = [...document.querySelectorAll('aside[aria-label="ანალიტიკის არჩევა"] button')]
      .find((button) => button.textContent?.includes('ანალიტიკის ჩართვა'));
    accept?.click();
    await new Promise((resolve) => setTimeout(resolve, 180));
    return {
      clicked: Boolean(accept),
      stored: localStorage.getItem('ainow.analytics-consent.v1'),
      loaderAfterConsent: Boolean(document.querySelector('#ainow-ga4-loader')),
      bannerClosed: !document.querySelector('aside[aria-label="ანალიტიკის არჩევა"]'),
    };
  })()`);

  const interactions = await evaluate(`(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const clickByText = (selector, text) => {
      const element = [...document.querySelectorAll(selector)].find((node) => node.textContent?.includes(text));
      element?.click();
      return Boolean(element);
    };
    const result = {};
    const heroProfiles = [];
    for (const venue of ['კაფე', 'სალონი', 'ტერასა', 'სასტუმრო']) {
      const selected = clickByText('.music-proof-venues button', venue);
      await wait(150);
      document.querySelector('.music-proof-play')?.click();
      await wait(450);
      heroProfiles.push({
        venue,
        selected,
        playlistTitle: document.querySelector('.music-proof-playlist-heading strong')?.textContent || null,
        source: document.querySelector('audio[data-music-preview]')?.currentSrc || null,
        playing: document.querySelector('.music-proof-track.is-playing') !== null,
        pauseIconVisible: document.querySelector('.music-proof-track.is-playing .music-proof-play svg') !== null,
      });
      document.querySelector('.music-proof-play')?.click();
      await wait(80);
      heroProfiles[heroProfiles.length - 1].playIconRestored = document.querySelector('.music-proof-play svg') !== null;
    }
    result.heroProfiles = heroProfiles;
    result.heroProfilesDistinct = new Set(heroProfiles.map((profile) => profile.source).filter(Boolean)).size === 4;
    result.heroIconsVisible = heroProfiles.every((profile) => profile.pauseIconVisible && profile.playIconRestored);
    result.heroPlaylistTitle = heroProfiles[0]?.playlistTitle || null;
    result.heroTrackCount = document.querySelectorAll('.music-proof-track').length;
    clickByText('.music-proof-venues button', 'კაფე');
    await wait(100);
    document.querySelector('.music-proof-play')?.click();
    await wait(500);
    result.soundPlaying = document.querySelector('.music-proof-track.is-playing') !== null;
    result.activeTrack = document.querySelector('.music-proof-track.is-active .music-proof-track-copy strong')?.textContent;
    result.audioSource = document.querySelector('audio[data-music-preview]')?.currentSrc || null;
    document.querySelector('.music-proof-play')?.click();

    result.standardSections = ['compare','dashboard','reviews','cases','integrations','resources']
      .every((id) => Boolean(document.getElementById(id)));
    result.musicExamplesOutsideHero = document.querySelectorAll('main [data-landing-demo="true"]:not([data-demo-id="aimusic-venue-playlist"])').length;

    document.querySelector('#faq details')?.click();
    await wait(500);
    result.faqOpened = document.querySelector('#faq details')?.open === true;

    const phone = document.querySelector('#cta-phone');
    if (phone) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(phone, '12');
      phone.dispatchEvent(new Event('input', { bubbles: true }));
      phone.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('#cta button[type="submit"]')?.click();
      await wait(250);
    }
    result.invalidPhoneBlocked = document.querySelector('#cta-phone-error')?.textContent?.includes('სწორი ტელეფონის ნომერი') === true;
    return result;
  })()`);
  const desktopShot = await capture('_qa_aimusic_desktop_full.png');

  await navigate(390, 844, true);
  const mobileConsentShot = await captureViewport('_qa_aimusic_consent_mobile.png');
  const mobileInitial = await evaluate(`(async () => {
    const consent = document.querySelector('aside[aria-label="ანალიტიკის არჩევა"]');
    const assistantBubble = document.querySelector('#widget-chat-bubble');
    const assistantLabel = assistantBubble?.querySelector('.iai-theme-light')?.shadowRoot?.querySelector('.iai-cta');
    const bubbleRect = assistantBubble?.getBoundingClientRect();
    const labelRect = assistantLabel?.getBoundingClientRect();
    const consentRect = consent?.getBoundingClientRect();
    const assistantVisible = assistantBubble ? Number.parseFloat(getComputedStyle(assistantBubble).opacity) > 0.1 : false;
    const consentOverlapsAssistant = Boolean(assistantVisible && consentRect && bubbleRect && !(
      consentRect.right <= bubbleRect.left || consentRect.left >= bubbleRect.right ||
      consentRect.bottom <= bubbleRect.top || consentRect.top >= bubbleRect.bottom
    ));
    const consentVisible = Boolean(consent);
    const decline = [...(consent?.querySelectorAll('button') || [])].find((button) => button.textContent?.includes('მხოლოდ აუცილებელი'));
    decline?.click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const keySelectors = ['.hero-family-shell', '.music-hero-proof', '.pl-compare-table', '.pl-dashboard-panel', '.pl-case-list', '#faq', '#cta'];
    const boxes = keySelectors.flatMap((selector) => [...document.querySelectorAll(selector)]).filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).map((element) => {
      const rect = element.getBoundingClientRect();
      return { selector: element.className || element.id, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
    });
    const navButton = [...document.querySelectorAll('nav button')].find((button) => button.getAttribute('aria-controls'));
    navButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    return {
      viewport: [innerWidth, innerHeight],
      scrollWidth: document.documentElement.scrollWidth,
      overflowFree: document.documentElement.scrollWidth <= innerWidth + 1,
      boxes,
      mobileMenuOpened: navButton?.getAttribute('aria-expanded') === 'true',
      mobileMenuLabel: navButton?.getAttribute('aria-label'),
      demos: document.querySelectorAll('[data-landing-demo="true"]').length,
      analyticsBannerVisible: consentVisible,
      analyticsDeclineStored: localStorage.getItem('ainow.analytics-consent.v1'),
      analyticsOverlapsAssistant: consentOverlapsAssistant,
      assistantVisibleWhileConsentPending: assistantVisible,
      assistantScriptPresent: Boolean(document.querySelector('script[src*="aistaff.ge/widget.js"]')),
      assistantBubble: {
        rect: bubbleRect ? { width: Math.round(bubbleRect.width), height: Math.round(bubbleRect.height), left: Math.round(bubbleRect.left), top: Math.round(bubbleRect.top) } : null,
        labelRect: labelRect ? { width: Math.round(labelRect.width), height: Math.round(labelRect.height), left: Math.round(labelRect.left), top: Math.round(labelRect.top) } : null,
        labelText: assistantLabel?.textContent,
      },
    };
  })()`);
  const mobileShot = await capture('_qa_aimusic_mobile_full.png');

  client.close();
  return { desktopInitial, consentShot, analyticsConsent, interactions, desktopShot, mobileConsentShot, mobileInitial, mobileShot };
}

try {
  const result = await main();
  console.log(JSON.stringify(result, null, 2));
} finally {
  chrome.kill();
  await sleep(1000);
  rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}
