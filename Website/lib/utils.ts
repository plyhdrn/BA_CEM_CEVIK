import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const downloadFile = ({ data, fileName, fileType }) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType });
  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

export function convertTime(seconds: number) {
  var seconds = parseInt(seconds, 10);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - hours * 3600) / 60);
  var seconds = seconds - hours * 3600 - minutes * 60;
  if (!!hours) {
    if (!!minutes) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${seconds}s`;
    }
  }
  if (!!minutes) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
