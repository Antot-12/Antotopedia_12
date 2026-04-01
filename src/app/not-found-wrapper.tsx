import { getLocale, getDictionary } from "@/lib/i18n";
import NotFoundClient from "./NotFoundClient";

export default async function NotFound() {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    return <NotFoundClient locale={locale} dict={dict} />;
}
