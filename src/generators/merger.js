const START_MARKER = '## AI GENERATED CONTEXT';
const END_MARKER = '## END AI GENERATED CONTEXT';

function extractManagedBlock(content) {
  const regex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`, 'm');
  const match = content.match(regex);
  return match ? match[0] : '';
}

export function mergeConfigs(existing, generated) {
  const managedBlock = extractManagedBlock(generated);

  if (!managedBlock) {
    return generated;
  }

  const existingRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`, 'm');
  if (existingRegex.test(existing)) {
    return existing.replace(existingRegex, managedBlock);
  }

  const trimmed = existing.trimEnd();
  if (!trimmed) {
    return generated;
  }

  return `${trimmed}\n\n${managedBlock}\n`;
}
