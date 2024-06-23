import React from "react";
import BackupsCard from "../components/BackupsCard";

const ProfilePage = async ({
  params,
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
  params: { id: string };
}) => {
  if (!params.id) return null;
  return <BackupsCard id={params.id} searchParams={searchParams} />;
};

export default ProfilePage;
