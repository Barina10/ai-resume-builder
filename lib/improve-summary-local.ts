const PHRASE_SWAPS: Array<[RegExp, string]> = [
  [/\bhelped make\b/gi, "contributed to"],
  [/\bworked on\b/gi, "contributed to"],
  [/\bresponsible for\b/gi, "owned"],
  [/\btried to\b/gi, "focused on"],
  [/\ba lot of\b/gi, "extensive"],
  [/\ba lot\b/gi, "extensively"],
  [/\bhelped\b/gi, "supported"],
  [/\bmade\b/gi, "delivered"],
  [/\bused\b/gi, "applied"],
  [/\bstuff\b/gi, "products"],
  [/\bthings\b/gi, "initiatives"],
  [/\bvery\b/gi, ""],
  [/\breally\b/gi, ""],
];

export function improveSummaryLocal(summary: string, jobTitle?: string) {
  const role = jobTitle?.trim() || "professional";
  let clause = summary.replace(/\s+/g, " ").trim();

  if (!clause) {
    return `Results-driven ${role} with a strong record of delivering high-quality work, collaborating across teams, and turning goals into clear outcomes. Combines practical skills with a commitment to continuous improvement.`;
  }

  clause = clause
    .replace(/^I['’]m\s+/i, "")
    .replace(/^I['’]ve\s+/i, "")
    .replace(/^I\s+/i, "")
    .replace(/\bI['’]m\b/gi, "")
    .replace(/\bI['’]ve\b/gi, "")
    .replace(/\bI\b/g, "")
    .replace(/\bmy\b/gi, "the");

  for (const [pattern, replacement] of PHRASE_SWAPS) {
    clause = clause.replace(pattern, replacement);
  }

  clause = clause.replace(/\s+/g, " ").replace(/\s+([,.])/g, "$1").replace(/[.;]+$/, "").trim();

  if (!clause) {
    return `Results-driven ${role} with a strong record of delivering high-quality work, collaborating across teams, and turning goals into clear outcomes.`;
  }

  clause = clause.charAt(0).toLowerCase() + clause.slice(1);

  return `Accomplished ${role} who ${clause}. Known for collaboration, clear communication, and delivering high-quality work.`;
}
