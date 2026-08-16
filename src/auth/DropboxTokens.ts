export interface DropboxTokens {
	accessToken: string;
	refreshToken: string;
	/** epoch ms */
	expiresAt: number;
	accountEmail?: string;
}
