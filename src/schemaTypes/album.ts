export const albumType = {
  name: 'album',
  title: 'Discography',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['Single', 'EP', 'Album'] }
    },
    { name: 'releaseDate', title: 'Release Date', type: 'date' },
    { name: 'cover', title: 'Cover Art', type: 'image' },
    {
      name: 'tracklist',
      title: 'Tracklist',
      type: 'array',
      of: [{ type: 'string' }]
    },
    { name: 'spotifyLink', title: 'Spotify URL', type: 'url' }
  ]
}