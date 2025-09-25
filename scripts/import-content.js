const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const referencePath = resolve(__dirname, '..', 'reference', 'original-index.html');
const outputPath = resolve(__dirname, '..', 'src', 'data', 'referenceContent.ts');

function stripTags(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractInnerHTML(source, id) {
  const pattern = new RegExp(
    String.raw`<([a-zA-Z0-9]+)[^>]*id=["']${id}["'][^>]*>([\s\S]*?)<\/\1>`,
    'i'
  );
  const match = source.match(pattern);
  return match ? match[2].trim() : null;
}

function extractScriptJSON(source, id) {
  const pattern = new RegExp(
    String.raw`<script[^>]*id=["']${id}["'][^>]*>([\s\S]*?)<\/script>`,
    'i'
  );
  const match = source.match(pattern);
  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`Failed to parse JSON for ${id}: ${error.message}`);
  }
}

function extractText(source, id) {
  const html = extractInnerHTML(source, id);
  return html ? stripTags(html) : null;
}

function extractList(source, id) {
  const html = extractInnerHTML(source, id);
  if (!html) {
    return null;
  }
  const matches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (matches.length === 0) {
    return null;
  }
  return matches.map((match) => stripTags(match[1]));
}

function readFallback() {
  if (!existsSync(outputPath)) {
    return {};
  }
  const source = readFileSync(outputPath, 'utf8');
  const match = source.match(/export const referenceContent: ReferenceContent = (\{[\s\S]*?\});/);
  if (!match) {
    return {};
  }
  try {
    return Function(`return (${match[1]});`)();
  } catch (error) {
    console.warn('Unable to parse existing referenceContent.ts, using empty defaults.');
    console.warn(error);
    return {};
  }
}

function buildContent(referenceHTML, fallback) {
  const heroTitle = extractText(referenceHTML, 'hero-title') ?? fallback?.hero?.title;
  const heroDescription = extractText(referenceHTML, 'hero-description') ?? fallback?.hero?.description;
  const heroUpdated = extractText(referenceHTML, 'hero-updated') ?? fallback?.hero?.lastUpdatedLabel;

  const progressJSON = extractScriptJSON(referenceHTML, 'current-phase-progress');
  const cardsJSON = extractScriptJSON(referenceHTML, 'current-phase-cards');
  const securityStatsJSON = extractScriptJSON(referenceHTML, 'security-stats');
  const securityTableJSON = extractScriptJSON(referenceHTML, 'security-table');
  const roadmapJSON = extractScriptJSON(referenceHTML, 'roadmap-items');
  const learnAccordionJSON = extractScriptJSON(referenceHTML, 'learn-accordion');
  const learnLinksJSON = extractScriptJSON(referenceHTML, 'learn-links');

  const bullets = extractList(referenceHTML, 'security-bullets') ?? fallback?.security?.bullets;

  const result = {
    hero: {
      title: heroTitle ?? 'Hero title missing',
      description: heroDescription ?? 'Hero description missing',
      lastUpdatedLabel: heroUpdated ?? 'Last updated copy missing'
    },
    currentPhase: {
      title: fallback?.currentPhase?.title ?? 'Current Phase Overview',
      description: fallback?.currentPhase?.description ?? 'Replace with imported description.',
      progress: {
        value: Number(progressJSON?.value ?? fallback?.currentPhase?.progress?.value ?? 0),
        label: progressJSON?.label ?? fallback?.currentPhase?.progress?.label ?? 'Progress',
        assistive:
          progressJSON?.assistive ?? fallback?.currentPhase?.progress?.assistive ?? 'Progress description missing.'
      },
      cards: Array.isArray(cardsJSON?.cards) && cardsJSON.cards.length
        ? cardsJSON.cards
        : fallback?.currentPhase?.cards ?? []
    },
    security: {
      title: fallback?.security?.title ?? 'Security & Audits',
      bullets: bullets ?? [],
      statsTitle: securityStatsJSON?.title ?? fallback?.security?.statsTitle ?? 'Coverage',
      statCards: Array.isArray(securityStatsJSON?.items) && securityStatsJSON.items.length
        ? securityStatsJSON.items
        : fallback?.security?.statCards ?? [],
      tableTitle: securityTableJSON?.title ?? fallback?.security?.tableTitle ?? 'Upcoming reviews',
      tableRows: Array.isArray(securityTableJSON?.rows) && securityTableJSON.rows.length
        ? securityTableJSON.rows
        : fallback?.security?.tableRows ?? []
    },
    roadmap: {
      title: fallback?.roadmap?.title ?? 'Road to Mainnet',
      description: fallback?.roadmap?.description ?? 'Roadmap description missing.',
      milestones: Array.isArray(roadmapJSON?.items) && roadmapJSON.items.length
        ? roadmapJSON.items
        : fallback?.roadmap?.milestones ?? []
    },
    learnMore: {
      title: fallback?.learnMore?.title ?? 'Learn More',
      accordion: Array.isArray(learnAccordionJSON?.items) && learnAccordionJSON.items.length
        ? learnAccordionJSON.items
        : fallback?.learnMore?.accordion ?? [],
      actions: Array.isArray(learnLinksJSON?.items) && learnLinksJSON.items.length
        ? learnLinksJSON.items
        : fallback?.learnMore?.actions ?? []
    }
  };

  return result;
}

function writeContent(prefix, content) {
  const jsonLiteral = JSON.stringify(content, null, 2);
  const output = `${prefix}export const referenceContent: ReferenceContent = ${jsonLiteral};\n\nexport default referenceContent;\n`;
  writeFileSync(outputPath, output, 'utf8');
}

function main() {
  if (!existsSync(referencePath)) {
    throw new Error('reference/original-index.html does not exist. Paste the source HTML before running import:content.');
  }

  const referenceHTML = readFileSync(referencePath, 'utf8');
  const fallbackSource = readFileSync(outputPath, 'utf8');
  const fallback = readFallback();
  const prefix = fallbackSource.split('export const referenceContent')[0];
  const content = buildContent(referenceHTML, fallback);
  writeContent(prefix, content);
  console.log('Updated referenceContent.ts from reference/original-index.html');
}

main();
