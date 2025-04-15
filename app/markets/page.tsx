'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Asset, INITIAL_ASSETS } from '../data/assets';

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
              return {
                ...asset,
                price: marketData.quote.USD.price,
                market_cap: marketData.quote.USD.market_cap,
                volume_24h: marketData.quote.USD.volume_24h,
                percent_change_24h: marketData.quote.USD.percent_change_24h,
              };
            }
            return asset;
          })
          .sort((a, b) => b.market_cap - a.market_cap);

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
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">24h Change</th>
              <th className="px-6 py-3">Market Cap</th>
              <th className="px-6 py-3">Volume (24h)</th>
              <th className="px-6 py-3">Borrow Rate</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link href={`/markets/${asset.symbol.toLowerCase()}`}>
                    <div className="flex items-center">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="ml-3">
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-gray-400">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  ${asset.price < 0.01 
                    ? asset.price.toFixed(8)
                    : asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                  }
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      asset.percent_change_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {asset.percent_change_24h >= 0 ? '+' : ''}
                    {asset.percent_change_24h.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  ${(asset.market_cap / 1000000).toFixed(0)}M
                </td>
                <td className="px-6 py-4">
                  ${(asset.volume_24h / 1000000).toFixed(0)}M
                </td>
                <td className="px-6 py-4 text-blue-400">
                  {asset.borrowRate}%
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/markets/${asset.symbol.toLowerCase()}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 