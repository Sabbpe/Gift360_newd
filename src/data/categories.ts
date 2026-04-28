import type { LucideIcon } from "lucide-react";
import { Gift, ShoppingBag, Film, Utensils, Laptop, Gamepad } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

export const categories: Category[] = [
  { id: "shopping", name: "Shopping", icon: ShoppingBag, count: 45 },
  { id: "food", name: "Food & Dining", icon: Utensils, count: 28 },
  { id: "entertainment", name: "Entertainment", icon: Film, count: 32 },
  { id: "technology", name: "Technology", icon: Laptop, count: 38 },
  { id: "gaming", name: "Gaming", icon: Gamepad, count: 24 },
  { id: "general", name: "General", icon: Gift, count: 56 },
];

// Add new interfaces for banner categories
export interface BannerOffer {
  brand: string;
  cashback: string;
  image: string;
  link: string;
}

export interface BannerCategory {
  title: string;
  offers: BannerOffer[];
}

// Add banner categories data
export const bannerCategories: BannerCategory[] = [
  {
    title: 'Food & Beverage',
    offers: [
      {
        brand: 'Swiggy',
        cashback: '2% Cashback',
        image: 'https://oppositehq.com/static/093e5bc57bd63ed065a2ef52b9db61ab/06d71/6_burger_swiggy_59aeb30f66.jpg',
        link: '/vouchers?brand=swiggy'
      },
      {
        brand: 'Zepto',
        cashback: '2% Cashback',
        image: 'https://indiatechdesk.com/wp-content/uploads/2024/06/Zepto.png',
        link: '/vouchers?brand=zepto'
      },
      {
        brand: 'Big Basket',
        cashback: '3.5% Cashback',
        image: 'https://assets.entrepreneur.com/content/3x2/2000/20160302090451-Great-Grocery-Deals-at-BigBasket-with-Pennyful.jpeg',
        link: '/vouchers?brand=easydiner'
      }
    ]
  },
  {
    title: 'Gaming',
    offers: [
      {
        brand: 'Nintendo',
        cashback: '9% Cashback',
        image: 'https://thebrandhopper.com/wp-content/uploads/2023/09/nintendo-story.webp',
        link: '/vouchers?brand=nintendo'
      },
      {
        brand: 'Steam Doom',
        cashback: 'Up to 5% Cashback',
        image: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/wm/2025/05/doom-the-dark-ages-steam-rewards-game-rant.jpg',
        link: '/vouchers?brand=steam'
      },
      {
        brand: 'Honkai',
        cashback: 'Flat 5% Cashback',
        image: 'https://upload-os-bbs.hoyolab.com/upload/2024/05/04/148434133/f0a96b1b3c6044041de8c042be87c3cc_1862272498977734485.png?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70',
        link: '/vouchers?brand=honkai'
      }
    ]
  },
  {
    title: 'Jewelry',
    offers: [
      {
        brand: 'Giva',
        cashback: '7% Cashback',
        image: 'https://images.unsplash.com/photo-1728120098020-a6007f209a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBqZXdlbHJ5JTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjYzMDA1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        link: '/vouchers?brand=giva'
      },
      {
        brand: 'Estelle',
        cashback: '9% Cashback',
        image: 'https://images.unsplash.com/photo-1629201688905-697730d24490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY2MTk2NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        link: '/vouchers?brand=estelle'
      },
      {
        brand: 'Kalyan Diamonds',
        cashback: '3.5% Cashback',
        image: 'https://assets.myhubble.money/brand-assets/tile-images-wp/kalyan-diamond-tile.webp',
        link: '/vouchers?brand=kalyan-diamonds'
      }
    ]
  },
  {
    title: 'Fashion',
    offers: [
      {
        brand: 'Armani Exchange',
        cashback: '6% Cashback',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKIyrQ7iRYdSqFqn2cfA4CEAshbSIZm_Izgw&s',
        link: '/vouchers?brand=armani-exchange'
      },
      {
        brand: 'Dune London',
        cashback: '6% Cashback',
        image: 'https://99paisa.s3.ap-south-1.amazonaws.com/fund--request/Qn345hDXlczr5jE03d0Jm6CRiO5TTfvjuNb950Fv.jpg',
        link: '/vouchers?brand=dune-london'
      },
      {
        brand: 'Superdry',
        cashback: '6% Cashback',
        image: 'https://img.businessoffashion.com/resizer/v2/IVJDEKZALFDBTK4R3RKYZKEVRM.jpg?auth=f929e3ee5736351a9aa5437bfd4c03a65ef35d293d7c8df744294b98bcb12620&width=1440',
        link: '/vouchers?brand=superdry'
      }
    ]
  }
];
