import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-11',
});

/* ---------------- TYPES ---------------- */

type Member = {
  _type: 'member';
  stageName: string;
  fullName: string;
  birthday: string;
  zodiac: string;
  role: string;
  colorHex: string;
};

type Album = {
  _type: 'album';
  title: string;
  type: string;
  releaseDate: string;
  tracklist: string[];
  spotifyLink: string;
};

type Tour = {
  _type: 'tour';
  eventName: string;
  location: string;
  date: string;
  status: 'Upcoming' | 'Sold Out' | 'Past';
  ticketLink: string;
};

type SeedDoc = Member | Album | Tour;

/* ---------------- ID GENERATOR ---------------- */

const makeId = (type: string, value: string) =>
  `${type}-${value}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/* ---------------- MEMBERS ---------------- */

const members: Member[] = [
  {
    _type: 'member',
    stageName: 'Aiah',
    fullName: 'Maraiah Queen Arceta',
    birthday: '2001-01-27',
    zodiac: 'Aquarius',
    role: 'Visual, Lead Rapper',
    colorHex: '#008691',
  },
  {
    _type: 'member',
    stageName: 'Colet',
    fullName: 'Ma. Nicolette Vergara',
    birthday: '2001-09-14',
    zodiac: 'Virgo',
    role: 'Main Vocal',
    colorHex: '#00FF00',
  },
  {
    _type: 'member',
    stageName: 'Maloi',
    fullName: 'Mary Loi Yves Ricalde',
    birthday: '2002-05-27',
    zodiac: 'Gemini',
    role: 'Main Vocal',
    colorHex: '#FFC40C',
  },
  {
    _type: 'member',
    stageName: 'Gwen',
    fullName: 'Gweneth L. Apuli',
    birthday: '2003-06-19',
    zodiac: 'Gemini',
    role: 'Lead Dancer, Sub Vocal',
    colorHex: '#FFA500',
  },
  {
    _type: 'member',
    stageName: 'Stacey',
    fullName: 'Stacey Aubrey Sevilleja',
    birthday: '2003-07-13',
    zodiac: 'Cancer',
    role: 'Main Dancer, Lead Rapper',
    colorHex: '#FF69B4',
  },
  {
    _type: 'member',
    stageName: 'Mikha',
    fullName: 'Mikhaela Janna Lim',
    birthday: '2003-11-08',
    zodiac: 'Scorpio',
    role: 'Main Rapper',
    colorHex: '#D94040',
  },
  {
    _type: 'member',
    stageName: 'Jhoanna',
    fullName: 'Jhoanna Robles',
    birthday: '2004-12-15',
    zodiac: 'Sagittarius',
    role: 'Leader, Main Vocal',
    colorHex: '#016795',
  },
  {
    _type: 'member',
    stageName: 'Sheena',
    fullName: 'Sheena Mae Catacutan',
    birthday: '2004-05-09',
    zodiac: 'Taurus',
    role: 'Main Dancer, Sub Vocal',
    colorHex: '#DDA0DD',
  },
];

/* ---------------- ALBUMS ---------------- */

const albums: Album[] = [
  {
    _type: 'album',
    title: 'Signals',
    type: 'EP',
    releaseDate: '2026-03-14',
    tracklist: ['Blush', 'Keep It Real', 'Signals', 'Honey Honey', 'Unang Kilig', 'Echo'],
    spotifyLink: 'https://open.spotify.com/album/7EKQ3Mw77tsyP4Ymaa5hlM',
  },
  {
    _type: 'album',
    title: 'FLAMES',
    type: 'Album',
    releaseDate: '2025-11-20',
    tracklist: ['Bikini', 'Slow Burn', 'Reign', 'Skyline', 'Focus', 'Afterglow', 'Wildfire', 'Golden'],
    spotifyLink: 'https://open.spotify.com/album/42s2X3WQppxdHafUT2dfmF',
  },
  {
    _type: 'album',
    title: 'Talaarawan',
    type: 'EP',
    releaseDate: '2024-03-08',
    tracklist: ['Karera', 'Pantayo', 'Salamin, Salamin', 'Ang Huling Cha Cha', 'Na Na Nandito Lang', 'Diyan Ka Lang'],
    spotifyLink: 'https://open.spotify.com/album/2eT1XApzS0GmkJLMlCBdVv',
  },
  {
    _type: 'album',
    title: 'Feel Good',
    type: 'Album',
    releaseDate: '2022-09-29',
    tracklist: ['Lagi', 'Huwag Muna Tayong Umuwi', 'I Feel Good', 'No Fear', 'Strings', 'Brighter Tomorrow', 'Say It With Me', 'Kinikilig'],
    spotifyLink: 'https://open.spotify.com/album/7H64wogfyQUcRqFZFbMV9S',
  },
  {
    _type: 'album',
    title: 'Born to Win',
    type: 'Album',
    releaseDate: '2021-10-14',
    tracklist: ['Born to Win', 'Golden Arrow', 'Na Na Na', 'Huwag Muna Tayong Umuwi', '8', 'Yesterday, Today, Tomorrow'],
    spotifyLink: 'https://open.spotify.com/album/28rgW6IXDsrk4YtTcFtGGK',
  },
  {
    _type: 'album',
    title: 'Unang Kilig / Honey Honey',
    type: 'Single',
    releaseDate: '2026-01-30',
    tracklist: ['Unang Kilig', 'Honey Honey'],
    spotifyLink: 'https://open.spotify.com/album/3KDnE33OQ0tkI2qtvoVA0r',
  },
  {
    _type: 'album',
    title: 'BINIverse',
    type: 'Single',
    releaseDate: '2024-07-11',
    tracklist: ['Blink Twice', 'Zero Pressure', 'Secrets', 'Out Of My Head', 'Cherry On Top'],
    spotifyLink: 'https://open.spotify.com/album/0N41GI4E4w6irltx8mJhY5',
  },
];

/* ---------------- TOURS ---------------- */

const tours: Tour[] = [
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - Manila Day 1',
    location: 'SM Mall of Asia Arena, Pasay, Philippines',
    date: '2026-06-20',
    status: 'Sold Out',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - Manila Day 2',
    location: 'SM Mall of Asia Arena, Pasay, Philippines',
    date: '2026-06-21',
    status: 'Upcoming',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - Cebu',
    location: 'SM Seaside Cebu Arena, Cebu, Philippines',
    date: '2026-07-11',
    status: 'Sold Out',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
  {
    _type: 'tour',
    eventName: 'SUMMER SONIC 2026 - Osaka',
    location: "Expo '70 Commemorative Park, Osaka, Japan",
    date: '2026-08-14',
    status: 'Upcoming',
    ticketLink: 'https://www.summersonic.com',
  },
  {
    _type: 'tour',
    eventName: 'SUMMER SONIC 2026 - Tokyo',
    location: 'ZOZO Marine Stadium & Makuhari Messe, Tokyo, Japan',
    date: '2026-08-16',
    status: 'Upcoming',
    ticketLink: 'https://www.summersonic.com',
  },
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - Los Angeles',
    location: 'Peacock Theater, Los Angeles, CA, USA',
    date: '2026-08-05',
    status: 'Upcoming',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - London',
    location: 'OVO Arena Wembley, London, UK',
    date: '2026-09-06',
    status: 'Upcoming',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - Singapore',
    location: 'Arena @ EXPO, Singapore',
    date: '2026-10-25',
    status: 'Upcoming',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
  {
    _type: 'tour',
    eventName: 'BINI SIGNALS WORLD TOUR 2026 - Taipei',
    location: 'New Taipei City Exhibition Hall, Taiwan',
    date: '2026-11-15',
    status: 'Upcoming',
    ticketLink: 'https://www.abs-cbn.com/bini-world-tour-tickets',
  },
];

/* ---------------- UPSERT SEED ---------------- */

const seedData = async () => {
  console.log('STARTING COMPLETE SEED');

  const allData: SeedDoc[] = [...members, ...albums, ...tours];

  try {
    for (const item of allData) {
      let key = '';

      if (item._type === 'member') key = item.stageName;
      if (item._type === 'album') key = item.title;
      if (item._type === 'tour') key = item.eventName;

      const _id = makeId(item._type, key);

      await client.createOrReplace({
        _id,
        ...item,
      } as any);

      console.log(`UPSERTED: ${key}`);
    }

    console.log('SEED COMPLETE');
  } catch (err: any) {
    console.error('SEED ERROR:', err.message);
  }
};

seedData();