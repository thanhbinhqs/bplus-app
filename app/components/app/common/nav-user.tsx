/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Link, useMatches, useRouteLoaderData } from "@remix-run/react";
import { User } from "~/lib/interfaces/user";
import { MenuItem } from "~/lib/interfaces/menu-item";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";

export default function NavUser() {
  // const data = useRouteLoaderData<{ user: User; menu: MenuItem[] }>(
  //   "routes/_auth"
  // );
  const matches = useMatches();
  const user = (
    matches.find((match: any) => match.data?.user)?.data as any
  )?.user;

  const { isMobile } = useSidebar();

  // const user = data?.user as User;
  if (!user) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg flex justify-center items-center">
                <AvatarImage src={user.avatar} alt={user.fullname} />
                <AvatarFallback className="rounded-lg">
                  <IoPersonCircleOutline className="size-8"/>
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.fullname}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="rounded-lg p-1 bg-gray-200 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                    {user.username.charAt(1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  <span className="truncate text-xs">{user.fullname}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IoSettingsOutline />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/dashboard/profile" className="cursor-pointer">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard/change-password" className="cursor-pointer">
                <DropdownMenuItem>
                  <RiLockPasswordLine />
                  Change Password
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link to="/auth/logout" className="cursor-pointer">
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
