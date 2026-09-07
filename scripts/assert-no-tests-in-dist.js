import {readdirSync} from "node:fs"
import {join, relative} from "node:path"

const distDir = "dist"

const isTestArtefact = (name) =>
  /\.(test|spec)\./.test(name) || name === "__tests__" || name === "tests"

const findTestArtefacts = (dir) =>
  readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (isTestArtefact(entry.name)) return [relative(distDir, path)]
    return entry.isDirectory() ? findTestArtefacts(path) : []
  })

const found = findTestArtefacts(distDir)

if (found.length > 0) {
  console.error(
    `Test files must not be packaged, but ${found.length} reached ${distDir}/:\n` +
      found.map((path) => `  ${path}`).join("\n") +
      "\nMove them out of src/lib and into the top-level tests/ directory.",
  )
  process.exit(1)
}
