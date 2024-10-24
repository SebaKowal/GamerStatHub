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
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session data:", error);
        return; // Early return on error
      }

      setIsLoggedIn(!!sessionData?.session); // Use optional chaining
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
      <NavbarBrand className="hidden sm:flex">
        <p className="font-bold text-inherit">{isLoggedIn ? <UserProfile /> : 'GSH'}</p>
      </NavbarBrand>

      {/* Navigation links */}
      <NavbarContent
        className={!isLoggedIn ? "hidden sm:flex gap-4" : "gap-4"}
        justify="center"
      >
        <NavbarItem>
          <Link color="foreground" href="../">
            Menu
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="../userGameProfile" aria-current="page">
            MyGameProfile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="../profile">
            Profile
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {!isLoggedIn ? (
          <>
            <NavbarItem className="">
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
            <NavbarItem className="">
              <Button onClick={handleSignOut}>Logout</Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
