'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
  borrowRate?: number;
  cmcId?: string; // CoinMarketCap ID
}

export const INITIAL_ASSETS = [
  { 
    id: 'trump-2024', 
    name: 'Official Trump', 
    symbol: 'TRUMP', 
    image: '/assets/trump.png',
    cmcId: '35336',
    borrowRate: 4.2, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'bonk', 
    name: 'Bonk', 
    symbol: 'BONK', 
    image: '/assets/bonk.png',
    cmcId: '23095',
    borrowRate: 5.8, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'dogwifhat', 
    name: 'dogwifhat', 
    symbol: 'WIF', 
    image: '/assets/wif.png',
    cmcId: '28752',
    borrowRate: 6.2, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'fartcoin', 
    name: 'Fartcoin', 
    symbol: 'FARTCOIN', 
    image: '/assets/fartcoin.png',
    cmcId: '33597', 
    borrowRate: 3.5, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'pudgy', 
    name: 'Pudgy Penguins', 
    symbol: 'PENGU', 
    image: '/assets/pengu.png',
    cmcId: '34466', 
    borrowRate: 4.8, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'popcat', 
    name: 'Popcat', 
    symbol: 'POPCAT', 
    image: '/assets/popcat.png',
    cmcId: '28782', 
    borrowRate: 3.9, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'mew', 
    name: 'cat in a dogs world', 
    symbol: 'MEW', 
    image: '/assets/mew.png',
    cmcId: '30126', 
    borrowRate: 5.1, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'baby-doge-coin', 
    name: 'Baby Doge Coin', 
    symbol: 'BABYDOGE', 
    image: '/assets/babydoge.png',
    cmcId: '10407',
    borrowRate: 4.5, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'gigachad', 
    name: 'Gigachad', 
    symbol: 'GIGA', 
    image: '/assets/giga.png',
    cmcId: '30063', 
    borrowRate: 6.7, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
  { 
    id: 'ai16z', 
    name: 'ai16z', 
    symbol: 'AI16Z', 
    image: '/assets/ai16z.png',
    cmcId: '34026', 
    borrowRate: 5.4, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
] as Asset[];

export default function MarketsPage() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        // Get all CMC IDs that we have
        const cmcIds = INITIAL_ASSETS
          .filter(asset => asset.cmcId)
          .map(asset => asset.cmcId)
          .join(',');

        if (!cmcIds) {
          console.warn('No CoinMarketCap IDs found');
          return;
        }

        console.log('Fetching data for IDs:', cmcIds);

        // Fetch real data for tokens that have CMC IDs
        const response = await fetch('/api/crypto/prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: cmcIds })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if ('error' in data) {
          throw new Error(data.error);
        }

        console.log('Received market data:', data);

        // Update assets with real data and sort by market cap
        const updatedAssets = INITIAL_ASSETS
          .map(asset => {
            if (asset.cmcId && data[asset.cmcId]) {
              const marketData = data[asset.cmcId];
              console.log(`Processing ${asset.symbol}:`, marketData);
              const price = marketData.quote.USD.price;
              const marketCap = marketData.quote.USD.market_cap;
              const percentChange = marketData.quote.USD.percent_change_24h;
              
              return {
                ...asset,
                price: price,
                market_cap: marketCap,
                volume_24h: marketData.quote.USD.volume_24h,
                percent_change_24h: percentChange,
              };
            }
            console.warn(`No data found for ${asset.symbol} (CMC ID: ${asset.cmcId})`);
            return asset;
          })
          .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0)); // Sort by market cap in descending order, handle null values
        
        console.log('Updated assets:', updatedAssets);
        setAssets(updatedAssets);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Markets</h1>
      
      <div className="bg-[#1F2937] rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 text-sm text-gray-400 border-b border-gray-700">
          <div>Asset</div>
          <div>Price</div>
          <div>24h Change</div>
          <div>Market Cap</div>
          <div>Borrow Rate</div>
          <div></div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading market data...</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {assets.map((asset) => (
              <div key={asset.symbol} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                    <Image src={asset.image} alt={asset.name} width={32} height={32} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{asset.name}</div>
                    <div className="text-sm text-gray-400">{asset.symbol}</div>
                  </div>
                </div>
                <div className="text-white">
                  ${asset.price ? (
                    asset.price < 0.0001 ? 
                      `0.0${asset.price.toExponential(5).split('e-')[0].replace('.', '')}`
                    : asset.price.toFixed(7)
                  ) : '0.0000000'}
                </div>
                <div className={asset.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {asset.percent_change_24h?.toFixed(2)}%
                </div>
                <div className="text-white">
                  {asset.symbol === 'SOL' 
                    ? `$${(asset.market_cap / 1000000000).toFixed(2)}B`
                    : `$${(asset.market_cap / 1000000).toFixed(2)}M`
                  }
                </div>
                <div className="text-white">
                  {asset.borrowRate ? `${asset.borrowRate}%` : '-'}
                </div>
                <div>
                  <Link 
                    href={`/markets/${asset.symbol.toLowerCase()}`}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 