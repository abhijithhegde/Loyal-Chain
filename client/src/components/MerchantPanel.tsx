import React, { useState } from "react";
import { ethers } from "ethers";
import { TransactionState } from "../types";
import { useWallet } from "../hooks/useWallet";

interface MerchantPanelProps {
	onSuccess: () => void;
}

export const MerchantPanel: React.FC<MerchantPanelProps> = ({ onSuccess }) => {
	const [purchaseAmount, setPurchaseAmount] = useState("");
	const [txState, setTxState] = useState<TransactionState>({
		loading: false,
		error: null,
	});

	const { getContractWithSigner, getSigner } = useWallet();

	const awardPoints = async () => {
		try {
			if (!purchaseAmount) return;
			setTxState({ loading: true, error: null });

			const signer = await getSigner();
			const loyaltyProgram = await getContractWithSigner();

			const amount = ethers.parseEther(purchaseAmount);
			const tx = await loyaltyProgram.awardPoints(
				await signer.getAddress(),
				amount
			);
			await tx.wait();

			setPurchaseAmount("");
			onSuccess();
		} catch (err: any) {
			setTxState({ loading: false, error: err.message });
		} finally {
			setTxState((prev) => ({ ...prev, loading: false }));
		}
	};

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Award Points</h2>
			<div className="space-y-4">
				<div>
					<input
						type="number"
						value={purchaseAmount}
						onChange={(e) => setPurchaseAmount(e.target.value)}
						placeholder="Purchase Amount"
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				{txState.error && (
					<p className="text-red-500 text-sm">{txState.error}</p>
				)}
				<button
					onClick={awardPoints}
					disabled={txState.loading || !purchaseAmount}
					className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
				>
					{txState.loading ? "Processing..." : "Award Points"}
				</button>
			</div>
		</div>
	);
};
