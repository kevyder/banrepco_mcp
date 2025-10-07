export class HttpClient {
    constructor(
        private readonly baseURL: string,
        private readonly userAgent: string = 'BanrepcoMCP/1.0.0'
    ) {}

    async get<T>(path: string): Promise<T> {
        try {
            const response = await fetch(`${this.baseURL}${path}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': this.userAgent
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('API request failed:', errorMessage);
            return { error: `Failed to fetch data: ${errorMessage}` } as T;
        }
    }
}