export function truncateText(text: string, length = 8, textLength = 2) {
  // If text is less than or equal to length, return text
  if (!text) {
    return "";
  }

  if (text?.length <= length) {
    return text;
  }
  // Otherwise, return text truncated to length with "..." appended. Example: truncateText("Helloworld", 5) => "He..ld"
  return text.slice(0, textLength) + ".." + text.slice(-textLength);
}
