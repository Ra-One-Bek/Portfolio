export type Work = {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  tech: string[];
  accent: string;
};

export const works: Work[] = [
  {
    id: "01",
    title: "RaOne online shopping",
    description:
      "AI-powered fashion e-commerce платформа нового поколения с 3D визуализацией и персональными рекомендациями.",
    image: "",
    github: "#",
    tech: ["React, NestJs"],
    accent: "#6366f1",
  },
  {
    id: "02",
    title: "Aqwa AI",
    description:
      "AI-платформа для изучения экономики с персонализированными курсами и адаптивным обучением.",
    image: "",
    github: "#",
    tech: ["React, NestJs"],
    accent: "#06b6d4",
  },
  {
    id: "03",
    title: "UberTrack",
    description:
      "AI-платформа аренды грузового транспорта с умным подбором под маршрут и бюджет.",
    image: "",
    github: "#",
    tech: ["React, NestJs"],
    accent: "#f59e0b",
  },
  {
    id: "04",
    title: "EyesApp",
    description:
      "Умные очки с AI для навигации, взаимодействия и помощи в реальном мире.",
    image: "img/webpages/eyesapp/eyesapp-homepage.png",
    github: "#",
    tech: ["React, NestJs"],
    accent: "#10b981",
  },
  {
    id: "05",
    title: "KZ Football Analytics",
    description:
      "Аналитика казахстанского футбола с AI-инсайтами и статистикой матчей.",
    image: "",
    github: "#",
    tech: ["React, NestJs"],
    accent: "#ef4444",
  },
  {
    id: "06",
    title: "PlantCare AI",
    description:
      "Приложение для распознавания растений и заболеваний с помощью AI.",
    image: "",
    github: "#",
    tech: ["Flutter"],
    accent: "#84cc16",
  },
];

export const GALLERY_SPACING_DESKTOP = 780;
export const GALLERY_SPACING_MOBILE = 300;
export const PANEL_WIDTH_DESKTOP = 660;
export const PANEL_WIDTH_MOBILE = 300;
export const ROPE_THICKNESS_DESKTOP = 3;
export const ROPE_THICKNESS_MOBILE = 2.5;
export const PANEL_CLIP_HEIGHT = 11;
export const PANEL_CLIP_GAP = 4;
export const PANEL_CAPTION_HEIGHT_DESKTOP = 72;
export const PANEL_CAPTION_HEIGHT_MOBILE = 56;

export function getPanelHeight(isMobile: boolean) {
  const width = isMobile ? PANEL_WIDTH_MOBILE : PANEL_WIDTH_DESKTOP;
  const caption = isMobile ? PANEL_CAPTION_HEIGHT_MOBILE : PANEL_CAPTION_HEIGHT_DESKTOP;
  return Math.round(width * 0.75 + caption);
}

export function getHangAssemblyHeight(isMobile: boolean) {
  return getPanelHeight(isMobile) + PANEL_CLIP_HEIGHT + PANEL_CLIP_GAP;
}

export function getRopeTop(isMobile: boolean) {
  return `calc(50% - ${getHangAssemblyHeight(isMobile) / 2}px)`;
}
