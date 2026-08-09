const defaultLanguage = "en-US";

export class I18nService {
  static getCurrentLanguage(): string {
    return localStorage.getItem("app-language") || defaultLanguage;
  }

  static setCurrentLanguage(language: string): void {
    localStorage.setItem("app-language", language);
  }
}
