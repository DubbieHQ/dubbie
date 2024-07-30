"use server";
import { revalidatePath } from "next/cache";
// revalidatePath("/(dashboard)", "page");
export const revalidatePathAction = (
  path: string,
  type?: "page" | "layout",
) => {
  revalidatePath(path, type);
};
