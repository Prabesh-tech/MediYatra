export type FormFieldErrors = Record<string, string>;

export function getFieldErrors(
  issues: readonly { path: readonly (string | number)[]; message: string }[],
): FormFieldErrors {
  const errors: FormFieldErrors = {};
  for (const issue of issues) {
    const field = issue.path.map(String).join(".") || "_form";
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
