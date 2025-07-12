"use server"

import { redirect } from "next/navigation"

export async function login(statee, formData){

    redirect("/admin");
    
}