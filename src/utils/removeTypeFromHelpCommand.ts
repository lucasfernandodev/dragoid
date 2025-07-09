export function removeTypesFromHelpCommand(_: unknown, __: unknown, output: string) {
  if (output) {
    // Remove types (e.g. [string], [boolean]) from the output
    output = output.replace(/\[\w+\]/g, '');

    // Show the modified output
    console.log(output);
  }
}