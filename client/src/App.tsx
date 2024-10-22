import React from "react";
import { useWallet } from "./hooks/useWallet";
import { WalletInfo } from "./components/WalletInfo";
import { MerchantPanel } from "./components/MerchantPanel";
import { CustomerPanel } from "./components/CustomerPanel";

const App: React.FC = () => {
	const { wallet, loading, error, connectWallet, refreshBalance } =
		useWallet();

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Loyalty Program
				</h1>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
						{error}
					</div>
				)}

				<WalletInfo
					wallet={wallet}
					loading={loading}
					onConnect={connectWallet}
				/>

				{wallet.address && (
					<div className="mt-6">
						{wallet.isMerchant ? (
							<MerchantPanel onSuccess={refreshBalance} />
						) : (
							<CustomerPanel onSuccess={refreshBalance} />
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
