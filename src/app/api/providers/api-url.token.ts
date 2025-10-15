import { InjectionToken } from "@angular/core";

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  // Usa directamente la URL del backend DEV (https puerto 7209)
  factory: () => 'https://localhost:7209/api'
});
