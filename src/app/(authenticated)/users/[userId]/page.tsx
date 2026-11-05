import { UserDetailView } from "@/components/users/user-detail-view";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params;
  return <UserDetailView userId={userId} />;
}
