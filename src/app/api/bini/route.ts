import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const artistId = '7tNO3vJC9zlHy2IJOx34ga';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const authData = await authResponse.json();
  const accessToken = authData.access_token;

  const albumsResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=8`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const albumsData = await albumsResponse.json();

  const albumsWithTracks = await Promise.all(
    albumsData.items.map(async (album: any) => {
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=5`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const tracksData = await tracksResponse.json();
      return {
        id: album.id,
        name: album.name,
        year: album.release_date?.substring(0, 4) || "N/A",
        art: album.images[0]?.url,
        tracks: tracksData.items.map((t: any) => ({
          id: t.id,
          name: t.name,
          duration: `${Math.floor(t.duration_ms / 60000)}:${Math.floor((t.duration_ms % 60000) / 1000).toString().padStart(2, '0')}`,
          preview_url: t.preview_url || null,
          spotify_url: t.external_urls?.spotify || '',
          uri: t.uri
        })),
      };
    })
  );

  return NextResponse.json({ items: albumsWithTracks });
}