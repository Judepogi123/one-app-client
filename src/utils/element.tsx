export const handleElements = (query: string, value: string | undefined | null) => {
  if (!value) return null; // Handle undefined/null value
  if (!query) return value; // Return original value if query is empty

  const parts = value.trim().split(new RegExp(`(${query})`, 'gi'));

  const element = parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <span key={index} className="font-bold text-orange-600">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });

  return element;
};
