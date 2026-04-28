export interface Brand {
  BrandCode: string;
  BrandName: string;
  Category?: string;
  Discount?: string;
  Images?: {
    thumbnail?: string;
    mobile?: string;
    base?: string;
    small?: string;
    featured?: string;
  };
}

export const apiBrands = [
  {
    BrandCode: "CNPIN",
    Discount: "1.50",
    BrandName: "API TESTING - CN & PIN",
    Brandtype: "Variable",
    minPrice: 1,
    maxPrice: 10000,
    DenominationList: "1-10000",
    StockAvailable: 0,
    Category: "E-Commerce",
    Description: "API TESTING - CN & PIN",

    // convert string → real JSON object
    Images: {
      thumbnail:
        "https://gbdev.s3.amazonaws.com/uat/product/CNPIN/d/thumbnail/324_microsite.png",
      mobile:
        "https://gbdev.s3.amazonaws.com/uat/product/CNPIN/d/mobile/324_microsite.png",
      base: "https://gbdev.s3.amazonaws.com/uat/product/CNPIN/d/image/324_microsite.png",
      small:
        "https://gbdev.s3.amazonaws.com/uat/product/CNPIN/d/small_image/324_microsite.png",
    },

    TnC: { "1": "tete" },
    ImportantInstruction: {},
    RedeemSteps: [],
  },
  {
    BrandCode: "VOUCHERCODE",
    Discount: "6.00",
    BrandName: "API TESTING - Voucher code",
    Brandtype: "",
    minPrice: 100,
    maxPrice: 5000,
    DenominationList: "",
    StockAvailable: 0,
    Category: "E-Commerce",
    Description: "API TESTING - Voucher code",

    Images: {
      thumbnail:
        "https://gbdev.s3.amazonaws.com/uat/product/VOUCHERCODE/d/thumbnail/325_microsite.jpg",
      mobile:
        "https://gbdev.s3.amazonaws.com/uat/product/VOUCHERCODE/d/mobile/325_microsite.jpg",
      base: "https://gbdev.s3.amazonaws.com/uat/product/VOUCHERCODE/d/image/325_microsite.jpg",
      small:
        "https://gbdev.s3.amazonaws.com/uat/product/VOUCHERCODE/d/small_image/325_microsite.jpg",
    },

    TnC: {},
    ImportantInstruction: {},
    RedeemSteps: [],
  },
  {
    BrandCode: "Baskin_Robins3wlnz4npjdrUFMgr",
    Discount: "2.00",
    BrandName: "Baskin Robins",
    Brandtype: "Fixed",
    minPrice: "0",
    maxPrice: "0",
    DenominationList: "100",
    StockAvailable: 0,
    Category: "Food & Beverages",
    Description: "Get extra 5X Reward Points...",

    Images: {},

    TnC: "1.This is a Baskin Robbins Insta Gift Voucher...",
    ImportantInstruction: {
      "0": "Gift Vouchers CANNOT be used Online.",
      "1": "Multiple Gift Vouchers CAN be used in one bill.",
      "2": "Gift Vouchers are ACCEPTED at all Listed Outlets.",
    },

    RedeemSteps: [
      {
        title: "Visit the listed outlet.",
        image:
          "https://at.valuedesign.co.in/media/uploads/products/BaskinRobbins/1.png",
      },
      {
        title: "Order food & enjoy your meal.",
        image:
          "https://at.valuedesign.co.in/media/uploads/products/BaskinRobbins/2.png",
      },
      {
        title: "Provide the Gift Voucher…",
        image: null,
      },
    ],
  },
  {
    BrandCode: "SabbPe-PH",
    Discount: "6.00",
    BrandName: "PIZZAHUT",
    Brandtype: "Fixed",
    minPrice: 250,
    maxPrice: 500,
    DenominationList: "100,200,500,1000,2500,3000,5000",
    StockAvailable: 0,
    Category: "Food & Beverages",
    Description: "Pizza Hut is a global restaurant chain...",

    Images: {
      thumbnail: "https://www.adivaha.shop/asset/image/Pizza_Hut.png",
      featured: "https://www.adivaha.com/gift-card/images/pizzahutcard_01.png",
    },

    TnC: "1. This Pizza Hut E-Gift Card (E-GC) is issued by...",
    ImportantInstruction: {
      "0": "Multiple Gift Vouchers can be used in one bill.",
      "1": "One Gift Voucher cannot be used multiple times.",
      "2": "Gift Vouchers accepted at all Listed Outlets.",
      "3": "Gift Vouchers cannot be used Online.",
    },

    RedeemSteps: [
      {
        title: "Locate a Pizza Hut restaurant near you.",
        image:
          "http://cards.vdwebapi.com/media/uploads/products/redeemsteps/PizzaHut/1.jpg",
      },
      {
        title: "Notify cashier...",
        image:
          "http://cards.vdwebapi.com/media/uploads/products/redeemsteps/PizzaHut/2.jpg",
      },
      {
        title: "Place your order...",
        image:
          "http://cards.vdwebapi.com/media/uploads/products/redeemsteps/PizzaHut/3.jpg",
      },
    ],
  },
  // ---------------------- EXTRA BRANDS ----------------------
  {
    BrandCode: "AMAZONIN",
    Discount: "4.50",
    BrandName: "Amazon India",
    Brandtype: "Variable",
    minPrice: 50,
    maxPrice: 10000,
    DenominationList: "50-10000",
    StockAvailable: 1,
    Category: "E-Commerce",
    Description: "Shop everything on Amazon India using gift vouchers.",
    Images: {
      thumbnail:
        "https://m.media-amazon.com/images/G/31/gc/designs/livepreview/amazon_dkblue_circle.png",
    },
  },
  {
    BrandCode: "FLIPKART",
    Discount: "5.00",
    BrandName: "Flipkart",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 10000,
    DenominationList: "100-10000",
    StockAvailable: 1,
    Category: "E-Commerce",
    Description: "India's biggest online marketplace.",
    Images: {
      thumbnail:
        "https://1000logos.net/wp-content/uploads/2021/02/Flipkart-logo.png",
    },
  },
  {
    BrandCode: "SWIGGY",
    Discount: "3.00",
    BrandName: "Swiggy Food",
    Brandtype: "Variable",
    minPrice: 50,
    maxPrice: 2000,
    DenominationList: "50-2000",
    StockAvailable: 1,
    Category: "Food & Beverages",
    Description: "Order food from top restaurants on Swiggy.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
    },
  },
  {
    BrandCode: "ZOMATO",
    Discount: "2.50",
    BrandName: "Zomato",
    Brandtype: "Variable",
    minPrice: 50,
    maxPrice: 3000,
    DenominationList: "50-3000",
    StockAvailable: 1,
    Category: "Food & Beverages",
    Description: "Order food online via Zomato.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Zomato_logo.svg/1200px-Zomato_logo.svg.png",
    },
  },
  {
    BrandCode: "NYKAA",
    Discount: "7.00",
    BrandName: "Nykaa",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 5000,
    DenominationList: "100-5000",
    StockAvailable: 1,
    Category: "Beauty & Wellness",
    Description: "Buy cosmetics and beauty products.",
    Images: {
      thumbnail:
        "https://1000logos.net/wp-content/uploads/2021/05/Nykaa-logo.png",
    },
  },
  {
    BrandCode: "MyntraGFT",
    Discount: "6.00",
    BrandName: "Myntra",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 7000,
    DenominationList: "100-7000",
    StockAvailable: 1,
    Category: "Fashion",
    Description: "India’s fashion destination for men & women.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/0/0e/Myntra_logo.png",
    },
  },
  {
    BrandCode: "AjioIND",
    Discount: "8.00",
    BrandName: "Ajio",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 3000,
    DenominationList: "100-3000",
    StockAvailable: 1,
    Category: "Fashion",
    Description: "Shop trendy fashion on AJIO.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ajio-logo.png",
    },
  },
  {
    BrandCode: "TATACliq",
    Discount: "4.00",
    BrandName: "Tata Cliq",
    Brandtype: "Variable",
    minPrice: 200,
    maxPrice: 5000,
    DenominationList: "200-5000",
    StockAvailable: 1,
    Category: "E-Commerce",
    Description: "Premium online shopping by Tata.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/f/f0/Tata_Cliq_logo.png",
    },
  },
  {
    BrandCode: "BIGBAZAAR",
    Discount: "5.5",
    BrandName: "Big Bazaar",
    Brandtype: "Fixed",
    minPrice: 500,
    maxPrice: 500,
    DenominationList: "500",
    StockAvailable: 1,
    Category: "Retail",
    Description: "Shop groceries and essentials.",
    Images: {
      thumbnail:
        "https://1000logos.net/wp-content/uploads/2021/04/Big-Bazaar-logo.png",
    },
  },
  {
    BrandCode: "RELIANCETRENDS",
    Discount: "4.25",
    BrandName: "Reliance Trends",
    Brandtype: "Variable",
    minPrice: 250,
    maxPrice: 4000,
    DenominationList: "250-4000",
    StockAvailable: 1,
    Category: "Fashion",
    Description: "Fashion for everyone.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/7/73/Reliance_Trends.png",
    },
  },
  {
    BrandCode: "STARBUCKSIND",
    Discount: "3.50",
    BrandName: "Starbucks India",
    Brandtype: "Fixed",
    minPrice: 500,
    maxPrice: 500,
    DenominationList: "500",
    StockAvailable: 1,
    Category: "Food & Beverages",
    Description: "Premium coffee experience.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/sco/d/d3/Starbucks_Coffee_Logo.svg",
    },
  },
  {
    BrandCode: "DOMINOSIND",
    Discount: "4.00",
    BrandName: "Domino's Pizza",
    Brandtype: "Variable",
    minPrice: 50,
    maxPrice: 1500,
    DenominationList: "50-1500",
    StockAvailable: 1,
    Category: "Food & Beverages",
    Description: "Order delicious pizzas.",
    Images: {
      thumbnail:
        "https://1000logos.net/wp-content/uploads/2021/05/Dominos-logo.png",
    },
  },
  {
    BrandCode: "KFCIND",
    Discount: "3.50",
    BrandName: "KFC India",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 2000,
    DenominationList: "100-2000",
    StockAvailable: 1,
    Category: "Food & Beverages",
    Description: "Kentucky Fried Chicken India.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/b/bf/KFC_logo.svg",
    },
  },
  {
    BrandCode: "PEPPERFRY",
    Discount: "7.00",
    BrandName: "Pepperfry",
    Brandtype: "Variable",
    minPrice: 250,
    maxPrice: 10000,
    DenominationList: "250-10000",
    StockAvailable: 1,
    Category: "Furniture",
    Description: "Premium furniture store.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/d/d8/Pepperfry_Logo.png",
    },
  },
  {
    BrandCode: "URBANLADDER",
    Discount: "6.25",
    BrandName: "Urban Ladder",
    Brandtype: "Variable",
    minPrice: 500,
    maxPrice: 15000,
    DenominationList: "500-15000",
    StockAvailable: 1,
    Category: "Furniture",
    Description: "Modern home furniture.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/0/08/UrbanLadderLogo.png",
    },
  },
  {
    BrandCode: "PVR",
    Discount: "3.00",
    BrandName: "PVR Cinemas",
    Brandtype: "Fixed",
    minPrice: 500,
    maxPrice: 500,
    DenominationList: "500",
    StockAvailable: 1,
    Category: "Entertainment",
    Description: "Watch movies at PVR.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/2/25/PVR_Cinemas_logo.svg",
    },
  },
  {
    BrandCode: "BOOKMYSHOW",
    Discount: "2.00",
    BrandName: "BookMyShow",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 1000,
    DenominationList: "100-1000",
    StockAvailable: 1,
    Category: "Entertainment",
    Description: "Book event & movie tickets.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/BookMyShow_Logo.png/600px-BookMyShow_Logo.png",
    },
  },
  {
    BrandCode: "CLEARTRIP",
    Discount: "5.50",
    BrandName: "Cleartrip",
    Brandtype: "Variable",
    minPrice: 500,
    maxPrice: 15000,
    DenominationList: "500-15000",
    StockAvailable: 1,
    Category: "Travel",
    Description: "Book flights & hotels.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/1/1a/Cleartrip_logo.png",
    },
  },
  {
    BrandCode: "MAKEMYTRIP",
    Discount: "4.25",
    BrandName: "MakeMyTrip",
    Brandtype: "Variable",
    minPrice: 500,
    maxPrice: 20000,
    DenominationList: "500-20000",
    StockAvailable: 1,
    Category: "Travel",
    Description: "India’s #1 travel booking platform.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/MakeMyTrip_Logo.png",
    },
  },
  {
    BrandCode: "OLA",
    Discount: "3.75",
    BrandName: "OLA Cabs",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 2000,
    DenominationList: "100-2000",
    StockAvailable: 1,
    Category: "Travel",
    Description: "Ride anywhere with OLA.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/2/21/OLA_cabs_logo.png",
    },
  },
  {
    BrandCode: "UBERIND",
    Discount: "3.50",
    BrandName: "Uber India",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 3000,
    DenominationList: "100-3000",
    StockAvailable: 1,
    Category: "Travel",
    Description: "Book cabs via Uber.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    },
  },
  {
    BrandCode: "DECAT",
    Discount: "6.75",
    BrandName: "Decathlon",
    Brandtype: "Variable",
    minPrice: 100,
    maxPrice: 5000,
    DenominationList: "100-5000",
    StockAvailable: 1,
    Category: "Sports",
    Description: "Buy all sports items.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/2/2e/Decathlon_Logo.svg",
    },
  },
  {
    BrandCode: "CROMAIND",
    Discount: "5.25",
    BrandName: "Croma",
    Brandtype: "Variable",
    minPrice: 500,
    maxPrice: 15000,
    DenominationList: "500-15000",
    StockAvailable: 1,
    Category: "Electronics",
    Description: "Electronics shopping by Tata.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/7/7d/Croma-Logo.png",
    },
  },
  {
    BrandCode: "VIJAYSALES",
    Discount: "4.75",
    BrandName: "Vijay Sales",
    Brandtype: "Variable",
    minPrice: 500,
    maxPrice: 10000,
    DenominationList: "500-10000",
    StockAvailable: 1,
    Category: "Electronics",
    Description: "Electronics retail chain.",
    Images: {
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/d/d8/Vijay_Sales_logo.png",
    },
  },
  {
    "BrandCode": "BRAND_EXTRA_1",
    "Discount": "3.32",
    "BrandName": "Sample Brand Extra 1",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 1",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra1/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_2",
    "Discount": "3.46",
    "BrandName": "Sample Brand Extra 2",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Fashion",
    "Description": "Description for Sample Brand Extra 2",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra2/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_3",
    "Discount": "1.29",
    "BrandName": "Sample Brand Extra 3",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 3",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra3/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_4",
    "Discount": "2.82",
    "BrandName": "Sample Brand Extra 4",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Fashion",
    "Description": "Description for Sample Brand Extra 4",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra4/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_5",
    "Discount": "6.03",
    "BrandName": "Sample Brand Extra 5",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Retail",
    "Description": "Description for Sample Brand Extra 5",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra5/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_6",
    "Discount": "6.71",
    "BrandName": "Sample Brand Extra 6",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 6",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra6/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_7",
    "Discount": "6.28",
    "BrandName": "Sample Brand Extra 7",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Fashion",
    "Description": "Description for Sample Brand Extra 7",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra7/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_8",
    "Discount": "8.26",
    "BrandName": "Sample Brand Extra 8",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 8",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra8/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_9",
    "Discount": "3.43",
    "BrandName": "Sample Brand Extra 9",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 9",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra9/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_10",
    "Discount": "3.01",
    "BrandName": "Sample Brand Extra 10",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Fashion",
    "Description": "Description for Sample Brand Extra 10",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra10/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_11",
    "Discount": "7.03",
    "BrandName": "Sample Brand Extra 11",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 11",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra11/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_12",
    "Discount": "4.91",
    "BrandName": "Sample Brand Extra 12",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "E-Commerce",
    "Description": "Description for Sample Brand Extra 12",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra12/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_13",
    "Discount": "3.11",
    "BrandName": "Sample Brand Extra 13",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Electronics",
    "Description": "Description for Sample Brand Extra 13",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra13/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_14",
    "Discount": "8.34",
    "BrandName": "Sample Brand Extra 14",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Retail",
    "Description": "Description for Sample Brand Extra 14",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra14/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_15",
    "Discount": "5.95",
    "BrandName": "Sample Brand Extra 15",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Sports",
    "Description": "Description for Sample Brand Extra 15",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra15/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_16",
    "Discount": "2.72",
    "BrandName": "Sample Brand Extra 16",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 16",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra16/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_17",
    "Discount": "6.87",
    "BrandName": "Sample Brand Extra 17",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Electronics",
    "Description": "Description for Sample Brand Extra 17",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra17/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_18",
    "Discount": "2.52",
    "BrandName": "Sample Brand Extra 18",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 18",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra18/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_19",
    "Discount": "6.86",
    "BrandName": "Sample Brand Extra 19",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Electronics",
    "Description": "Description for Sample Brand Extra 19",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra19/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_20",
    "Discount": "8.1",
    "BrandName": "Sample Brand Extra 20",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 20",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra20/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_21",
    "Discount": "4.39",
    "BrandName": "Sample Brand Extra 21",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 21",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra21/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_22",
    "Discount": "3.33",
    "BrandName": "Sample Brand Extra 22",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "E-Commerce",
    "Description": "Description for Sample Brand Extra 22",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra22/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_23",
    "Discount": "6.27",
    "BrandName": "Sample Brand Extra 23",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Electronics",
    "Description": "Description for Sample Brand Extra 23",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra23/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_24",
    "Discount": "4.66",
    "BrandName": "Sample Brand Extra 24",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 24",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra24/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_25",
    "Discount": "5.01",
    "BrandName": "Sample Brand Extra 25",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 25",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra25/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_26",
    "Discount": "1.78",
    "BrandName": "Sample Brand Extra 26",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 26",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra26/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_27",
    "Discount": "8.38",
    "BrandName": "Sample Brand Extra 27",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Retail",
    "Description": "Description for Sample Brand Extra 27",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra27/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_28",
    "Discount": "8.2",
    "BrandName": "Sample Brand Extra 28",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 28",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra28/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_29",
    "Discount": "4.0",
    "BrandName": "Sample Brand Extra 29",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 29",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra29/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_30",
    "Discount": "2.07",
    "BrandName": "Sample Brand Extra 30",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Sports",
    "Description": "Description for Sample Brand Extra 30",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra30/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_31",
    "Discount": "5.78",
    "BrandName": "Sample Brand Extra 31",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Sports",
    "Description": "Description for Sample Brand Extra 31",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra31/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_32",
    "Discount": "7.87",
    "BrandName": "Sample Brand Extra 32",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Retail",
    "Description": "Description for Sample Brand Extra 32",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra32/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_33",
    "Discount": "2.28",
    "BrandName": "Sample Brand Extra 33",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Fashion",
    "Description": "Description for Sample Brand Extra 33",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra33/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_34",
    "Discount": "8.5",
    "BrandName": "Sample Brand Extra 34",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 34",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra34/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_35",
    "Discount": "2.66",
    "BrandName": "Sample Brand Extra 35",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 35",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra35/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_36",
    "Discount": "3.46",
    "BrandName": "Sample Brand Extra 36",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 36",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra36/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_37",
    "Discount": "6.92",
    "BrandName": "Sample Brand Extra 37",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 37",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra37/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_38",
    "Discount": "7.47",
    "BrandName": "Sample Brand Extra 38",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 38",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra38/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_39",
    "Discount": "4.38",
    "BrandName": "Sample Brand Extra 39",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 39",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra39/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_40",
    "Discount": "3.76",
    "BrandName": "Sample Brand Extra 40",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Sports",
    "Description": "Description for Sample Brand Extra 40",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra40/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_41",
    "Discount": "6.57",
    "BrandName": "Sample Brand Extra 41",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Fashion",
    "Description": "Description for Sample Brand Extra 41",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra41/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_42",
    "Discount": "5.98",
    "BrandName": "Sample Brand Extra 42",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "E-Commerce",
    "Description": "Description for Sample Brand Extra 42",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra42/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_43",
    "Discount": "3.96",
    "BrandName": "Sample Brand Extra 43",
    "Brandtype": "Variable",
    "minPrice": 100,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 43",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra43/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_44",
    "Discount": "5.92",
    "BrandName": "Sample Brand Extra 44",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Sports",
    "Description": "Description for Sample Brand Extra 44",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra44/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_45",
    "Discount": "4.61",
    "BrandName": "Sample Brand Extra 45",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Electronics",
    "Description": "Description for Sample Brand Extra 45",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra45/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_46",
    "Discount": "7.02",
    "BrandName": "Sample Brand Extra 46",
    "Brandtype": "Fixed",
    "minPrice": 100,
    "maxPrice": 3000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 46",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra46/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_47",
    "Discount": "7.57",
    "BrandName": "Sample Brand Extra 47",
    "Brandtype": "Variable",
    "minPrice": 200,
    "maxPrice": 10000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Travel",
    "Description": "Description for Sample Brand Extra 47",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra47/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_48",
    "Discount": "7.17",
    "BrandName": "Sample Brand Extra 48",
    "Brandtype": "Fixed",
    "minPrice": 50,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Food & Beverages",
    "Description": "Description for Sample Brand Extra 48",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra48/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_49",
    "Discount": "1.09",
    "BrandName": "Sample Brand Extra 49",
    "Brandtype": "Variable",
    "minPrice": 50,
    "maxPrice": 5000,
    "DenominationList": "50-10000",
    "StockAvailable": 0,
    "Category": "E-Commerce",
    "Description": "Description for Sample Brand Extra 49",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra49/200/200"
    }
  },
  {
    "BrandCode": "BRAND_EXTRA_50",
    "Discount": "1.69",
    "BrandName": "Sample Brand Extra 50",
    "Brandtype": "Fixed",
    "minPrice": 200,
    "maxPrice": 1000,
    "DenominationList": "50-10000",
    "StockAvailable": 1,
    "Category": "Entertainment",
    "Description": "Description for Sample Brand Extra 50",
    "Images": {
      "thumbnail": "https://picsum.photos/seed/extra50/200/200"
    }
  }
];
