import { useSuggestions } from "@/hooks/suggestions/use-suggestions";
import { useQueryClient } from "@tanstack/react-query";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SuggestionsSidebar() {
  const [followedUserId, setFollowedUserId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useSuggestions();

  const users = data?.data.suggestions ?? [];

  async function handleFollowSuccess(userId: string) {
    setFollowedUserId(userId);

    await new Promise((resolve) => setTimeout(resolve, 500));

    await queryClient.invalidateQueries({
      queryKey: ["suggestions"],
    });

    setFollowedUserId(null);
  }

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-70 border-r bg-white p-4 md:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">People you may know</h2>
      </div>
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="size-11 shrink-0 animate-pulse rounded-full bg-gray-200" />

                  <div className="min-w-0 space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>

                <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200" />
              </div>
            ))
          : users.map((user) => (
              <div
                key={user._id}
                className={`flex items-center justify-between gap-3 transition-all duration-500 ${
                  followedUserId === user._id
                    ? "translate-x-4 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <Link
                      to={`/users/${user._id}`}
                      className="block truncate text-sm font-semibold hover:underline"
                    >
                      {user.name}
                    </Link>

                    <p className="truncate text-xs text-gray-500">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <FollowButton
                  userId={user._id}
                  onFollowSuccess={() => handleFollowSuccess(user._id)}
                />
              </div>
            ))}
      </div>
    </aside>
  );
}
