import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nService } from "@/core/i18n/i18n.service";

import enFlag from "@/assets/images/i18n/en-US.png";
import esFlag from "@/assets/images/i18n/es-ES.png";

export function LanguagePicker() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(I18nService.getCurrentLanguage() || i18n.language);
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    I18nService.setCurrentLanguage(value);
  };

  return (
    <label className="flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-1 text-sm text-slate-200">
      <img src={language === "es-ES" ? esFlag : enFlag} alt={language} className="h-5 w-5 rounded-2xl object-cover" />
      <select
        value={language}
        onChange={(event) => handleLanguageChange(event.target.value)}
        className="border-none bg-transparent text-sm text-slate-200 outline-none focus:outline-none focus:ring-0">
        <option value="en-US" className="bg-slate-900 text-slate-100">
          {t("TRANSLATOR.LANGUAGES.EN")}
        </option>
        <option value="es-ES" className="bg-slate-900 text-slate-100">
          {t("TRANSLATOR.LANGUAGES.ES")}
        </option>
      </select>
    </label>
  );
}
