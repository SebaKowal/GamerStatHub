"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import UserProfile from "@/components/supaauth/user-profile";

export default function NavbarComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createSupabaseBrowser();
      const { data: sessionData } = await supabase.auth.getSession();

      setIsLoggedIn(!!sessionData.session);
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <Navbar shouldHideOnScroll>
      {!isLoggedIn ? (
        <NavbarBrand>
          <p className="font-bold text-inherit">GSH</p>
        </NavbarBrand>
      ) : (
        <NavbarBrand>
          <UserProfile />
        </NavbarBrand>
      )}

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="./menu">
            Menu
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="./userGameProfile" aria-current="page">
            MyGameProfile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="./profile">
            Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!isLoggedIn ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button>
                <Link href="/register">Register</Link>
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button onClick={handleSignOut}>Logout</Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
