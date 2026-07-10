import type { Rule as SanityRule } from "@sanity/types";

export const signalsTourImageType = {
  name: "signalsTourImage",
  title: "BINI Signals Tour Images",
  type: "document",
  fields: [
    {
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (Rule: SanityRule) => Rule.required().max(120),
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule: SanityRule) => Rule.required(),
    },
  ],
};
