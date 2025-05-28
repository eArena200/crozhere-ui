export default function UserProfile(
    { params }: { params: { userId: string } }
) {
  return <div>User Profile: {params.userId}</div>;
}