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

const seedData = async () => {
  console.log('STARTING COMPLETE DATA SEEDING');

  const members = [
    { _type: 'member', stageName: 'Aiah', fullName: 'Maraiah Queen Arceta', birthday: '2001-01-27', zodiac: 'Aquarius' },
    { _type: 'member', stageName: 'Colet', fullName: 'Ma. Nicolette Vergara', birthday: '2001-09-14', zodiac: 'Virgo' },
    { _type: 'member', stageName: 'Maloi', fullName: 'Mary Loi Yves Ricalde', birthday: '2002-05-27', zodiac: 'Gemini' },
    { _type: 'member', stageName: 'Gwen', fullName: 'Gweneth L. Apuli', birthday: '2003-06-19', zodiac: 'Gemini' },
    { _type: 'member', stageName: 'Stacey', fullName: 'Stacey Aubrey Sevilleja', birthday: '2003-07-13', zodiac: 'Cancer' },
    { _type: 'member', stageName: 'Mikha', fullName: 'Mikhaela Janna Lim', birthday: '2003-11-08', zodiac: 'Scorpio' },
    { _type: 'member', stageName: 'Jhoanna', fullName: 'Jhoanna Robles', birthday: '2004-12-15', zodiac: 'Sagittarius' },
    { _type: 'member', stageName: 'Sheena', fullName: 'Sheena Mae Catacutan', birthday: '2004-05-09', zodiac: 'Taurus' },
  ];

  const albums = [
    {
      _type: 'album',
      title: 'Signals',
      type: 'EP',
      releaseDate: '2026-03-14',
      tracklist: ['Blush', 'Keep It Real', 'Signals', 'Honey Honey', 'Unang Kilig', 'Echo'],
      spotifyLink: 'https://open.spotify.com/album/4'
    },
    {
      _type: 'album',
      title: 'FLAMES',
      type: 'Album',
      releaseDate: '2025-11-20',
      tracklist: ['Bikini', 'Slow Burn', 'Reign', 'Skyline', 'Focus', 'Afterglow', 'Wildfire', 'Golden'],
      spotifyLink: 'https://open.spotify.com/album/5'
    },
    {
      _type: 'album',
      title: 'Talaarawan',
      type: 'EP',
      releaseDate: '2024-03-08',
      tracklist: ['Karera', 'Pantayo', 'Salamin, Salamin', 'Ang Huling Cha Cha', 'Na Na Nandito Lang', 'Diyan Ka Lang'],
      spotifyLink: 'https://open.spotify.com/album/6'
    },
    {
      _type: 'album',
      title: 'Feel Good',
      type: 'Album',
      releaseDate: '2022-09-29',
      tracklist: ['Lagi', 'Huwag Muna Tayong Umuwi', 'I Feel Good', 'No Fear', 'Strings', 'Brighter Tomorrow', 'Say It With Me', 'Kinikilig'],
      spotifyLink: 'https://open.spotify.com/album/7'
    },
    {
      _type: 'album',
      title: 'Born to Win',
      type: 'Album',
      releaseDate: '2021-10-14',
      tracklist: ['Born to Win', 'Golden Arrow', 'Na Na Na', 'Huwat Muna Tayong Umuwi', '8', 'Yesterday, Today, Tomorrow'],
      spotifyLink: 'https://open.spotify.com/album/9'
    },
    {
      _type: 'album',
      title: 'Unang Kilig / Honey Honey',
      type: 'Single',
      releaseDate: '2026-01-30',
      tracklist: ['Unang Kilig', 'Honey Honey'],
      spotifyLink: 'https://open.spotify.com/album/8'
    },
    {
      _type: 'album',
      title: 'Cherry On Top',
      type: 'Single',
      releaseDate: '2024-07-11',
      tracklist: ['Cherry On Top'],
      spotifyLink: 'https://open.spotify.com/track/10'
    }
  ];

  const tours = [
    {
      _type: 'tour',
      eventName: 'Summer Sonic 2026',
      location: 'ZOZO Marine Stadium, Tokyo',
      date: '2026-08-22T14:00:00Z',
      status: 'Upcoming',
      ticketLink: 'https://www.summersonic.com'
    },
    {
      _type: 'tour',
      eventName: 'Signals World Tour: Manila',
      location: 'Philippine Arena, Bulacan',
      date: '2026-06-20T19:00:00Z',
      status: 'Upcoming',
      ticketLink: 'https://smtickets.com'
    },
    {
      _type: 'tour',
      eventName: 'Coachella 2026',
      location: 'Indio, California',
      date: '2026-04-12T18:00:00Z',
      status: 'Past',
      ticketLink: 'https://coachella.com'
    },
    {
      _type: 'tour',
      eventName: 'Grand BINIverse World Tour',
      location: 'Philippine Arena, Bulacan',
      date: '2025-11-15T19:00:00Z',
      status: 'Past',
      ticketLink: 'https://smtickets.com'
    },
    {
      _type: 'tour',
      eventName: 'Signals World Tour: Singapore',
      location: 'The Star Theatre',
      date: '2026-07-05T20:00:00Z',
      status: 'Upcoming',
      ticketLink: 'https://ticketmaster.sg'
    },
    {
      _type: 'tour',
      eventName: 'BINIverse: The First Solo Tour',
      location: 'New Frontier Theater',
      date: '2024-06-28T19:00:00Z',
      status: 'Past',
      ticketLink: 'https://ticketnet.com.ph'
    }
  ];

  try {
    const allData = [...members, ...albums, ...tours];
    console.log(`ATTEMPTING TO UPLOAD ${allData.length} DOCUMENTS`);

    for (const item of allData) {
      await client.create(item as any);
      const identifier = (item as any).stageName || (item as any).title || (item as any).eventName;
      console.log(`SUCCESS: ${identifier}`);
    }

    console.log('SEEDING COMPLETED');
  } catch (err: any) {
    console.error('ERROR DURING SEEDING:', err.message);
  }
};

seedData();