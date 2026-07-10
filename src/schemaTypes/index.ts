import { type SchemaTypeDefinition } from 'sanity'
import { memberType } from './member'
import { albumType } from './album'
import { tourType } from './tour'
import { siteSettingsType } from './siteSettings'
import galleryType from './gallery'
import teaserType from './teaser'
import { signalsTourImageType } from './signalsTourImage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettingsType, 
    memberType, 
    albumType, 
    tourType,
    galleryType,
    teaserType,
    signalsTourImageType
  ],
}
