import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'availability',
      title: 'Availability label',
      type: 'string',
      description: 'Shown in the header pill, e.g. "Available 2025".',
    }),
    defineField({name: 'contactEmail', title: 'Contact email', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({
      name: 'aboutPhoto',
      title: 'About portrait',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aboutLede',
      title: 'About — lead line',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'aboutBody',
      title: 'About — body paragraphs',
      type: 'array',
      of: [{type: 'text'}],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 2},
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        },
      ],
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {
              name: 'logo',
              title: 'Logo (optional)',
              type: 'image',
              description: 'Official logo if available; otherwise the typographic wordmark is used.',
            },
          ],
          preview: {select: {title: 'name', media: 'logo'}},
        },
      ],
    }),
    defineField({
      name: 'heroProjects',
      title: 'Hero deck projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description: 'Which projects cycle in the hero image deck.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
