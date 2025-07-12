"use client";

import { rgister } from "@/actions/auth";
import { useActionState } from "react";
import Login from "./(routes)/login/page";

export default function Home() {
  // const [state, action, isPending] = useActionState(rgister, undefined);

  return (
    <Login/>
  );
}
