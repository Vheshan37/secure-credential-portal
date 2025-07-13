"use server"

import { redirect } from "next/navigation"

export async function login(state, formData){
    // validation here...
    redirect("/admin");    
}

export async function guestLogin(state, formData){
    // validation here...
    redirect("/guest");
}