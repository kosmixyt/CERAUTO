/**
 * Service pour gérer les paramètres de l'application
 * y compris la clé API DeepSeek
 */

// Utilisation du localStorage pour stocker les paramètres
// Dans un environnement Electron, vous pourriez utiliser electron-store à la place
const STORAGE_KEY = "cerauto-settings";

interface Settings {
  deepseekApiKey: string;
  stringArray: string[];
  // Ajoutez d'autres paramètres ici si besoin
}

/**
 * Récupère les paramètres stockés
 */
const getSettings = async (): Promise<Settings> => {
  try {
    const settingsStr = localStorage.getItem(STORAGE_KEY);
    if (settingsStr) {
      return JSON.parse(settingsStr) as Settings;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
  }

  // Paramètres par défaut si rien n'est trouvé
  return {
    deepseekApiKey: "",
    stringArray: [],
  };
};

/**
 * Sauvegarde les paramètres
 */
const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des paramètres:", error);
    throw new Error("Impossible de sauvegarder les paramètres");
  }
};

/**
 * Récupère la clé API DeepSeek
 */
export const getApiKey = async (): Promise<string> => {
  const settings = await getSettings();
  return settings.deepseekApiKey;
};

/**
 * Sauvegarde la clé API DeepSeek
 */
export const saveApiKey = async (apiKey: string): Promise<void> => {
  const settings = await getSettings();
  settings.deepseekApiKey = apiKey;
  await saveSettings(settings);
};

/**
 * Vérifie si une clé API est configurée
 */
export const hasApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey();
  return !!apiKey && apiKey.trim() !== "";
};

/**
 * Sauvegarde un tableau de chaînes de caractères dans les paramètres
 */
export const saveStringArray = async (stringArray: string[]): Promise<void> => {
  const settings = await getSettings();
  settings.stringArray = stringArray;
  await saveSettings(settings);
};

/**
 * Récupère le tableau de chaînes de caractères depuis les paramètres
 */
export const getStringArray = async (): Promise<string[]> => {
  const settings = await getSettings();
  return settings.stringArray || [];
};
