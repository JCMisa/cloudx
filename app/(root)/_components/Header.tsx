import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React from "react";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = () => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <LogOut className="w-8 h-8 cursor-pointer" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
