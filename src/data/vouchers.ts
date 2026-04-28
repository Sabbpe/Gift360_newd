import amazonImg from '@assets/generated_images/Amazon_voucher_card_87b2af36.png';
import starbucksImg from '@assets/generated_images/Starbucks_voucher_card_7342beb1.png';
import netflixImg from '@assets/generated_images/Netflix_voucher_card_b0d160c1.png';
import spotifyImg from '@assets/generated_images/Spotify_voucher_card_3a93bad9.png';
import appleImg from '@assets/generated_images/Apple_voucher_card_45e60f22.png';
import targetImg from '@assets/generated_images/Target_voucher_card_7e210660.png';

export interface Voucher {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  prices: number[];
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  featured?: boolean;
  isOffer?: boolean;
}

export const vouchers: Voucher[] = [
  {
    id: '1',
    title: 'Amazon Gift Card',
    brand: 'Amazon',
    category: 'shopping',
    image: amazonImg,
    prices: [10, 25, 50, 100],
    discount: 5,
    rating: 4.9,
    reviewCount: 2847,
    description: 'Perfect for any occasion. Redeemable on millions of items across Amazon.',
    featured: true,
    isOffer: true,
  },
  {
    id: '2',
    title: 'Starbucks eGift Card',
    brand: 'Starbucks',
    category: 'food',
    image: starbucksImg,
    prices: [5, 10, 25, 50],
    rating: 4.8,
    reviewCount: 1523,
    description: 'Enjoy your favorite coffee, tea, and treats at any Starbucks location.',
    featured: true,
  },
  {
    id: '3',
    title: 'Netflix Gift Card',
    brand: 'Netflix',
    category: 'entertainment',
    image: netflixImg,
    prices: [15, 30, 60, 100],
    discount: 10,
    rating: 4.7,
    reviewCount: 3201,
    description: 'Stream unlimited movies and TV shows on Netflix. No commitment required.',
    featured: true,
    isOffer: true,
  },
  {
    id: '4',
    title: 'Spotify Premium Gift Card',
    brand: 'Spotify',
    category: 'entertainment',
    image: spotifyImg,
    prices: [10, 30, 60],
    rating: 4.6,
    reviewCount: 987,
    description: 'Enjoy ad-free music, offline listening, and unlimited skips.',
  },
  {
    id: '5',
    title: 'Apple Store Gift Card',
    brand: 'Apple',
    category: 'technology',
    image: appleImg,
    prices: [25, 50, 100, 200],
    discount: 3,
    rating: 4.9,
    reviewCount: 4156,
    description: 'Use for apps, games, music, movies, iCloud storage, and more.',
    isOffer: true,
  },
  {
    id: '6',
    title: 'Target GiftCard',
    brand: 'Target',
    category: 'shopping',
    image: targetImg,
    prices: [10, 25, 50, 100],
    rating: 4.7,
    reviewCount: 1876,
    description: 'Shop for everything from groceries to home goods at Target stores and online.',
  },
];
