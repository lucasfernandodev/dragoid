import fs from 'node:fs/promises';

/**
 * Script created to fix an issue where @fastify/vite fails to detect the project path 
 * when the CLI is run from other directories.
 */
export async function executePostBuild() {
  let source = await fs.readFile("./bin/dragoid", "utf8");

  source = source.replaceAll(
    "isAbsolute6(p2) ? p2 : resolve12(root4, p2);",
    "isAbsolute6(p2) ? p2 : resolve12(root4 ?? resolve12(__dirname4, '..'), p2);"
  );

  await fs.writeFile("./bin/dragoid", source, "utf8");
}

executePostBuild().catch(err => {
  console.error("Erro no post-build:", err);
  process.exit(1);
});