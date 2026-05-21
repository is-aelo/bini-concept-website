const CLIENT_ID = '80b4b2ebbe0b46188e95619c8069698e';
const CLIENT_SECRET = '49464fbdcd57444f8c6002be19f898b9';

async function checkSpotifyLink() {
    console.log('--- Alternative Body-Auth Diagnostics ---');
    
    // We send credentials inside the body payload form parameters instead of the header
    const bodyParams = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID.trim(),
        client_secret: CLIENT_SECRET.trim()
    });

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyParams.toString()
        });

        const data = await response.json();

        if (response.ok) {
            console.log('\n✅ CONNECTION SUCCESSFUL WITH BODY PAYLOAD!');
            console.log(`Access Token Received: ${data.access_token.substring(0, 15)}...`);
        } else {
            console.log('\n❌ SPOTIFY STILL REJECTED THE REQUEST:');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.log('\n💥 NETWORK ERROR:', err.message);
    }
}

checkSpotifyLink();