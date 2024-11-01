export function getErrorMessage(error: unknown): string {
    let errorText;
    if (error instanceof Error) errorText = error.message;
    else errorText = String(error);
    if (errorText.includes('Failed to fetch')) errorText = 'Сервер не доступен'
    else if (errorText.includes('NetworkError')) errorText = 'Нет подключения к сети'
    return errorText;
}