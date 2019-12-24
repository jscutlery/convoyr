/* @todo parse from human format */
export function parseMaxSize(maxSizeHumanFormat?: string): number | null {
  return maxSizeHumanFormat != null ? parseInt(maxSizeHumanFormat, 10) : null;
}
