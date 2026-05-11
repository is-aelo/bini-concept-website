export const siteSettingsType = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'title', title: 'Site Title', type: 'string' },
    { name: 'logo', title: 'Site Logo', type: 'image', options: { hotspot: true } },
    { name: 'description', title: 'Site Description', type: 'text' },
  ]
}