import moment from "moment";
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp, 10));
  return date.toLocaleString();
};

export function extractYear(dateString: string): number | null {
  const yearRegex = /\b(19|20)\d{2}\b/;

  const yearMatch = dateString.match(yearRegex);
  if (yearMatch) {
    return calculateAge(parseInt(yearMatch[0], 10));
  }

  const dateFormats = [
    "MMM D, YYYY", // Aug 9, 2024
    "D MMM, YYYY", // 9 Aug, 2024
    "MM/DD/YYYY", // 08/09/2024
    "DD/MM/YYYY", // 09/08/2024
    "YYYY/MM/DD", // 2024/08/09
    "YYYY-MM-DD", // 2024-08-09
    "D/M/YYYY", // 8/9/2024
    "YYYY", // 2024
  ];

  // Try to parse the date using each format
  for (const format of dateFormats) {
    const date = moment(dateString, format, true);
    if (date.isValid()) {
      return calculateAge(date.year());
    }
  }

  return null;
}

function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

