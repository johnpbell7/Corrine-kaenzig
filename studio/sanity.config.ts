import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'mmpvq40b'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'corrine-kaenzig',
  title: 'Corrine Kaenzig — Portfolio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // Single editable settings document
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            // Drag-to-reorder list of projects
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects',
              S,
              context,
            }),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
