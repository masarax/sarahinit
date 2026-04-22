const SUPPORTED_AGENTS = new Set([
  'claude',
  'cursor',
  'copilot',
  'windsurf',
  'cline',
  'codex',
  'gemini',
  'continue',
  'zed'
]);

export function validateContext(context) {
  if (!context || typeof context !== 'object') {
    throw new Error('Invalid context: expected an object.');
  }

  if (!Array.isArray(context.agents) || context.agents.length === 0) {
    throw new Error('At least one agent must be selected.');
  }

  for (const agent of context.agents) {
    if (!SUPPORTED_AGENTS.has(agent)) {
      throw new Error(`Unsupported agent selected: ${agent}`);
    }
  }

  if (!context.multiFile || typeof context.multiFile !== 'object') {
    context.multiFile = { enableMultiFile: false, linkedFiles: [] };
  }

  if (!Array.isArray(context.multiFile.linkedFiles)) {
    context.multiFile.linkedFiles = [];
  }
}
