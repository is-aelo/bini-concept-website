const galleryType = {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Gallery Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'featured',
      title: 'Featured (Show on Hero)',
      type: 'boolean',
      initialValue: false,
    },
  ],
}

export default galleryType;