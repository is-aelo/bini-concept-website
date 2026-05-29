const teaserType = {
  name: 'teaser',
  title: 'Teaser',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'video',
      title: 'Video Teaser',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'main',
      title: 'Main',
      type: 'text',
      rows: 4,
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 4,
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
  ],
}

export default teaserType;
