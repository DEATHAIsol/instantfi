'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { INITIAL_ASSETS } from '../page';
import Script from 'next/script';

// Add type declaration for Jupiter global
declare global {
  interface Window {
    Jupiter?: {
      init: (config: {
        displayMode: string;
        integratedTargetId: string;
        endpoint: string;
        strictTokenList: boolean;
        formProps: {
          initialAmount: string;
          initialInputMint: string;
          initialOutputMint: string;
        };
      }) => void;
    };
  }
}

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
  cmcId?: string;
}

interface TokenData extends Asset {
  ath?: number;
  ath_date?: string;
  total_supply?: number;
  circulating_supply?: number;
  contract_address?: string;
  website?: string;
  twitter?: string;
  rating?: number;
}

export default function TokenPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chart');
  const [jupiterLoaded, setJupiterLoaded] = useState(false);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        const token = INITIAL_ASSETS.find(
          (asset) => asset.symbol.toLowerCase() === params.symbol
        );

        if (!token?.cmcId) {
          throw new Error('Token not found');
        }

        const response = await fetch('/api/crypto/prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: token.cmcId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch token data');
        }

        const data = await response.json();
        const marketData = data[token.cmcId];

        const updatedTokenData: TokenData = {
          ...token,
          price: marketData.quote.USD.price,
          market_cap: marketData.quote.USD.market_cap,
          volume_24h: marketData.quote.USD.volume_24h,
          percent_change_24h: marketData.quote.USD.percent_change_24h,
          ath: marketData.ath,
          ath_date: marketData.ath_date,
          total_supply: marketData.total_supply,
          circulating_supply: marketData.circulating_supply,
          contract_address: marketData.platform?.token_address,
          website: marketData.urls?.website?.[0],
          twitter: marketData.urls?.twitter?.[0]?.replace('https://twitter.com/', ''),
          rating: marketData.rating || null,
        };

        setTokenData(updatedTokenData);
      } catch (error) {
        console.error('Error fetching token data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 60000);

    return () => clearInterval(interval);
  }, [params.symbol]);

  // Initialize Jupiter when tab changes to swap and token data is loaded
  useEffect(() => {
    if (activeTab === 'swap' && tokenData?.contract_address && jupiterLoaded) {
      // Initialize Jupiter Terminal
      window.Jupiter?.init({
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
        strictTokenList: false,
        formProps: {
          initialAmount: "0",
          initialInputMint: "So11111111111111111111111111111111111111112", // SOL
          initialOutputMint: tokenData.contract_address,
        },
      });
    }
  }, [activeTab, tokenData?.contract_address, jupiterLoaded]);

  if (loading || !tokenData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Script
        src="https://terminal.jup.ag/main-v4.js"
        onLoad={() => setJupiterLoaded(true)}
      />
      
      {/* Token Header */}
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={tokenData.image}
          alt={tokenData.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{tokenData.name}</h1>
          <p className="text-gray-500">{tokenData.symbol}</p>
        </div>
        <div className="ml-auto">
          <div className="text-2xl font-bold">
            ${tokenData.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}
          </div>
          <div className={`text-sm ${tokenData.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {tokenData.percent_change_24h >= 0 ? '+' : ''}{tokenData.percent_change_24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Market Cap</div>
          <div className="text-lg font-semibold">
            ${(tokenData.market_cap / 1e6).toFixed(2)}M
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">24h Volume</div>
          <div className="text-lg font-semibold">
            ${(tokenData.volume_24h / 1e6).toFixed(2)}M
          </div>
        </div>
        {tokenData.borrowRate && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Borrow Rate</div>
            <div className="text-lg font-semibold">
              {tokenData.borrowRate}%
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('chart')}
          className={`pb-2 px-4 ${activeTab === 'chart' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Chart
        </button>
        <button
          onClick={() => setActiveTab('swap')}
          className={`pb-2 px-4 ${activeTab === 'swap' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Swap
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-2 px-4 ${activeTab === 'info' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Info
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-800 rounded-lg p-4">
        {activeTab === 'chart' && (
          <div className="h-[600px]">
            <iframe
              src={`https://dexscreener.com/${tokenData.contract_address ? 'solana/' + tokenData.contract_address : 'search?q=' + tokenData.symbol}?embed=1&theme=dark`}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}
        {activeTab === 'swap' && (
          <div className="h-[600px] flex items-center justify-center">
            <div id="integrated-terminal" className="w-full max-w-lg h-full" />
          </div>
        )}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Market Stats */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Market Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                {tokenData.ath && (
                  <div>
                    <div className="text-sm text-gray-400">All Time High</div>
                    <div className="text-lg font-semibold">
                      ${tokenData.ath.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}
                    </div>
                    {tokenData.ath_date && (
                      <div className="text-xs text-gray-500">
                        {new Date(tokenData.ath_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-400">24h Trading Volume</div>
                  <div className="text-lg font-semibold">
                    ${(tokenData.volume_24h / 1e6).toFixed(2)}M
                  </div>
                  <div className="text-xs text-gray-500">
                    Volume/Market Cap: {((tokenData.volume_24h / tokenData.market_cap) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Information */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Supply Information</h3>
              <div className="space-y-4">
                {tokenData.total_supply && (
                  <div>
                    <div className="text-sm text-gray-400">Total Supply</div>
                    <div className="text-lg font-semibold">
                      {tokenData.total_supply.toLocaleString()} {tokenData.symbol}
                    </div>
                  </div>
                )}
                {tokenData.circulating_supply && (
                  <div>
                    <div className="text-sm text-gray-400">Circulating Supply</div>
                    <div className="text-lg font-semibold">
                      {tokenData.circulating_supply.toLocaleString()} {tokenData.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((tokenData.circulating_supply / tokenData.total_supply!) * 100).toFixed(2)}% of total supply
                    </div>
                  </div>
                )}
                {tokenData.market_cap && (
                  <div>
                    <div className="text-sm text-gray-400">Market Cap</div>
                    <div className="text-lg font-semibold">
                      ${(tokenData.market_cap / 1e6).toFixed(2)}M
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contract Information */}
            {tokenData.contract_address && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-400">Contract Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-800 p-2 rounded break-all flex-1">
                        {tokenData.contract_address}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(tokenData.contract_address!)}
                        className="p-2 hover:bg-gray-700 rounded"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://solscan.io/token/${tokenData.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm bg-gray-800 px-3 py-1 rounded"
                    >
                      View on Solscan
                    </a>
                    <a
                      href={`https://dexscreener.com/solana/${tokenData.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm bg-gray-800 px-3 py-1 rounded"
                    >
                      View on DexScreener
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Links and Social */}
            {(tokenData.website || tokenData.twitter) && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Links & Social</h3>
                <div className="grid grid-cols-2 gap-4">
                  {tokenData.website && (
                    <a
                      href={tokenData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 bg-gray-800 p-3 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                      Website
                    </a>
                  )}
                  {tokenData.twitter && (
                    <a
                      href={`https://twitter.com/${tokenData.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 bg-gray-800 p-3 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 