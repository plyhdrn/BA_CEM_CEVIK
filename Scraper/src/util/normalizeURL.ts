export const normalizeURL = (inputURL: string): string => {
  // Add 'https://' if the URL doesn't start with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(inputURL)) {
    inputURL = "https://" + inputURL;
  }

  const parsedURL = new URL(inputURL);

  // Remove 'www.' if it exists
  const hostname = parsedURL.hostname.replace(/^www\./, "");

  // Reconstruct the URL
  return parsedURL.protocol + "//" + hostname;
};
