import { useTranslation } from "react-i18next";

export default function Home() {
  const { t: translate } = useTranslation();

  return (
    <div className="p-6 h-full min-h-100 rounded-xl border border-base-100 bg-background-100/50 shadow-sm">
      <h1 className="text-2xl font-semibold text-white">{translate('APP.WELCOME')}</h1>
    </div>
  );
}