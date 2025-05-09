import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../ui/sidebar";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { MenuItem } from "~/lib/interfaces/menu-item";
import { User } from "~/lib/interfaces/user";
import { FaHome, FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";

const AddIconToMenuItem = (item: MenuItem) => {
  if (item.slug == "home") return <FaHome />;
  if (item.slug == "users") return <FaUsers />;
  if (item.slug == "dashboard") return <MdDashboard />;

  // if (item.children && item.children.length > 0) {
  //   item.children.map((child: MenuItem) => {
  //     return {
  //       ...child,
  //       icon: AddIconToMenuItem(child),
  //     };
  //   });
  // }

  return (
    <div className="flex h-6 w-6 items-center justify-center text-md font-bold text-gray-700 p-1">
      {item.title.charAt(0).toUpperCase()}
    </div>
  );
};

export default function MainNavbar() {
  let { menu } = useRouteLoaderData<{ user: User; menu: MenuItem[] }>(
    "routes/_auth"
  );

  menu = (menu.filter((menu: MenuItem) => menu.type === "TOP_MENU") || []).map(
    (item: MenuItem) => {
      return {
        ...item,
        icon: AddIconToMenuItem(item),
        children: item.children?.map((child: MenuItem) => {
          return {
            ...child,
            icon: AddIconToMenuItem(child),
          };
        }),
      };
    }
  );

  if (!menu) return null;
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {menu.map((item: MenuItem) => {
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children?.map((subItem) => (
                          <Link
                            to={subItem.path}
                            key={`${item.slug}-${subItem.slug}`}
                          >
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <div className="">
                                  {subItem.icon ? subItem.icon : null}
                                  <span>{subItem.title}</span>
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </Link>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <Link to={item.path} key={item.slug}>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
