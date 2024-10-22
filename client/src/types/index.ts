export type WalletState = {
	address: string;
	isMerchant: boolean;
	tokenBalance: string;
};

export type TransactionState = {
	loading: boolean;
	error: string | null;
};
