import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    title,
    "logoUrl": logo.asset->url,
    description
  }
`;

export const ALL_MEMBERS_QUERY = groq`
  *[_type == "member"] | order(stageName asc) {
    _id,
    stageName,
    fullName,
    "slug": slug.current,
    "profileImage": profileImage.asset->url,
    "hotspot": profileImage.hotspot,
    "galleryImage": galleryImage.asset->url,
    "galleryHotspot": galleryImage.hotspot,
    birthday,
    zodiac,
    roles,
    signatureColor,
    bio
  }
`;

export const ALL_GALLERY_QUERY = groq`
  *[_type == "gallery"] | order(_createdAt desc) {
    _id,
    title,
    featured,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip
  }
`;

export const NON_FEATURED_GALLERY_QUERY = groq`
  *[_type == "gallery" && featured == false] | order(_createdAt desc) {
    _id,
    title,
    featured,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip
  }
`;

export const HERO_GALLERY_QUERY = groq`
  *[
    _type == "gallery" && 
    (title == "BINI-Hero" || title == "BINI-Hero2" || title == "BINI-Full Hero")
  ] | order(title asc) {
    _id,
    title,
    featured,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip
  }
`;
export const COACHELLA_GALLERY_QUERY = groq`
  *[
    _type == "gallery" &&
    title match "BINICHELLA-*"
  ] | order(title asc) {
    _id,
    title,
    "filename": image.asset->originalFilename,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip
  }
`;

export const ALL_ALBUMS_QUERY = groq`
  *[_type == "album"] | order(releaseDate desc) {
    _id,
    title,
    type,
    releaseDate,
    "coverUrl": cover.asset->url,
    tracklist,
    spotifyLink
  }
`;

export const ALL_TOURS_QUERY = groq`
  *[_type == "tour"] | order(date asc) {
    _id,
    eventName,
    location,
    date,
    status,
    ticketLink
  }
`;

export const MEMBER_BY_SLUG_QUERY = groq`
  *[_type == "member" && slug.current == $slug][0] {
    _id,
    stageName,
    fullName,
    "profileImage": profileImage.asset->url,
    "galleryImage": galleryImage.asset->url,
    birthday,
    zodiac,
    roles,
    signatureColor,
    bio
  }
`;