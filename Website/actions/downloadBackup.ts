"use server";
export const downloadBackup = async (id: string) => {
  const res = await fetch(
    `${process.env.BACKEND_URL}/matching/download?id=${id}`,
    {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    }
  );
  const blob = await res.arrayBuffer();
  return Buffer.from(blob).toString("base64");
};
