export function removeTypesFromHelpCommand(err, args, output) {
  if (output) {
    // Remove types (e.g. [string], [boolean]) from the output
    output = output.replace(/\[\w+\]/g, '');

    // Show the modified output
    console.log(output);
  }
}