export const handleGender = (value: string) => {
  if (value === "M") {
    return "Male";
  }
  return "Female";
};

export const handleLevel = (value: number) => {
  switch (value) {
    case 0:
      return "Voter";
    case 1:
      return "Team Leader";
    case 2:
      return "Purok Coor.";
    case 3:
      return "Barangay Coor.";
    default:
      return "Voter";
  }
};

export const handleStatus = (value: number) => {
  switch (value) {
    case 0:
      return "Dead";
    case 1:
      return "Active";
    case 2:
      return "Un-Active";
    default:
      return "Dead";
  }
};

export const handleSetTitle = (value: number) => {
  switch (value) {
    case 0:
      return "Voter";
    case 2:
      return "Purok Coor.";
    case 3:
      return "Un-Active";
    default:
      return "Dead";
  }
};

export const handleSanitizeChar = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export const handleReverseSanitizeChar = (str: string) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const handleVoterColor = (value: number) => {
  if (value >= 1 && value < 5) {
    return "#f70707";
  }
  if (value > 5 && value < 10) {
    return "#f76f07";
  }
  return "#04de0f";
};

export const handleAltText = (
  value: string | undefined | null,
  alt: string
) => {
  if (value) return value;
  return alt;
};

export const handleGetPurposeList = (value: number): string => {
  const purposeList = [
    { name: "Scanner", key: 1 },
    { name: "Team", key: 2 },
    { name: "Verification", key: 3 },
    { name: "Survey", key: 4 },
  ];

  const keys = new Set(value.toString().split("").map(Number));

  const purposes = purposeList
    .filter((item) => keys.has(item.key))
    .map((item) => item.name);

  return purposes.join(", ");
};

export const handleGetRole = (index: number) => {
  const roles = [
    "Portal Admin",
    "One-App Admin",
    "One-App User",
    "Super Account",
  ];
  return roles[index] || "Unknown";
};

export const responseError = [
  "Bad Request",
  "User not found",
  "Unauthorized Account",
  "Account Suspended",
  "Incorrect password",
];

export const removeAllSpaces = (str: string) => str.replace(/\s+/g, "");

export const commentsTagShow = (tag: number) => {
  const data = ["", "UD", "ND", "OP"];
  return data[tag];
};

export const MembersCapacities = [
  "All",
  "0 Members",
  "3 and below",
  "4 only",
  "5 (Min. standard)",
  "6 to 9",
  "10 (Max. standard)",
  "10 and above",
];

export const calculatePercentage = (part: number, whole: number): number => {
  if (whole === 0) {
    return 0; // Avoid division by zero
  }

  // Round to 2 decimal places for cleaner output
  return parseFloat(((part / whole) * 100).toFixed(2));
};
