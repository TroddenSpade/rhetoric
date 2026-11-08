// Post-build step for GitHub Pages:
//  - copies index.html to 404.html so deep links boot the SPA (Pages has no rewrites)
//  - writes .nojekyll so files starting with "_" are served
import { copyFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const index = join(dist, 'index.html')

if (!existsSync(index)) {
  console.error('postbuild: dist/index.html not found — run the Vite build first.')
  process.exit(1)
}

copyFileSync(index, join(dist, '404.html'))
writeFileSync(join(dist, '.nojekyll'), '')

console.log('postbuild: wrote dist/404.html and dist/.nojekyll')
