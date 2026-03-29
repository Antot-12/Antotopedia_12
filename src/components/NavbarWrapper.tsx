import { getCurrentUser } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
    const user = await getCurrentUser();
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    return <Navbar user={user} locale={locale} dict={dict} />;
}
