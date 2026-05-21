const fs = require("fs");
const path = require("path");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const BINI_ARTIST_ID =
  process.env.SPOTIFY_ARTIST_ID || "7tNO3vJC9zlHy2IJOx34ga";

async function getAccessToken() {
  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Auth failed:\n${await response.text()}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

async function getAllReleases(token) {
  let releases = [];

  let url =
    `https://api.spotify.com/v1/artists/${BINI_ARTIST_ID}/albums` +
    `?include_groups=album,single` +
    `&market=PH`;

  while (url) {
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Fetch failed (${response.status})\n${await response.text()}`
      );
    }

    const data = await response.json();

    releases.push(...data.items);

    // Spotify returns fully formed next URLs
    url = data.next;
  }

  return releases;
}

async function getTracks(albumId, token) {
  let tracks = [];
  let url =
    `https://api.spotify.com/v1/albums/${albumId}/tracks`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    tracks.push(...data.items);

    url = data.next;
  }

  return tracks;
}

async function fetchDiscography() {
  try {
    if (
      !CLIENT_ID ||
      !CLIENT_SECRET
    ) {
      throw new Error(
        "Missing Spotify credentials"
      );
    }

    console.log("Authenticating...");

    const token =
      await getAccessToken();

    console.log(
      "Fetching all releases..."
    );

    const releases =
      await getAllReleases(token);

    console.log(
      `Raw releases: ${releases.length}`
    );

    // remove duplicates
    const unique =
      Array.from(
        new Map(
          releases.map((x) => [
            x.name
              .toLowerCase()
              .trim(),
            x,
          ])
        ).values()
      );

    console.log(
      `Unique releases: ${unique.length}`
    );

    const items =
      await Promise.all(
        unique.map(
          async (album, i) => {
            console.log(
              `[${i + 1}/${unique.length}] ${album.name}`
            );

            const tracks =
              await getTracks(
                album.id,
                token
              );

            return {
              id: album.id,
              name: album.name,
              type:
                album.album_type,
              release_date:
                album.release_date,
              year:
                album.release_date?.slice(
                  0,
                  4
                ),
              total_tracks:
                album.total_tracks,
              art:
                album.images?.[0]
                  ?.url || null,
              spotify_url:
                album
                  .external_urls
                  ?.spotify,

              tracks:
                tracks.map(
                  (t) => ({
                    id: t.id,
                    name: t.name,
                    preview_url:
                      t.preview_url,
                    uri: t.uri,
                    duration: `${Math.floor(
                      t.duration_ms /
                        60000
                    )}:${String(
                      Math.floor(
                        (t.duration_ms %
                          60000) /
                          1000
                      )
                    ).padStart(
                      2,
                      "0"
                    )}`,
                  })
                ),
            };
          }
        )
      );

    items.sort(
      (a, b) =>
        new Date(
          b.release_date
        ) -
        new Date(
          a.release_date
        )
    );

    const outputPath =
      path.join(
        __dirname,
        "bini_discography.json"
      );

    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          total:
            items.length,
          items,
        },
        null,
        2
      )
    );

    console.log(
      `Saved → ${outputPath}`
    );
  } catch (err) {
    console.error(
      "\nFAILED:"
    );

    console.error(
      err.message
    );
  }
}

fetchDiscography();