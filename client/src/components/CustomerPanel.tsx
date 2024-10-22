import React, { useState } from "react";
import { TransactionState } from "../types";

import { useWallet } from "../hooks/useWallet";

interface CustomerPanelProps {
	onSuccess: () => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({ onSuccess }) => {
	const [redeemAmount, setRedeemAmount] = useState("");
	const [txState, setTxState] = useState<TransactionState>({
		loading: false,
		error: null,
	});

	const { getContractWithSigner } = useWallet();

	const redeemPoints = async () => {
		try {
			if (!redeemAmount) return;
			setTxState({ loading: true, error: null });

			const loyaltyProgram = await getContractWithSigner();
			const tx = await loyaltyProgram.redeemPoints(redeemAmount);
			await tx.wait();

			setRedeemAmount("");
			onSuccess();
		} catch (err: any) {
			setTxState({ loading: false, error: err.message });
		} finally {
			setTxState((prev) => ({ ...prev, loading: false }));
		}
	};

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Redeem Points</h2>
			<div className="space-y-4">
				<div>
					<input
						type="number"
						value={redeemAmount}
						onChange={(e) => setRedeemAmount(e.target.value)}
						placeholder="Points to Redeem"
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				{txState.error && (
					<p className="text-red-500 text-sm">{txState.error}</p>
				)}
				<button
					onClick={redeemPoints}
					disabled={txState.loading || !redeemAmount}
					className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-purple-300"
				>
					{txState.loading ? "Processing..." : "Redeem Points"}
				</button>
			</div>
		</div>
	);
};
