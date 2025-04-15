export interface Asset {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
  borrowRate: number;
  supplyRate: number;
  cmcId?: string;
}

export const INITIAL_ASSETS: Asset[] = [
  { 
    id: 'trump-2024', 
    name: 'Official Trump', 
    symbol: 'TRUMP', 
    image: '/assets/trump.png',
    cmcId: '35336',
    borrowRate: 4.2,
    supplyRate: 1.85, 
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
    supplyRate: 2.45, 
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
    supplyRate: 2.75, 
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
    supplyRate: 1.55, 
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
    supplyRate: 2.15, 
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
    supplyRate: 1.65, 
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
    supplyRate: 2.25, 
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
    supplyRate: 1.95, 
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
    supplyRate: 2.85, 
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
    supplyRate: 2.35, 
    price: 0, 
    market_cap: 0, 
    volume_24h: 0, 
    percent_change_24h: 0 
  },
]; 