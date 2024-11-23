 
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
