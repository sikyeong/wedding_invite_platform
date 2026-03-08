#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "assets", "images");

const ensureDir = (target) => fs.mkdirSync(target, { recursive: true });

const writeSvg = (filename, svg) => {
  const target = path.join(outDir, filename);
  fs.writeFileSync(target, svg, "utf8");
};

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const paletteList = [
  ["#f6d8d3", "#f1b8ab", "#d48f7f"],
  ["#f4ebdc", "#e7d2b0", "#c9ae8b"],
  ["#dce8f5", "#b6d0ef", "#7ca6d5"],
  ["#e7e0f6", "#cfbef0", "#aa8de1"],
  ["#dff2eb", "#bce4d6", "#7fbfa7"],
  ["#f6e2d0", "#eec39f", "#d59864"],
  ["#e4e7ef", "#c7cedf", "#939fbd"],
  ["#f3dfe8", "#e9bcd0", "#cd8fac"],
  ["#e8f0da", "#cbddb0", "#9db476"],
  ["#f4e9f5", "#dfc7e2", "#bc9bc3"],
  ["#dbeef2", "#b5dce4", "#7db6c3"],
  ["#f4e6df", "#e7c9bc", "#c49f8e"],
];

const cardSvg = ({ index, colors }) => {
  const [c1, c2, c3] = colors;
  const i = String(index).padStart(2, "0");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280" fill="none">
  <defs>
    <linearGradient id="bg-${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="52%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <linearGradient id="glass-${i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.68"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.34"/>
    </linearGradient>
  </defs>
  <rect width="720" height="1280" rx="32" fill="url(#bg-${i})"/>
  <g opacity="0.72">
    <circle cx="150" cy="180" r="112" fill="#ffffff" fill-opacity="0.28"/>
    <circle cx="620" cy="1080" r="160" fill="#ffffff" fill-opacity="0.2"/>
    <circle cx="96" cy="1040" r="74" fill="#ffffff" fill-opacity="0.2"/>
  </g>
  <rect x="48" y="80" width="624" height="1120" rx="28" fill="url(#glass-${i})"/>
  <rect x="96" y="230" width="528" height="640" rx="16" fill="#ffffff" fill-opacity="0.66"/>
  <rect x="96" y="900" width="240" height="24" rx="12" fill="#ffffff" fill-opacity="0.8"/>
  <rect x="96" y="944" width="420" height="20" rx="10" fill="#ffffff" fill-opacity="0.7"/>
  <rect x="96" y="1000" width="528" height="120" rx="16" fill="#ffffff" fill-opacity="0.42"/>
  <text x="360" y="164" text-anchor="middle" fill="#2f2f34" font-size="34" font-family="Pretendard, Arial, sans-serif" letter-spacing="4">WEDDING SAMPLE ${i}</text>
  <text x="360" y="1130" text-anchor="middle" fill="#2f2f34" font-size="24" font-family="Pretendard, Arial, sans-serif" letter-spacing="2">MOCKUP ONLY</text>
</svg>`;
};

const phoneSvg = ({ index, colors }) => {
  const [c1, c2, c3] = colors;
  const i = String(index).padStart(2, "0");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1800" viewBox="0 0 900 1800" fill="none">
  <defs>
    <linearGradient id="bg-${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="screen-${i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.36"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1800" fill="#f7f5f2"/>
  <rect x="220" y="84" width="460" height="1632" rx="74" fill="#111216"/>
  <rect x="244" y="156" width="412" height="1488" rx="52" fill="url(#bg-${i})"/>
  <rect x="424" y="112" width="52" height="8" rx="4" fill="#2c2d33"/>
  <rect x="274" y="270" width="352" height="980" rx="30" fill="url(#screen-${i})"/>
  <circle cx="450" cy="1320" r="56" fill="#ffffff" fill-opacity="0.62"/>
  <circle cx="450" cy="1320" r="22" fill="${c3}"/>
  <text x="450" y="232" text-anchor="middle" fill="#17181c" font-size="36" font-family="Pretendard, Arial, sans-serif">THEIRMOOD STYLE</text>
  <text x="450" y="1420" text-anchor="middle" fill="#17181c" font-size="28" font-family="Pretendard, Arial, sans-serif">MOBILE MOCKUP ${i}</text>
</svg>`;
};

const avatarSvg = ({ index, colors }) => {
  const [c1, c2, c3] = colors;
  const i = String(index).padStart(2, "0");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none">
  <defs>
    <linearGradient id="a-${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" rx="150" fill="url(#a-${i})"/>
  <circle cx="150" cy="122" r="58" fill="#fff" fill-opacity="0.85"/>
  <rect x="72" y="182" width="156" height="82" rx="41" fill="${c3}" fill-opacity="0.88"/>
  <text x="150" y="286" text-anchor="middle" fill="#1c1d22" font-size="20" font-family="Arial, sans-serif">USER ${i}</text>
</svg>`;
};

const brandLogoSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40" viewBox="0 0 220 40" fill="none">
  <rect width="40" height="40" rx="12" fill="#f4d24d"/>
  <path d="M12 22.5L20 14L28 22.5V29H12V22.5Z" fill="#17181c"/>
  <circle cx="20" cy="12" r="3" fill="#17181c"/>
  <text x="52" y="27" fill="#101114" font-size="24" font-family="Pretendard, Arial, sans-serif" font-weight="700">THEIRMOOD LAB</text>
</svg>`;

const sectionPhotoSvg = ({ title, subtitle, colors, file }) => {
  const [c1, c2, c3] = colors;
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  return {
    file,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="none">
  <defs>
    <linearGradient id="s-${file}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" rx="30" fill="url(#s-${file})"/>
  <circle cx="1060" cy="126" r="112" fill="#fff" fill-opacity="0.26"/>
  <circle cx="180" cy="620" r="144" fill="${c3}" fill-opacity="0.3"/>
  <rect x="112" y="110" width="1060" height="500" rx="22" fill="#fff" fill-opacity="0.52"/>
  <text x="160" y="250" fill="#17181c" font-size="58" font-family="Pretendard, Arial, sans-serif" font-weight="700">${safeTitle}</text>
  <text x="160" y="328" fill="#17181c" font-size="34" font-family="Pretendard, Arial, sans-serif">${safeSubtitle}</text>
  <rect x="160" y="386" width="340" height="16" rx="8" fill="#17181c" fill-opacity="0.36"/>
  <rect x="160" y="422" width="460" height="16" rx="8" fill="#17181c" fill-opacity="0.24"/>
</svg>`,
  };
};

const generate = () => {
  ensureDir(outDir);

  writeSvg("logo.svg", brandLogoSvg());

  for (let i = 0; i < 12; i += 1) {
    writeSvg(`card-sample-${String(i + 1).padStart(2, "0")}.svg`, cardSvg({ index: i + 1, colors: paletteList[i % paletteList.length] }));
  }

  for (let i = 0; i < 2; i += 1) {
    writeSvg(`phone-mockup-${String(i + 1).padStart(2, "0")}.svg`, phoneSvg({ index: i + 1, colors: paletteList[(i + 4) % paletteList.length] }));
  }

  for (let i = 0; i < 8; i += 1) {
    writeSvg(`review-avatar-${String(i + 1).padStart(2, "0")}.svg`, avatarSvg({ index: i + 1, colors: paletteList[(i + 2) % paletteList.length] }));
  }

  const sectionShots = [
    { file: "section-rsvp.svg", title: "참석 여부 수집", subtitle: "모바일 청첩장 안에서 실시간으로 확인" },
    { file: "section-share.svg", title: "맞춤 공유 카드", subtitle: "카카오톡/인스타 감성에 맞는 썸네일" },
    { file: "section-guestbook.svg", title: "방명록 & 통계", subtitle: "예식 전후 반응을 한눈에 파악" },
  ];

  sectionShots.forEach((item, idx) => {
    const art = sectionPhotoSvg({
      title: item.title,
      subtitle: item.subtitle,
      file: item.file.replace(".svg", ""),
      colors: paletteList[(idx + 7) % paletteList.length],
    });
    writeSvg(item.file, art.svg);
  });
};

generate();
console.log("Mockup images generated in assets/images");
