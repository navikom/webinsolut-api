export function errorResponse(error: string) {
  return { success: false, error: error };
}

export function successResponse(data: any) {
  return { success: true, data };
}

