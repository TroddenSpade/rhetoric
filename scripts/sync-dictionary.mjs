// Copies the Hunspell dictionary shipped with `dictionary-en` into src/ so it
// can be imported as raw text by the browser. Run after upgrading the package:
//   npm run sync:dictionary
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'node_modules', 'dictionary-en')
const to = join(root, 'src', 'lib', 'dictionary')

if (!existsSync(join(from, 'index.dic'))) {
  console.error('sync:dictionary — run `npm install` first (dictionary-en is missing).')
  process.exit(1)
}

mkdirSync(to, { recursive: true })
for (const file of ['index.aff', 'index.dic', 'license']) {
  copyFileSync(join(from, file), join(to, file))
  console.log(`sync:dictionary — copied ${file}`)
}
