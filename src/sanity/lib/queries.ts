import { groq } from "next-sanity";

// Query for Global Site Settings (Logo, Title, etc.)
export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  title,
  "logoUrl": logo.asset->url,
  description
}`;

// Query for all BINI Members
export const ALL_MEMBERS_QUERY = groq`*[_type == "member"] | order(stageName asc) {
  _id,
  stageName,
  fullName,
  "slug": slug.current,
  "profileImage": profileImage.asset->url,
  "hotspot": profileImage.hotspot,
  birthday,
  zodiac,
  roles,
  signatureColor,
  bio
}`;

// Query for ALL Gallery items
export const ALL_GALLERY_QUERY = groq`*[_type == "gallery"] | order(_createdAt desc) {
  _id,
  title,
  "imageUrl": image.asset->url,
  featured,
  category
}`;

// Query for ONLY Featured Gallery items (for Hero)
export const FEATURED_GALLERY_QUERY = groq`*[_type == "gallery" && featured == true] | order(_updatedAt desc) {
  _id,
  title,
  "imageUrl": image.asset->url,
  featured
}`;

// Query for Discography
export const ALL_ALBUMS_QUERY = groq`*[_type == "album"] | order(releaseDate desc) {
  _id,
  title,
  type,
  releaseDate,
  "coverUrl": cover.asset->url,
  tracklist,
  spotifyLink
}`;

// Query for Tours
export const ALL_TOURS_QUERY = groq`*[_type == "tour"] | order(date asc) {
  _id,
  eventName,
  location,
  date,
  status,
  ticketLink
}`;

// Single Member Query for Dynamic Pages
export const MEMBER_BY_SLUG_QUERY = groq`*[_type == "member" && slug.current == $slug][0] {
  _id,
  stageName,
  fullName,
  "profileImage": profileImage.asset->url,
  birthday,
  zodiac,
  roles,
  signatureColor,
  bio
}`;