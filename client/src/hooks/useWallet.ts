import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WalletState } from "../types";
import {
	LOYALTY_PROGRAM_ADDRESS,
	LOYALTY_TOKEN_ADDRESS,
	LOYALTY_PROGRAM_ABI,
	LOYALTY_TOKEN_ABI,
} from "../constants";

export const useWallet = () => {
	const [wallet, setWallet] = useState<WalletState>({
		address: "",
		isMerchant: false,
		tokenBalance: "0",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getProvider = () => {
		if (!window.ethereum) {
			throw new Error("Please install MetaMask");
		}
		return new ethers.BrowserProvider(window.ethereum);
	};

	const getSigner = async () => {
		const provider = getProvider();
		await window.ethereum.request({ method: "eth_requestAccounts" });
		return provider.getSigner();
	};

	const connectWallet = async () => {
		try {
			setLoading(true);
			setError(null);

			const signer = await getSigner();
			const address = await signer.getAddress();

			const loyaltyProgram = new ethers.Contract(
				LOYALTY_PROGRAM_ADDRESS,
				LOYALTY_PROGRAM_ABI,
				signer
			);

			const loyaltyToken = new ethers.Contract(
				LOYALTY_TOKEN_ADDRESS,
				LOYALTY_TOKEN_ABI,
				signer
			);

			const isMerchant = await loyaltyProgram.merchants(address);
			const balance = await loyaltyToken.balanceOf(address);
			const tokenBalance = ethers.formatEther(balance);

			setWallet({ address, isMerchant, tokenBalance });
		} catch (err: any) {
			console.error("Wallet connection error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const refreshBalance = async () => {
		if (!wallet.address) return;

		try {
			const signer = await getSigner();
			const loyaltyToken = new ethers.Contract(
				LOYALTY_TOKEN_ADDRESS,
				LOYALTY_TOKEN_ABI,
				signer
			);

			const balance = await loyaltyToken.balanceOf(wallet.address);
			setWallet((prev) => ({
				...prev,
				tokenBalance: ethers.formatEther(balance),
			}));
		} catch (err: any) {
			console.error("Error refreshing balance:", err);
		}
	};

	// Also update the functions in MerchantPanel and CustomerPanel components
	const getContractWithSigner = async () => {
		const signer = await getSigner();
		return new ethers.Contract(
			LOYALTY_PROGRAM_ADDRESS,
			LOYALTY_PROGRAM_ABI,
			signer
		);
	};

	useEffect(() => {
		connectWallet();
	}, []);

	return {
		wallet,
		loading,
		error,
		getSigner,
		connectWallet,
		refreshBalance,
		getContractWithSigner, // Export this utility function
	};
};
