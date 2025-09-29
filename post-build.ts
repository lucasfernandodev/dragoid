import fs from 'node:fs/promises';

/**
 * Script created to fix an issue where @fastify/vite fails to detect the project path 
 * when the CLI is run from other directories.
 */
export async function executePostBuild() {
  let source = await fs.readFile("./bin/dragoid", "utf8");

  const regex = /isAbsolute(\d+)\(p(\d+)\)\s*\?\s*p\2\s*:\s*resolve(\d+)\(root(\d+),\s*p\2\)/;

  const match = source.match(regex);
  if (match) {
    const IS_ABSOLUTE_NUM = match[1];
    const PARAM = match[2];
    const RESOLVE_NUM = match[3];
    const ROOT_NUM = match[4];

    const newResolvPath = `resolve${RESOLVE_NUM}(__dirname4, '..', p${PARAM})`

    source = source.replaceAll(
      `isAbsolute${IS_ABSOLUTE_NUM}(p${PARAM}) ? p${PARAM} : resolve${RESOLVE_NUM}(root${ROOT_NUM}, p${PARAM});`,
      `isAbsolute${IS_ABSOLUTE_NUM}(p${PARAM}) ? p${PARAM} : typeof root${ROOT_NUM} === 'undefined' ? ${newResolvPath} : resolve${RESOLVE_NUM}(root${ROOT_NUM}, p${PARAM})`
    );

    console.log("PostBuild fixing server paths width success!")
  }

  await fs.writeFile("./bin/dragoid", source, "utf8");
}

executePostBuild().catch(err => {
  console.error("Erro no post-build:", err);
  process.exit(1);
});