"use client";

import { useEffect } from "react";

const STORAGE_KEY_PREFIX = "familiada_game_";

export default function ClearGameStorage() {
  useEffect(() => {
    // Wyczyść wszystkie zapisane stany gry
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      if (keysToRemove.length > 0) {
        console.log(`Wyczyszczono ${keysToRemove.length} zapisanych gier`);
      }
    } catch (error) {
      console.warn("Nie można wyczyścić localStorage:", error);
    }
  }, []);

  // Komponent nie renderuje niczego
  return null;
}

