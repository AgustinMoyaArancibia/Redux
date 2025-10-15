export function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1] ?? '';
    const norm = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(norm).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
