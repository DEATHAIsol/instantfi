import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const supplyAssets = [
  { name: 'Official Trump', symbol: 'TRUMP', image: '/assets/trump.png' },
  { name: 'Bonk', symbol: 'BONK', image: '/assets/bonk.png' },
  { name: 'Fartcoin', symbol: 'FARTCOIN', image: '/assets/fartcoin.png' },
  { name: 'dogwifhat', symbol: 'WIF', image: '/assets/wif.png' },
  { name: 'Pudgy Penguins', symbol: 'PENGU', image: '/assets/pengu.png' },
  { name: 'Popcat', symbol: 'POPCAT', image: '/assets/popcat.png' },
  { name: 'cat in a dogs world', symbol: 'MEW', image: '/assets/mew.png' },
  { name: 'Baby Doge Coin', symbol: 'BABYDOGE', image: '/assets/babydoge.png' },
  { name: 'Gigachad', symbol: 'GIGA', image: '/assets/giga.png' },
  { name: 'ai16z', symbol: 'AI16Z', image: '/assets/ai16z.png' },
];

const borrowAssets = [
  { name: 'Solana', symbol: 'SOL', image: '/assets/sol.png', apy: '2.73%' },
  { name: 'USD Coin', symbol: 'USDC', image: '/assets/usdc.png', apy: '3.80%' },
];

export default function Market() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-8 w-8 rounded-full bg-blue-500"></div>
        <h1 className="text-2xl font-bold">Core Instance</h1>
        <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">v3</span>
      </div>
      
      <p className="text-gray-400 mb-8">
        Main Solana market with the largest selection of assets and yield options
      </p>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400">Net worth</p>
          <p className="text-2xl font-bold">$0</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Net APY</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
          VIEW TRANSACTIONS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Supply Section */}
        <div className="bg-[#1F2937] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Your supplies</h2>
          <p className="text-gray-400 mb-6">Nothing supplied yet</p>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assets to supply</h3>
              <button className="text-sm text-gray-400">Hide</button>
            </div>
            
            <div className="bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center text-sm text-blue-400">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                Your Solana wallet is empty. Purchase or transfer assets.
              </div>
            </div>

            <div className="space-y-4">
              {supplyAssets.map((asset) => (
                <div key={asset.symbol} className="grid grid-cols-4 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image src={asset.image} alt={asset.name} width={32} height={32} />
                    </div>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-400">{asset.symbol}</div>
                    </div>
                  </div>
                  <div>0</div>
                  <div>0%</div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Supply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borrow Section */}
        <div className="bg-[#1F2937] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your borrows</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm">E-Mode</span>
              <span className="px-2 py-1 text-xs bg-gray-700 rounded-full">DISABLED</span>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6">Nothing borrowed yet</p>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assets to borrow</h3>
              <button className="text-sm text-gray-400">Hide</button>
            </div>
            
            <div className="bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center text-sm text-blue-400">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                To borrow you need to supply any asset to be used as collateral.
              </div>
            </div>

            <div className="space-y-4">
              {borrowAssets.map((asset) => (
                <div key={asset.symbol} className="grid grid-cols-4 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image src={asset.image} alt={asset.name} width={32} height={32} />
                    </div>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-400">{asset.symbol}</div>
                    </div>
                  </div>
                  <div>0</div>
                  <div>{asset.apy}</div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Borrow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 