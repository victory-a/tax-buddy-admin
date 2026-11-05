import { redirect } from "next/navigation";

import { APP_HOME_PATH } from "@/lib/app-home";

export default function RootPage() {
  redirect(APP_HOME_PATH);
}
