import { User } from "@phosphor-icons/react/dist/ssr";

export const memberType = {
  name: 'member',
  title: 'BINI Member',
  type: 'document',
  icon: User,
  fields: [
    {
      name: 'stageName',
      title: 'Stage Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'stageName', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'profileImage',
      title: 'Profile Image (Primary Portrait)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'galleryImage',
      title: 'Gallery Image (Secondary/Action Shot)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'birthday',
      title: 'Birthday',
      type: 'date',
    },
    {
      name: 'zodiac',
      title: 'Zodiac Sign',
      type: 'string',
      options: {
        list: [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ]
      }
    },
    {
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'signatureColor',
      title: 'Signature Color (Hex)',
      type: 'string',
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
    },
  ],
}