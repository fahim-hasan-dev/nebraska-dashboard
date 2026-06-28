"use server";

export async function fetchImageAsBase64(url: string): Promise<{ base64: string; contentType: string } | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image from URL: ${url}, status: ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/jpeg";
    return { base64, contentType };
  } catch (error) {
    console.error("Error fetching image on server:", error);
    return null;
  }
}
