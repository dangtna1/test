"use server";

import type { LoginSchema } from "@/lib/validations/login-schema";
import { signIn, signOut as authSignOut } from "@/auth";

export async function authenticate(values: LoginSchema): Promise<void> {
  await signIn("credentials", { ...values, redirect: false });
}

export async function signOut(): Promise<void> {
  await authSignOut();
}
