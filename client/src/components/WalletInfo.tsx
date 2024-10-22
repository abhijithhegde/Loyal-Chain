import React from "react";
import { WalletState } from "../types";

interface WalletInfoProps {
	wallet: WalletState;
	loading: boolean;
	onConnect: () => void;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({
	wallet,
	loading,
	onConnect,
}) => {
	return (
		<div className="bg-white rounded-lg shadow p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4">Wallet Info</h2>
			<div className="space-y-2">
				<p className="text-gray-600">
					Address:{" "}
					<span className="text-gray-900">
						{wallet.address || "Not connected"}
					</span>
				</p>
				<p className="text-gray-600">
					Role:{" "}
					<span className="text-gray-900">
						{wallet.isMerchant ? "Merchant" : "Customer"}
					</span>
				</p>
				<p className="text-gray-600">
					Token Balance:{" "}
					<span className="text-gray-900">{wallet.tokenBalance}</span>
				</p>
				{!wallet.address && (
					<button
						onClick={onConnect}
						disabled={loading}
						className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
					>
						{loading ? "Connecting..." : "Connect Wallet"}
					</button>
				)}
			</div>
		</div>
	);
};
