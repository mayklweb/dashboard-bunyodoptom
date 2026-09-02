import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserAvatarProps {
  username: string
}

export function UserAvatar({ username }: UserAvatarProps) {
  // Get initials from username
  const initials = username 
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-3">
      <Avatar >
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-medium text-foreground">{username}</p>
      </div>
    </div>
  )
}
