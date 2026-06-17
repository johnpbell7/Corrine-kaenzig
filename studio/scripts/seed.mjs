// One-time migration: pushes the prototype's 18 projects + site settings into Sanity,
// uploading every inlined image and brand wordmark as a Sanity asset.
//
// Usage:
//   SANITY_STUDIO_PROJECT_ID=xxx SANITY_STUDIO_DATASET=production \
//   SANITY_API_TOKEN=<editor-token> node scripts/seed.mjs
//
// Safe to re-run: documents use deterministic ids and createOrReplace.

import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Set SANITY_STUDIO_PROJECT_ID and SANITY_API_TOKEN (an editor/deploy token).')
  process.exit(1)
}

const client = createClient({projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false})

// ---- pull the inlined IMG + LOGOS maps straight from the prototype ----
const html = readFileSync(join(__dirname, '..', '..', 'index.html'), 'utf8')
const IMG = JSON.parse(html.match(/window\.IMG\s*=\s*(\{.*?\});/s)[1])
const LOGOS = JSON.parse(html.match(/window\.LOGOS\s*=\s*(\{.*?\});/s)[1])
const {projects, settings} = JSON.parse(
  readFileSync(join(__dirname, 'seed-data.json'), 'utf8'),
)

function dataUriToBuffer(uri) {
  const comma = uri.indexOf(',')
  const meta = uri.slice(5, comma) // e.g. image/jpeg;base64  or  image/svg+xml
  const body = uri.slice(comma + 1)
  if (meta.includes('base64')) {
    return {buffer: Buffer.from(body, 'base64'), ext: meta.split('/')[1].split(';')[0]}
  }
  // url-encoded (svg)
  return {buffer: Buffer.from(decodeURIComponent(body), 'utf8'), ext: 'svg'}
}

const assetCache = new Map()
// ns ("img" / "logo") namespaces the cache so a client-logo key and a project-image
// key with the same name (e.g. "samsung") don't collide onto the same asset.
async function uploadFromMap(map, key, ns) {
  if (!key || !map[key]) return null
  const ck = ns + ':' + key
  if (assetCache.has(ck)) return assetCache.get(ck)
  const {buffer, ext} = dataUriToBuffer(map[key])
  const asset = await client.assets.upload('image', buffer, {filename: `${ns}-${key}.${ext}`})
  assetCache.set(ck, asset._id)
  console.log(`  uploaded ${ns}:${key} -> ${asset._id}`)
  return asset._id
}

const imageRef = (assetId, key) =>
  assetId ? {_type: 'image', _key: key, asset: {_type: 'reference', _ref: assetId}} : null

async function run() {
  console.log('Uploading project images...')
  for (const p of projects) {
    const refs = []
    for (let i = 0; i < (p.images || []).length; i++) {
      const id = await uploadFromMap(IMG, p.images[i], 'img')
      const ref = imageRef(id, `${p.id}-img-${i}`)
      if (ref) refs.push(ref)
    }
    p._imageRefs = refs
    p._logoRef = p.logo ? imageRef(await uploadFromMap(LOGOS, p.logo, 'logo'), `${p.id}-logo`) : null
  }

  console.log('Uploading client logos...')
  for (const c of settings.clients) {
    c._logoRef = imageRef(await uploadFromMap(LOGOS, c.key, 'logo'), `cli-${c.key}`)
  }
  const aboutPhotoId = await uploadFromMap(IMG, settings.aboutPhotoKey, 'img')

  console.log('Writing project documents...')
  const tx = client.transaction()
  projects.forEach((p, idx) => {
    tx.createOrReplace({
      _id: `project-${p.id}`,
      _type: 'project',
      brand: p.brand,
      title: p.title,
      slug: {_type: 'slug', current: p.id},
      role: p.role || '',
      discipline: p.discipline,
      year: p.year || '',
      summary: p.summary || '',
      bullets: p.bullets || [],
      images: p._imageRefs,
      videos: p.videos || [],
      ...(p._logoRef ? {logo: {_type: 'image', asset: p._logoRef.asset}} : {}),
      featuredInHero: !!p.featuredInHero,
      orderRank: String(idx).padStart(6, '0'),
    })
  })

  console.log('Writing site settings...')
  tx.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    availability: settings.availability,
    contactEmail: settings.contactEmail,
    phone: settings.phone,
    location: settings.location,
    ...(aboutPhotoId
      ? {aboutPhoto: {_type: 'image', asset: {_type: 'reference', _ref: aboutPhotoId}}}
      : {}),
    aboutLede: settings.aboutLede,
    aboutBody: settings.aboutBody,
    services: settings.services.map((s, i) => ({_key: `svc-${i}`, ...s})),
    clients: settings.clients.map((c) => ({
      _key: `cli-${c.key}`,
      name: c.name,
      ...(c._logoRef ? {logo: {_type: 'image', asset: c._logoRef.asset}} : {}),
    })),
    heroProjects: settings.heroProjectIds.map((id) => ({
      _type: 'reference',
      _key: `hero-${id}`,
      _ref: `project-${id}`,
    })),
  })

  await tx.commit()
  console.log(`\nDone. Seeded ${projects.length} projects + site settings into "${dataset}".`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
