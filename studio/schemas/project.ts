import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Shown on the card, e.g. "Art Director", "Costume Designer".',
    }),
    defineField({
      name: 'discipline',
      title: 'Discipline',
      type: 'string',
      description: 'Drives the All / Art Director / Stylist filter. Costume jobs sit under Stylist.',
      options: {list: ['Art Director', 'Stylist'], layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'year', title: 'Year', type: 'string'}),
    defineField({
      name: 'summary',
      title: 'What was done',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bullets',
      title: 'Responsibilities',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'The first image is used as the card and the overlay hero. The rest form the gallery.',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'videos',
      title: 'Video links',
      type: 'array',
      of: [{type: 'url'}],
      description:
        'YouTube, Vimeo (incl. private link), Google Drive, Instagram or Facebook. The first plays at the top of the overlay; the rest appear above the gallery.',
    }),
    defineField({
      name: 'logo',
      title: 'Official brand logo (optional)',
      type: 'image',
      description: 'Upload the brand’s official logo (SVG preferred). Leave empty to use the typographic wordmark fallback.',
    }),
    defineField({
      name: 'featuredInHero',
      title: 'Feature in hero deck',
      type: 'boolean',
      description: 'Include this project in the cycling deck of images in the hero.',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {title: 'title', brand: 'brand', media: 'images.0'},
    prepare: ({title, brand, media}) => ({title: brand, subtitle: title, media}),
  },
})
