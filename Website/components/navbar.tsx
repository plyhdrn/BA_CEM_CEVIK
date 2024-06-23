"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LockIcon } from "lucide-react";

const Navbar = ({
  className,
  user,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const isLogged = user !== undefined && user !== null;
  // Get current path
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="flex h-14 px-8 items-center w-full">
        <a className="flex items-center space-x-2 w-2/12" href="/">
          <span className="hidden font-bold sm:inline-block">
            ProcurDat Crawler
          </span>
        </a>
        <div className="flex gap-4 justify-center w-8/12">
          <NavigationMenu className="w-full">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent sm:text-sm text-xs"
                    )}
                    active={
                      pathname === "/" || pathname.startsWith("/overview")
                    }
                  >
                    Overview
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/companies" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent sm:text-sm text-xs"
                    )}
                    active={pathname.startsWith("/companies")}
                  >
                    Companies
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/matching" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent sm:text-sm text-xs"
                    )}
                    active={pathname.startsWith("/matching")}
                  >
                    Matching{" "}
                    {!isLogged && <LockIcon className="ml-2 w-3 h-3" />}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/settings" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent sm:text-sm text-xs"
                    )}
                    active={pathname.startsWith("/settings")}
                  >
                    Settings{" "}
                    {!isLogged && <LockIcon className="ml-2 w-3 h-3" />}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex w-2/12"></div>
      </div>
      {pathname.startsWith("/settings") && pathname.split("/").length > 1 && (
        <div className="flex py-2 px-4 items-center w-full border-t border-border/60">
          <div className="flex gap-4 justify-start w-full">
            <NavigationMenu className="w-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href={`/settings`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent sm:text-sm text-xs"
                      )}
                      active={
                        !pathname.startsWith("/settings/profile") &&
                        !pathname.startsWith("/settings/sync") &&
                        !pathname.startsWith("/settings/setup-logs")
                      }
                    >
                      Setup
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={`/settings/setup-logs`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent sm:text-sm text-xs"
                      )}
                      active={pathname.startsWith("/settings/setup-logs")}
                    >
                      Setup Logs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={`/settings/profile`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent sm:text-sm text-xs"
                      )}
                      active={pathname.startsWith("/settings/profile")}
                    >
                      Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={`/settings/sync`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent sm:text-sm text-xs"
                      )}
                      active={pathname.startsWith("/settings/sync")}
                    >
                      Website Sync
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      )}
      {pathname.startsWith("/overview") && pathname.split("/").length > 2 && (
        <div className="flex py-2 px-4 items-center w-full border-t border-border/60">
          <div className="flex gap-4 justify-start w-full">
            <NavigationMenu className="w-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href={`${pathname.split("/").slice(0, 3).join("/")}`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                      active={!pathname.endsWith("/raw")}
                    >
                      Details
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={`${pathname.split("/").slice(0, 3).join("/")}/raw`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                      active={pathname.endsWith("/raw")}
                    >
                      Raw
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      )}
      {pathname.startsWith("/companies") && pathname.split("/").length > 2 && (
        <div className="flex py-2 px-4 items-center w-full border-t border-border/60">
          <div className="flex gap-4 justify-start w-full">
            <NavigationMenu className="w-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href={`${pathname.split("/").slice(0, 3).join("/")}`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                      active={
                        !pathname.endsWith("/profile") &&
                        !pathname.endsWith("/alternativeName")
                      }
                    >
                      Details
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={`${pathname
                      .split("/")
                      .slice(0, 3)
                      .join("/")}/profile`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                      active={pathname.endsWith("/profile")}
                    >
                      Profiles
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={`${pathname
                      .split("/")
                      .slice(0, 3)
                      .join("/")}/alternativeName`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                      active={pathname.endsWith("/alternativeName")}
                    >
                      Alternative Names
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
