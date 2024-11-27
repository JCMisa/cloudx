"use client";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PROPS {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: PROPS) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href={"/"}>
        <div className="hidden h-auto lg:flex items-center gap-1">
          <Image src={"/cloudx-logo.svg"} alt="logo" width={30} height={30} />
          <h1 className="text-2xl">
            Cloud<span className="text-primary">X</span>
          </h1>
        </div>
        <div className="lg:hidden h-auto flex items-center justify-center">
          <Image src={"/cloudx-logo.svg"} alt="logo" width={30} height={30} />
        </div>
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => (
            <Link href={item.url} key={item.name} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === item.url && "shad-active"
                )}
              >
                <Image src={item.icon} alt="name" width={24} height={24} />
                <p className="hidden lg:flex">{item.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src={"/auth-icon-2.png"}
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        {avatar ? (
          <Image
            src={avatar}
            alt="avatar"
            width={44}
            height={44}
            className="sidebar-user-avatar"
          />
        ) : (
          <Image
            src={"/avatar-placeholder.webp"}
            alt="avatar"
            width={44}
            height={44}
            className="sidebar-user-avatar"
          />
        )}

        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
