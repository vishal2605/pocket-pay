"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { userState } from "./store/atoms/UserState";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Page(): JSX.Element {
  const session = useSession();
  return (
   <div>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
   </div>
  );
}

