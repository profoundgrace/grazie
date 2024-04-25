export function validateSchema(schema, values, options = {}) {
  const parsed = schema.validate(values, { abortEarly: false, ...options });
  const results = {};
  if (!parsed?.error) {
    return false;
  }
  parsed.error.details.forEach((error) => {
    results[error.path.join('.')] = error.message;
  });
  return results;
}
