/**
 * Утилита для диагностики проблем с API
 */
import { ApiService } from "@/services/api";

export async function testApiConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Пытаемся сделать простой запрос для проверки подключения
    // Если есть health check endpoint, используйте его, иначе попробуем любой endpoint
    const response = await ApiService.get("/health", { skipAuth: true });
    return {
      success: true,
      message: "API подключение работает",
      details: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Не удалось подключиться к API",
      details: {
        error: error.toString(),
        stack: error.stack,
      },
    };
  }
}

export function logApiInfo() {
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL ||
    "https://technolifestore.com/api/gym-tracker";

  console.log("🔍 API Diagnostics:");
  console.log("  URL:", apiUrl);
  console.log("  Environment:", __DEV__ ? "Development" : "Production");
  console.log("  Platform:", process.platform);
}

