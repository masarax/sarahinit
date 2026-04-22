const PATH_TRAVERSAL_PATTERN = /\.\.[\\/]/;
const SECRET_PATTERN = /(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

export function securityCheck(context) {
  const serialized = JSON.stringify(context);

  if (PATH_TRAVERSAL_PATTERN.test(serialized)) {
    throw new Error('Security check failed: path traversal pattern detected in input.');
  }

  if (SECRET_PATTERN.test(serialized)) {
    throw new Error('Security check failed: potential secret detected in input.');
  }
}
