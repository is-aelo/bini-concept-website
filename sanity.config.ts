import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
// import { visionTool } from '@sanity/vision'
import { schema } from './src/schemaTypes'
import { projectId, dataset } from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'BINI Concept Studio',
  basePath: '/studio', 
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    // visionTool()
  ],
})