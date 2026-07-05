// Station ring — the single source of truth for routes, plates, and screen
// rects (spec §4). ringIndex drives indexed rotation with wrap; screen rects
// are percentages OF THE PLATE (2752×1536), measured per plate.

export type StationId = 'media' | 'discography' | 'tour' | 'gallery' | 'about' | 'press' | 'store' | 'terminal';

export interface ScreenRect {
  left: number; // % of plate width
  top: number; // % of plate height
  width: number;
  height: number;
}

export interface Station {
  id: StationId;
  label: string;
  route: string;
  ringIndex: number;
  plate: string; // public path
  screen: ScreenRect;
}

// Screen rects measured per plate against the CRT glass (outline-verified).
// Most v2 plates share the same monitor geometry; discography's is larger.
const SCREEN: ScreenRect = { left: 36.1, top: 46.0, width: 27.9, height: 23.2 };
const SCREEN_DISCO: ScreenRect = { left: 34.7, top: 42.1, width: 30.6, height: 25.6 };

export const STATIONS: Station[] = [
  {
    id: 'media',
    label: 'MEDIA / PLAYBACK',
    route: '/media',
    ringIndex: 0,
    plate: '/plates/st-media.jpg',
    screen: SCREEN,
  },
  // ring order groups like-environments: outdoor pair (media, tour) adjacent;
  // the black-hole chamber wraps around to sit beside media's arc-blue shimmer
  {
    id: 'tour',
    label: 'TOUR / DISPATCH',
    route: '/tour',
    ringIndex: 1,
    plate: '/plates/st-tour.jpg',
    screen: SCREEN,
  },
  {
    id: 'discography',
    label: 'DISCOGRAPHY',
    route: '/discography',
    ringIndex: 2,
    plate: '/plates/st-discography.jpg',
    screen: SCREEN_DISCO,
  },
  {
    id: 'gallery',
    label: 'GALLERY',
    route: '/gallery',
    ringIndex: 3,
    plate: '/plates/st-gallery.jpg',
    screen: SCREEN,
  },
  {
    id: 'about',
    label: 'ABOUT / PERSONNEL',
    route: '/about',
    ringIndex: 4,
    plate: '/plates/st-about.jpg',
    screen: SCREEN,
  },
  {
    id: 'press',
    label: 'PRESS / ARCHIVE',
    route: '/press',
    ringIndex: 5,
    plate: '/plates/st-press.jpg',
    screen: SCREEN,
  },
  {
    id: 'store',
    label: 'REQUISITIONS',
    route: '/store',
    ringIndex: 6,
    plate: '/plates/st-store.jpg',
    screen: SCREEN,
  },
  {
    id: 'terminal',
    label: 'FACILITY TERMINAL',
    route: '/terminal',
    ringIndex: 7,
    plate: '/plates/st-terminal.jpg',
    screen: SCREEN,
  },
];

export const byId = (id: StationId): Station => STATIONS.find((s) => s.id === id)!;

export const isStationId = (v: string): v is StationId => STATIONS.some((s) => s.id === v);
