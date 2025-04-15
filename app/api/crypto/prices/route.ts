import { NextResponse } from 'next/server';

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';

interface CMCQuote {
  price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
}

interface CMCTokenData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: CMCQuote;
  };
}

interface CMCResponse {
  data: {
    [key: string]: CMCTokenData;
  };
  status: {
    error_code: number;
    error_message: string | null;
  };
}

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!CMC_API_KEY) {
      throw new Error('CoinMarketCap API key not configured');
    }

    if (!ids || ids.length === 0) {
      throw new Error('No cryptocurrency IDs provided');
    }

    console.log('Fetching data for IDs:', ids);

    const response = await fetch(`${CMC_API_URL}?id=${ids}&convert=USD`, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      cache: 'no-store' // Disable caching to get fresh data
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error('CoinMarketCap API error:', responseText);
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = JSON.parse(responseText) as CMCResponse;
    
    if (!data.data) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from CoinMarketCap');
    }

    if (data.status?.error_code > 0) {
      throw new Error(data.status.error_message || 'Unknown CoinMarketCap API error');
    }

    // Transform the data to match our expected format
    const transformedData: { [key: string]: CMCTokenData } = {};
    
    Object.entries(data.data).forEach(([id, tokenData]) => {
      if (tokenData.quote?.USD) {
        transformedData[id] = {
          ...tokenData,
          quote: {
            USD: {
              price: Number(tokenData.quote.USD.price),
              market_cap: Number(tokenData.quote.USD.market_cap),
              volume_24h: Number(tokenData.quote.USD.volume_24h),
              percent_change_24h: Number(tokenData.quote.USD.percent_change_24h)
            }
          }
        };
      }
    });

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch crypto prices' },
      { status: 500 }
    );
  }
} 