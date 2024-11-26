import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-dark-100 p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <div className="flex items-center gap-1">
            <Image
              src={"/cloudx-logo.svg"}
              alt="logo"
              width={50}
              height={50}
              className="h-auto"
            />
            <h1 className="h1">
              Cloud<span className="text-primary">X</span>
            </h1>
          </div>
          <div className="space-y-5 text-white mt-10">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents
            </p>
          </div>
          <Image
            src={"/auth-icon-2.png"}
            alt="auth-icon"
            width={1000}
            height={1000}
            className="transition-all hover:rotate-2 hover:scale-105 w-[280px] h-[280px]"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-dark p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src={"/cloudx-logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
      </section>
    </div>
  );
};

export default AuthLayout;
