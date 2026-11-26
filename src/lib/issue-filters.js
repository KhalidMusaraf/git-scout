// Used by the explorer and by its pagination route.
export function readIssueFilters(label, sort) {
  return {
    label: typeof label === "string" ? label : "",
    sort: sort === "updated" ? "updated" : "created",
  };
}
