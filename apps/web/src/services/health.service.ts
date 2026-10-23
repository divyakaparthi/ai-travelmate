import api from "./api";

export interface HealthResponse {
  success: boolean;
  message: string;
}

export async function checkApiHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>("/health");

  return response.data;
}