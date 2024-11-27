"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import FileUploader from "./FileUploader";

interface PROPS {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: PROPS) => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  return (
    <header className="mobile-header">
      <Image
        src={"/cloudx-logo.svg"}
        alt="logo"
        width={50}
        height={50}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src={"/assets/icons/menu.svg"}
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avata"
                  width={44}
                  height={44}
                  className="header-user-avatar"
                />
              ) : (
                <Image
                  src={"/avatar-placeholder.png"}
                  alt="avata"
                  width={44}
                  height={44}
                  className="header-user-avatar"
                />
              )}
              <div className="lg:hidden overflow-hidden block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-100/20" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <Link href={item.url} key={item.name} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === item.url && "shad-active"
                    )}
                  >
                    <Image src={item.icon} alt="name" width={24} height={24} />
                    <p>{item.name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className="my-5 bg-light-100/20" />
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader />
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={() => {}}
            >
              <LogOut className="w-8 h-8 cursor-pointer" />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
