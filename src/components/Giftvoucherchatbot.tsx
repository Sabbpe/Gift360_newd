import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2, Bot, AlertCircle, CheckCircle, Package, CreditCard, RotateCcw, Phone, Mail, HelpCircle } from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    suggestedActions?: string[];
    isTyping?: boolean;
}

interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved';
    createdAt: Date;
    category: string;
    email?: string;
    phone?: string;
}

const GiftVoucherChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [conversationContext, setConversationContext] = useState<string[]>([]);
    const [ticketData, setTicketData] = useState({
        subject: '',
        description: '',
        email: '',
        phone: '',
        category: 'general'
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                type: 'bot',
                content: `👋 **Welcome to Gift360 Support!**

I'm here to help you with everything related to gift vouchers!

🎁 **I can help you with:**
• Redeeming gift vouchers
• Checking balance & validity
• Brand information & availability
• Corporate bulk orders
• Troubleshooting issues

**Ask me anything!** For example:
"What brands are available?"
"How do I redeem a voucher?"
"Do you have Amazon vouchers?"`,
                timestamp: new Date(),
                suggestedActions: [
                    'What brands are available?',
                    'How to redeem vouchers?',
                    'Check balance',
                    'Corporate orders'
                ]
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen]);

    const handleSendMessage = async (messageText?: string) => {
        const text = messageText || inputValue.trim();
        if (!text || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setConversationContext(prev => [...prev.slice(-9), text]);

        const typingMessage: Message = {
            id: 'typing',
            type: 'bot',
            content: '',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);
        setIsLoading(true);

        // Simulate thinking time for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const response = getIntelligentResponse(text, conversationContext);

            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== 'typing');
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        type: 'bot',
                        content: response.content,
                        timestamp: new Date(),
                        suggestedActions: response.actions
                    }
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getIntelligentResponse = (query: string, _context: string[]): { content: string; actions: string[] } => {
        const q = query.toLowerCase();

        // View/Access purchased vouchers
        if (q.includes('see') && (q.includes('voucher') || q.includes('card')) && (q.includes('purchase') || q.includes('bought') || q.includes('my')) ||
            q.includes('view') && (q.includes('voucher') || q.includes('order')) ||
            q.includes('access') && q.includes('voucher') ||
            q.includes('where') && q.includes('voucher') ||
            q.includes('find my') && q.includes('voucher')) {
            return {
                content: `**How to View Your Purchased Gift Vouchers:**

**📱 Method 1: SabbPe App (Recommended)**
1. Open SabbPe mobile app
2. Log in with your credentials
3. Tap on **"My Vouchers"** in the menu
4. You'll see all your purchased vouchers with:
   • Voucher details (brand, denomination)
   • Card number and PIN
   • Expiry date
   • Current balance
   • Purchase date

**💻 Method 2: SabbPe Website**
1. Visit www.gift360.io
2. Log in to your account
3. Go to **"My Account"** → **"My Vouchers"**
4. View complete voucher history
5. Download vouchers as PDF
6. Check balance and validity

**📧 Method 3: Email**
Digital vouchers are sent to your registered email:
• Check inbox for "Gift Voucher Purchase"
• Look in spam/junk folder if not found
• Each voucher email contains:
  - Card number
  - PIN
  - Redemption instructions
  - Validity date

**📦 Method 4: Physical Cards**
If you ordered physical cards:
• Track shipment in your account
• Cards arrive in 2-3 business days
• All details printed on the card

**💡 Pro Tips:**
• Save voucher screenshots for offline access
• Add cards to brand apps/wallets
• Set reminders for expiry dates
• Keep purchase emails safe

**Can't Find Your Vouchers?**
Possible reasons:
• Check if using correct email/account
• Order may still be processing (wait 5-10 minutes)
• Payment might have failed
• Wrong account logged in

**Need Help?**
If you still can't see your vouchers:
📧 Email: support@gift360.io (with order ID)
📞 Phone: +91-9876543210
💬 WhatsApp: +91-9876543210

We can resend vouchers or check order status!`,
                actions: ['Check balance', 'Redeem voucher', 'Order not showing?', 'Create support ticket']
            };
        }

        // Brand availability queries
        if (q.includes('brand') || q.includes('available') || q.includes('which') && (q.includes('voucher') || q.includes('card'))) {
            return {
                content: `**Available Brands on Gift360:**

We offer gift vouchers for **500+ brands** across multiple categories:

**🛒 E-Commerce:**
• Amazon, Flipkart, Myntra, Ajio, Nykaa

**👔 Fashion & Lifestyle:**
• Lifestyle, Pantaloons, Westside, Max Fashion, Shoppers Stop

**🍕 Food & Dining:**
• Dominos, Swiggy, Zomato, Cafe Coffee Day, Barbeque Nation, KFC, McDonald's

**📱 Electronics:**
• Croma, Reliance Digital, Vijay Sales

**🛒 Groceries:**
• BigBasket, DMart Ready, Spencer's

**💄 Beauty & Wellness:**
• Nykaa, Purplle, Lakme Salon

**🎬 Entertainment:**
• BookMyShow, PVR Cinemas, INOX

**✈️ Travel:**
• MakeMyTrip, Cleartrip, Yatra, OYO

**And many more!**

Would you like information about any specific brand or category?`,
                actions: ['Amazon vouchers', 'Flipkart details', 'Fashion brands', 'Corporate orders']
            };
        }

        // Amazon specific
        if (q.includes('amazon')) {
            return {
                content: `**Amazon Gift Vouchers on Gift360:**

**Available Variants:**
• Amazon Pay
• Amazon Shopping Vouchers
• Amazon Prime subscriptions (3M-12M)

**Denominations:** ₹250, ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000

**⚠️ Important Restrictions:**
• **Monthly Limit:** ₹20,000 per customer (tracked by card + mobile number)
• **Payment Mode:** UPI only for Amazon Pay & Shopping
• **Discounts:** Cannot offer discounts to end customers
• **Approval Required:** Prior approval needed from Amazon

**For Corporate Orders:**
Contact our B2B team for approval process:
📧 B2B@gift360.io
📞 +91-8765432109
⏱️ Approval timeline: 24-48 hours

**Redemption:** Use at Amazon.in for any products, instant delivery in 5 minutes!`,
                actions: ['How to redeem?', 'Other brands', 'Corporate orders', 'Check balance']
            };
        }

        // Flipkart specific
        if (q.includes('flipkart')) {
            return {
                content: `**Flipkart Gift Vouchers:**

**Available Denominations:** ₹250, ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000

**⚠️ Important Restrictions:**
• **Monthly Limit:** ₹1,00,000 per customer (card + mobile number)
• **Discounts:** Cannot offer discounts to end customers (face value only)
• **Approval Required:** Prior approval needed from Flipkart

**For Bulk/Corporate Orders:**
📧 B2B@gift360.io
📞 +91-8765432109

**Features:**
✓ Instant digital delivery
✓ Valid for 12 months
✓ Use on Flipkart.com or app
✓ No minimum purchase required

${q.includes('discount') ? '\n**Note:** Flipkart vouchers cannot be discounted due to brand policy.' : ''}`,
                actions: ['Redemption process', 'Available brands', 'Corporate quote', 'Balance check']
            };
        }

        // Reliance brands
        if (q.includes('reliance')) {
            return {
                content: `**Reliance Brand Vouchers:**

We offer vouchers for **ALL Reliance brands:**
• Reliance Digital
• Reliance Jewels
• Reliance JioMart
• Reliance My Jio Store
• Reliance Smart
• Reliance Smart Point
• Reliance Trends
• Reliance Trends Footwear

**⚠️ IMPORTANT - Shared Limit:**
All Reliance brands share a **combined monthly limit of ₹25,000 per customer** (card + mobile number).

**Example:** If you buy ₹10,000 of Reliance Digital, you have only ₹15,000 left for ALL other Reliance brands that month.

**Requirements:**
• Prior approval from Reliance required
• Approval timeline: 24-48 hours
• Contact B2B team: B2B@gift360.io | +91-8765432109

**Denominations:** Varies by brand, typically ₹500 to ₹10,000`,
                actions: ['How does shared limit work?', 'Other brands', 'Get approval', 'Corporate orders']
            };
        }

        // Tata Cliq
        if (q.includes('tata') || q.includes('cliq')) {
            return {
                content: `**Tata Cliq Gift Vouchers:**

**Denominations:** ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000

**⚠️ Important Info:**
• **Monthly Limit:** ₹20,000 per customer (card + mobile number)
• **Approval Required:** Prior approval needed from Tata
• Approval timeline: 24-48 hours

**For Corporate Orders:**
📧 B2B@gift360.io
📞 +91-8765432109

**Features:**
✓ Use on TataCliq.com or app
✓ Wide range of products
✓ Fashion, electronics, home & more
✓ Valid for 12 months`,
                actions: ['Redemption guide', 'Available brands', 'Corporate orders', 'Balance check']
            };
        }

        // Redemption queries
        if (q.includes('redeem') || q.includes('use') || q.includes('how to')) {
            return {
                content: `**How to Redeem Your Gift Voucher:**

**📱 Online Redemption:**
1. Visit the brand's website or app
2. Shop and add products to cart
3. Go to checkout/payment page
4. Select "Gift Card/Voucher" as payment method
5. Enter your 16-digit card number and PIN
6. Apply and complete your purchase

**🏪 In-Store Redemption:**
1. Visit any brand store
2. Shop for products
3. At checkout, present your gift card
4. Provide mobile number for verification
5. Card will be swiped/scanned
6. Remaining balance stays on card

**💡 Pro Tips:**
• You can use the card multiple times until balance is zero
• Check balance before shopping
• Keep PIN secure
• Take screenshot of digital cards

**Need Help?**
If redemption fails, common issues are:
• Expired card (check validity)
• Incorrect PIN/card number
• Brand-specific restrictions

Would you like troubleshooting help?`,
                actions: ['Check balance', 'Redemption failed?', 'Find stores', 'Available brands']
            };
        }

        // Balance check
        if (q.includes('balance') || q.includes('check') || q.includes('remaining')) {
            return {
                content: `**Check Your Voucher Balance:**

**Method 1: SabbPe App/Website**
• Log in to your SabbPe account
• Go to "My Vouchers" section
• Select your voucher
• Balance displayed in real-time

**Method 2: Brand Website**
• Visit brand's official website
• Look for "Check Gift Card Balance"
• Enter card number and PIN
• View current balance

**Method 3: Brand Customer Care**
• Call brand's helpline
• Provide card details
• Get balance over phone

**Method 4: During Purchase**
• Your balance shows at checkout
• When you apply the gift card

**⏱️ Balance Update Time:**
After redemption, balance typically updates within 2-3 hours.

**Having Issues?**
If balance doesn't update or shows incorrect:
• Wait 2-3 hours after use
• Clear browser cache
• Try different device
• Contact brand support
• Create support ticket with us`,
                actions: ['Redeem voucher', 'Balance not updated?', 'Purchase more', 'Available brands']
            };
        }

        // Corporate/Bulk orders
        if (q.includes('corporate') || q.includes('bulk') || q.includes('business') || q.includes('b2b') || q.includes('company')) {
            return {
                content: `**Corporate Gift Voucher Solutions:**

**What We Offer:**
🎁 Bulk gift vouchers with volume discounts
🏷️ Custom branding with your company logo
📦 Flexible denomination options
💼 Employee rewards & recognition programs
🤝 Channel partner incentives
🎊 Festival & occasion gifting

**Process:**
1. **Contact B2B Team:**
   📧 B2B@gift360.io
   📞 +91-8765432109

2. **Share Requirements:**
   • Brands needed
   • Quantity
   • Denominations
   • Custom branding needs

3. **Get Quote:**
   • Volume discounts applied
   • Pricing & payment terms
   • Timeline discussed

4. **Approval & Order:**
   • Brand approval obtained (24-48 hrs)
   • Purchase order processed
   • Custom design approved

5. **Delivery:**
   • Digital: Instant to 24 hours
   • Physical: 5-7 business days
   • Tracking portal provided

**Benefits:**
✓ Dedicated account manager
✓ Flexible payment terms
✓ GST invoicing
✓ Recipient tracking
✓ Post-delivery support

**Minimum Order:**
Varies by brand, typically 50+ vouchers

Ready to get started?`,
                actions: ['Get quote', 'Custom branding', 'Available brands', 'Payment terms']
            };
        }

        // Troubleshooting
        if (q.includes('issue') || q.includes('problem') || q.includes('not working') || q.includes('error') || q.includes('failed')) {
            return {
                content: `**Troubleshooting Common Issues:**

**❌ Redemption Failed:**
• Verify card number (16 digits, no spaces)
• Check PIN is correct
• Ensure card hasn't expired
• Check if you have sufficient balance
• Try different browser/device
• Clear browser cache/cookies

**❌ Card Not Received:**
• Check spam/junk folder (for digital cards)
• Wait 5-10 minutes for email delivery
• Verify email address entered correctly
• Check order status in SabbPe account
• Contact us with transaction ID

**❌ Balance Not Updated:**
• Wait 2-3 hours after redemption
• Check on brand's website directly
• Verify transaction was successful
• Keep transaction receipt
• Contact brand customer care

**❌ Invalid Card Error:**
• Card may be expired (check validity)
• Incorrect card number/PIN
• Card not activated yet
• Brand-specific restrictions apply
• Region/store limitations

**❌ Payment Failed During Purchase:**
• Check bank/card limits
• Verify OTP correctly
• Try different payment method
• Contact your bank
• Check internet connection

**Still Having Issues?**
Create a support ticket and our team will help resolve within 4-6 hours!`,
                actions: ['Create support ticket', 'Check balance', 'Contact support', 'Try redemption again']
            };
        }

        // Lost/Stolen card
        if (q.includes('lost') || q.includes('stolen') || q.includes('missing')) {
            return {
                content: `**Lost or Stolen Gift Card:**

**⚠️ Immediate Action Required:**

1. **Report Immediately:**
   📧 support@gift360.io
   📞 +91-9876543210
   💬 WhatsApp: +91-9876543210

2. **Information Needed:**
   • Your registered email/mobile
   • Card number (if known)
   • Purchase date & order ID
   • Approximate remaining balance

3. **Card Will Be Blocked:**
   • We'll block the card within 2 hours
   • Prevents unauthorized use
   • Balance protected if reported within 24 hours

**Replacement Process:**

**For Digital Cards:**
• Free re-issue to your email
• Same card number, new PIN
• Usually within 24 hours

**For Physical Cards:**
• ₹99 replacement fee
• New card with same balance
• Delivery in 2-3 business days

**Protection Tips:**
✓ Save card details securely
✓ Take screenshot of digital cards
✓ Register card on brand website
✓ Add to SabbPe app wallet
✓ Note card number separately

**Important:** Report within 24 hours for full balance protection!`,
                actions: ['Report now', 'Create support ticket', 'Check balance', 'Security tips']
            };
        }

        // Refund/Cancellation
        if (q.includes('refund') || q.includes('cancel') || q.includes('return')) {
            return {
                content: `**Refund & Cancellation Policy:**

**✅ Eligible for Cancellation:**

**Digital Vouchers:**
• Cancel within 24 hours of purchase
• Card must not be accessed/used
• Full refund processed

**Physical Cards:**
• Cancel before dispatch
• Return unopened cards within 48 hours of delivery
• Shipping charges may apply

**🔄 Refund Process:**
1. Email: support@gift360.io
2. Provide order ID and reason
3. Include proof if card is damaged/defective
4. Our team reviews within 24 hours
5. Refund processed in 5-7 business days
6. Refunded to original payment method

**❌ NOT Eligible for Refund:**
• Used/activated cards (even partially)
• Cards accessed or PIN revealed
• After 24 hours (digital) or 48 hours (physical)
• Expired cards
• Lost cards (replacement available)

**Special Cases:**
• Damaged cards: Replacement provided
• Wrong denomination: Exchange possible
• Technical issues: Case-by-case basis

**Need to Request Refund?**
Create a support ticket with:
• Order ID
• Reason for refund
• Any supporting documents`,
                actions: ['Create support ticket', 'Exchange policy', 'Purchase new', 'Contact support']
            };
        }

        // Expiry/Validity
        if (q.includes('expiry') || q.includes('validity') || q.includes('expire') || q.includes('valid')) {
            return {
                content: `**Gift Voucher Validity & Expiry:**

**Standard Validity:**
• Most vouchers: **6-12 months** from purchase date
• Brand-specific validity varies
• Exact date printed on card
• Digital cards show expiry in app

**Check Your Card's Expiry:**
• Look on physical card (printed)
• Check email with digital card
• View in SabbPe app
• Contact brand customer care

**Before Expiry:**
✓ Use full or partial amount
✓ Can redeem multiple times
✓ Balance carries forward
✓ No extension available

**After Expiry:**
❌ Card becomes invalid
❌ Cannot redeem or extend
❌ Balance is forfeited
❌ No refund available

**💡 Pro Tips:**
• Set phone reminder 1 month before expiry
• Use high-value cards first
• Check balance periodically
• Plan purchases ahead of expiry
• Gift unused cards to family/friends

**Typical Validity by Brand:**
• Amazon, Flipkart: 12 months
• Fashion brands: 12 months
• Food vouchers: 6-12 months
• Entertainment: 12 months

**Card About to Expire?**
Use it now or gift it to someone!`,
                actions: ['Check balance', 'Redeem now', 'Available brands', 'Purchase new']
            };
        }

        // About SabbPe / Platform
        if (q.includes('gift360') || q.includes('what') && q.includes('platform') || q.includes('about') || q.includes('how') && q.includes('work')) {
            return {
                content: `**About Gift360 Voucher Platform:**

**Who We Are:**
Gift360 is India's leading **B2B gift voucher aggregator platform** connecting businesses with 500+ top brands.

**What We Do:**
🎁 Provide gift vouchers for 500+ brands
💼 Serve corporate clients across India
🏆 Enable employee rewards programs
🤝 Support channel partner incentives
🎊 Facilitate bulk gifting solutions

**Why Choose Gift360:**

**For Businesses:**
✓ Single platform for all brands
✓ Volume discounts on bulk orders
✓ Custom branding available
✓ Flexible payment terms
✓ GST invoicing
✓ Dedicated account manager
✓ Centralized tracking & reporting

**For End Users:**
✓ 500+ brands to choose from
✓ Instant digital delivery (5 min)
✓ Physical cards (2-3 days)
✓ Easy redemption process
✓ 24/7 customer support
✓ Secure & reliable

**How It Works:**
1. Browse 500+ brands
2. Select denomination
3. Make secure payment
4. Receive voucher instantly/by mail
5. Redeem online or in-store

**Categories:**
E-commerce, Fashion, Food, Electronics, Groceries, Beauty, Entertainment, Travel, and more!

**Contact:**
📧 support@gift360.io
📞 +91-9876543210 (Customer support)
💼 B2B@gift360.io (Corporate sales)`,
                actions: ['Browse brands', 'Corporate solutions', 'How to redeem?', 'Purchase vouchers']
            };
        }

        // Discount queries
        if (q.includes('discount') || q.includes('offer') || q.includes('cheaper')) {
            return {
                content: `**Gift Voucher Pricing & Discounts:**

**Standard Pricing:**
Most vouchers are sold at **face value** (no discount for end customers).

**⚠️ Brand Restrictions:**
Some premium brands **cannot offer discounts** due to brand policies:
• Amazon (except via UPI binding)
• Flipkart
• And selected others

**Where Discounts ARE Available:**
• **Corporate bulk orders:** Volume discounts apply
• **Seasonal promotions:** Special offers during festivals
• **First-time users:** Welcome offers sometimes available
• **Loyalty programs:** Rewards for repeat customers

**For Corporate Clients:**
📧 Contact B2B@gift360.io for:
• Volume discount quotes
• Flexible payment terms
• Custom pricing for large orders
• Long-term partnership benefits

**Current Promotions:**
Check our website or app for latest offers!

**Note:** Voucher denomination = redemption value
Example: ₹1,000 voucher = ₹1,000 shopping value`,
                actions: ['Corporate quote', 'Available brands', 'Browse offers', 'Purchase vouchers']
            };
        }

        // Payment queries
        if (q.includes('payment') || q.includes('pay') || q.includes('how to buy')) {
            return {
                content: `**Payment Methods & Purchase Process:**

**Accepted Payment Methods:**
💳 **Credit/Debit Cards**
• Visa, Mastercard, RuPay
• Domestic & International cards

📱 **UPI**
• Google Pay, PhonePe, Paytm
• Any UPI app
• **Required for Amazon vouchers**

🏦 **Net Banking**
• All major banks supported

💰 **Wallets**
• Paytm, Mobikwik, etc.

💼 **For Corporate:**
• Bank transfer (NEFT/RTGS)
• Cheque
• Credit terms (for approved accounts)

**How to Purchase:**

**For Individual Orders:**
1. Visit Gift360 website/app
2. Browse brands
3. Select denomination
4. Add to cart
5. Enter details & choose payment
6. Complete payment securely
7. Receive voucher instantly!

**For Bulk/Corporate Orders:**
1. Contact B2B team
2. Share requirements
3. Get quote with payment terms
4. Raise PO
5. Make payment
6. Receive vouchers

**Security:**
✓ 256-bit SSL encryption
✓ PCI DSS compliant
✓ Secure payment gateway
✓ No card details stored

**Payment Issues?**
• Check bank limits
• Verify OTP
• Try different method
• Contact your bank
• Reach out to us: support@gift360.io`,
                actions: ['Purchase now', 'Corporate orders', 'Available brands', 'Security info']
            };
        }

        // Gifting to someone else
        if (q.includes('gift') && (q.includes('someone') || q.includes('friend') || q.includes('send') || q.includes('transfer')) ||
            q.includes('send') && q.includes('voucher') ||
            q.includes('give') && q.includes('card')) {
            return {
                content: `**Gifting Vouchers to Someone Else:**

**🎁 For Digital Vouchers:**

**Method 1: Forward Email**
1. Purchase voucher in your name
2. Receive it in your email
3. Forward the email to gift recipient
4. They can use card number & PIN to redeem

**Method 2: Screenshot/Share**
1. Take screenshot of voucher details
2. Send via WhatsApp/SMS/email
3. Include: Card number, PIN, expiry date
4. Add redemption instructions

**Method 3: Purchase on Their Email**
During checkout:
• Enter recipient's email address
• Add personalized message (if available)
• They receive it directly
• You get order confirmation

**For Physical Cards:**
1. Order physical card
2. Provide recipient's delivery address
3. Include gift message (if available)
4. Card delivered to their address
5. Comes in presentable packaging

**💼 Corporate Gifting:**
For bulk gifting to employees/clients:
📧 B2B@gift360.io
📞 +91-8765432109

Options include:
• Customized cards with company logo
• Personalized messages
• Bulk delivery
• Digital distribution platform
• Tracking & reporting

**🎉 Best Practices:**
✓ Include redemption instructions
✓ Mention expiry date
✓ Suggest brands to try
✓ Keep purchase receipt (for issues)
✓ Send gift message separately

**⚠️ Important:**
• Vouchers are non-transferable after redemption
• Once used, can't be gifted
• Unused vouchers can be freely shared
• Keep transaction records for disputes

**Special Occasions:**
Consider packaging for:
• Birthdays, anniversaries
• Festival greetings
• Employee rewards
• Client appreciation
• Congratulations gifts`,
                actions: ['Purchase vouchers', 'Corporate gifting', 'Available brands', 'Packaging options']
            };
        }

        // Card activation
        if (q.includes('activate') || q.includes('activation') ||
            q.includes('how to use') && q.includes('card') ||
            q.includes('start using')) {
            return {
                content: `**Gift Voucher Activation:**

**✅ Good News - No Activation Required!**

Most gift vouchers on Gift360 are **pre-activated** and ready to use immediately upon receipt!

**For Digital Vouchers:**
• Activated as soon as you receive the email
• Just note down card number and PIN
• Start using right away
• No registration needed

**For Physical Cards:**
• Activated before shipment
• Ready to use when you receive it
• Check for activation sticker
• If scratch card, reveal PIN by scratching

**🎯 How to Start Using:**

**Step 1: Check Details**
• 16-digit card number
• 4-6 digit PIN
• Expiry date
• Brand name

**Step 2: First Use**
• Online: Enter details at checkout
• In-store: Present card to cashier
• App: Add to brand's app wallet

**Step 3: Verify Balance**
After first use, always:
• Check remaining balance
• Save transaction receipts
• Note expiry date

**⚠️ If Card Doesn't Work:**

Possible reasons:
1. **Not activated yet**
   • Physical cards: Wait 2-3 hours after receiving
   • Contact support if still doesn't work

2. **Wrong details entered**
   • Verify card number (no spaces)
   • Check PIN carefully (case sensitive sometimes)

3. **Already used/expired**
   • Check with seller
   • Verify purchase date

4. **Technical issue**
   • Try different browser/device
   • Clear cache and cookies
   • Contact brand customer care

**Need Activation Help?**
📧 support@gift360.io
📞 +91-9876543210

Include:
• Order ID
• Card number (last 4 digits)
• Purchase date
• Error message (if any)

**Pro Tip:** 
Take a photo of your card immediately after receiving for future reference!`,
                actions: ['How to redeem?', 'Check balance', 'Troubleshooting', 'Contact support']
            };
        }

        // Multiple cards/combining
        if (q.includes('multiple') && q.includes('card') ||
            q.includes('combine') || q.includes('merge') ||
            q.includes('two card') || q.includes('more than one')) {
            return {
                content: `**Using Multiple Gift Cards:**

**✅ Can I Use Multiple Cards Together?**

**It Depends on the Brand:**

**Brands That ALLOW Multiple Cards:**
Most brands let you use 2-3 cards per transaction:
• Amazon: Up to 3 gift cards + another payment
• Flipkart: Multiple cards allowed
• Lifestyle: Usually 2-3 cards
• Many e-commerce sites

**How to Use Multiple Cards:**

**Online Shopping:**
1. Add products to cart
2. Go to checkout
3. Select "Gift Card" payment
4. Enter first card: Number + PIN
5. Apply - shows remaining amount
6. Add second card details
7. Repeat for third card
8. Pay any remaining balance with card/UPI

**Example:**
• Cart total: ₹5,000
• Card 1: ₹2,000 → Balance: ₹3,000
• Card 2: ₹2,000 → Balance: ₹1,000
• Pay ₹1,000 with credit card

**In-Store:**
1. Present all cards to cashier
2. They'll process each card
3. Usually 2-3 cards maximum
4. Pay remaining with cash/card

**❌ What You CANNOT Do:**

**Combine/Merge Cards:**
• Can't transfer balance from one card to another
• Can't merge 3 cards of ₹500 into one ₹1,500 card
• Each card remains separate
• Must use individually or together per transaction

**Transfer to Another Person:**
• Once partially used, can't split balance
• If unused, can gift entire card
• No partial transfers allowed

**Convert to Cash:**
• Gift cards can't be redeemed for cash
• No refunds for unused balance
• Must use for purchases only

**💡 Smart Strategies:**

**Use Larger Values First:**
• Use ₹2,000 cards before ₹500 cards
• Easier to track fewer cards
• Less chance of losing small balance

**Note Remaining Balances:**
• After each use, note balance
• Keep all cards organized
• Set reminders for small balances

**Use Before Expiry:**
• Cards with earlier expiry first
• Combine purchases when possible
• Don't let small balances expire

**Brand-Specific Rules:**
Some brands have specific limits:
• Maximum 3 cards per transaction
• Minimum purchase amount required
• Cannot use gift cards for gift cards

**Need Help?**
Unclear about a specific brand's policy?`,
                actions: ['Check balance', 'Available brands', 'How to redeem?', 'Contact support']
            };
        }

        // Order tracking/history
        if (q.includes('order') && (q.includes('track') || q.includes('status') || q.includes('history') || q.includes('where')) ||
            q.includes('delivery') && q.includes('status') ||
            q.includes('when') && q.includes('receive')) {
            return {
                content: `**Track Your Order & View History:**

**📦 Order Tracking:**

**For Digital Vouchers:**
• Delivery time: **5-10 minutes** after payment
• Check your registered email
• Also available in SabbPe app immediately
• Look in spam folder if not found

**For Physical Cards:**
• Delivery time: **2-3 business days**
• Track via:
  1. Gift360 app → "My Orders"
  2. Email tracking link
  3. SMS updates to registered mobile

**📋 View Order History:**

**In App/Website:**
1. Log in to Gift360 account
2. Go to **"My Orders"** or **"Order History"**
3. See all past purchases with:
   • Order ID
   • Purchase date
   • Brand & denomination
   • Amount paid
   • Delivery status
   • Download invoice

**Order Status Meanings:**
• **Processing** - Payment confirmed, preparing voucher
• **Completed** - Voucher delivered/available
• **In Transit** - Physical card shipped
• **Delivered** - Physical card delivered
• **Failed** - Payment/order issue (contact support)

**Download Invoices:**
• Click on any order
• Select "Download Invoice"
• GST invoices for corporate orders
• Keep for records

**Haven't Received Your Order?**

**Digital Vouchers (>10 minutes):**
1. Check spam/junk folder
2. Verify email address in account
3. Check "My Vouchers" in app
4. Contact support with order ID

**Physical Cards (>4 days):**
1. Check tracking status
2. Verify delivery address
3. Check with building security
4. Contact courier company
5. Reach out to our support

**Need Help?**
📧 support@gift360.io (include order ID)
📞 +91-9876543210
💬 WhatsApp: +91-9876543210

**Order ID Format:** Usually like ORD-123456789`,
                actions: ['View my vouchers', 'Check balance', 'Download invoice', 'Create support ticket']
            };
        }

        // Default response for unmatched queries
        return {
            content: `I'd be happy to help you with that!

Based on your question, here are some topics I can assist you with:

**Popular Topics:**
• **Available Brands** - 500+ brands including Amazon, Flipkart, fashion, food & more
• **How to Redeem** - Step-by-step redemption guide
• **Check Balance** - Multiple ways to check your voucher balance
• **Corporate Orders** - Bulk purchases with custom branding
• **Troubleshooting** - Help with common issues
• **About SabbPe** - Our platform and services

**Quick Actions:**
• Create support ticket for complex issues
• Talk to our team: support@gift360.io | +91-9876543210

Could you please clarify what you'd like to know? Or choose one of the suggested topics below!`,
            actions: ['Available brands', 'How to redeem?', 'Check balance', 'Corporate orders', 'Create ticket']
        };
    };

    const handleSuggestedAction = (action: string) => {
        handleSendMessage(action);
    };

    const handleCreateTicket = async () => {
        if (!ticketData.subject || !ticketData.description || !ticketData.email) {
            alert('Please fill in all required fields (Subject, Description, Email)');
            return;
        }

        const ticket: SupportTicket = {
            id: `TICKET-${Date.now()}`,
            subject: ticketData.subject,
            description: ticketData.description,
            status: 'open',
            createdAt: new Date(),
            category: ticketData.category,
            email: ticketData.email,
            phone: ticketData.phone
        };

        console.log('Creating support ticket:', ticket);

        const confirmationMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: `✅ **Support Ticket Created Successfully!**

**Ticket ID:** ${ticket.id}
**Subject:** ${ticket.subject}
**Status:** Open

📧 **Confirmation sent to:** ${ticket.email}
${ticket.phone ? `📞 **Contact number:** ${ticket.phone}` : ''}

**What happens next?**
1. Our support team will review your request
2. You'll receive a response within **4-6 hours**
3. For urgent issues, call us at +91-9876543210

Is there anything else I can help you with?`,
            timestamp: new Date(),
            suggestedActions: ['Check another issue', 'Browse brands', 'Close chat']
        };

        setMessages(prev => [...prev, confirmationMessage]);
        setShowTicketForm(false);
        setTicketData({
            subject: '',
            description: '',
            email: '',
            phone: '',
            category: 'general'
        });
    };

    const QuickActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-600"
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 md:bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
                aria-label="Open chat support"
            >
                <MessageCircle className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-20 md:bottom-4 right-4 bg-white rounded-2xl shadow-2xl transition-all duration-300 z-50 flex flex-col ${isMinimized ? 'w-56 h-12' : 'w-72 h-[450px]'
                }`}

        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3


 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base">Gift360 Assistant</h3>
                        <div className="flex items-center gap-1.5 text-xs text-white/90">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                            <span className='text-[10px]'>Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Close chat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                Quick Actions:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <QuickActionButton
                                    icon={<Package className="w-4 h-4" />}
                                    label="Brands"
                                    onClick={() => handleSendMessage('What brands are available?')}
                                />
                                <QuickActionButton
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Balance"
                                    onClick={() => handleSendMessage('How do I check my voucher balance?')}
                                />
                                <QuickActionButton
                                    icon={<RotateCcw className="w-4 h-4" />}
                                    label="Redeem"
                                    onClick={() => handleSendMessage('How to redeem gift vouchers?')}
                                />
                                <QuickActionButton
                                    icon={<Phone className="w-4 h-4" />}
                                    label="Support"
                                    onClick={() => handleSendMessage('I need help with an issue')}
                                />
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm shadow-md'
                                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                                        }`}
                                >
                                    {message.isTyping ? (
                                        <div className="flex items-center gap-1.5 py-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-sm whitespace-pre-wrap">
                                                {message.content.split('\n').map((line, idx) => {
                                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                                    return (
                                                        <p key={idx} className={`${idx > 0 ? 'mt-2' : ''} ${!line.trim() ? 'h-2' : ''}`}>
                                                            {parts.map((part, i) => {
                                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                                    return <strong key={i} className={message.type === 'user' ? 'font-bold' : 'font-semibold text-gray-900'}>{part.slice(2, -2)}</strong>;
                                                                }
                                                                if (part.trim().startsWith('•') || part.trim().startsWith('-')) {
                                                                    return <span key={i} className="block ml-2">{part}</span>;
                                                                }
                                                                return <span key={i}>{part}</span>;
                                                            })}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                            <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                                                {message.timestamp.toLocaleTimeString('en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Suggested Actions */}
                        {messages.length > 1 && messages[messages.length - 1].suggestedActions && !isLoading && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {messages[messages.length - 1].suggestedActions?.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestedAction(action)}
                                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                    >
                                        {action}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowTicketForm(true)}
                                    className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 flex items-center gap-1"
                                >
                                    <AlertCircle className="w-3 h-3" />
                                    Create Ticket
                                </button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Support Ticket Form */}
                    {showTicketForm && (
                        <div className="absolute inset-0 bg-white rounded-2xl z-10 flex flex-col">
                            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-5 py-4 rounded-t-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-6 h-6" />
                                    <div>
                                        <h3 className="font-semibold">Create Support Ticket</h3>
                                        <p className="text-xs text-white/90">We'll respond within 4-6 hours</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTicketForm(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                    <select
                                        value={ticketData.category}
                                        onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="redemption">Redemption Issue</option>
                                        <option value="balance">Balance/Payment Issue</option>
                                        <option value="technical">Technical Problem</option>
                                        <option value="lost">Lost/Stolen Card</option>
                                        <option value="refund">Refund Request</option>
                                        <option value="corporate">Corporate Orders</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                    <input
                                        type="text"
                                        value={ticketData.subject}
                                        onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                                        placeholder="Brief description"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea
                                        value={ticketData.description}
                                        onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                                        placeholder="Details: order ID, card number (last 4 digits), error messages..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{ticketData.description.length}/500</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={ticketData.email}
                                        onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                                        placeholder="your.email@example.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        value={ticketData.phone}
                                        onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                                        placeholder="+91-XXXXXXXXXX"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    onClick={handleCreateTicket}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Ticket
                                </button>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800 mb-2 font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Need immediate help?
                                    </p>
                                    <div className="space-y-1 text-sm text-blue-700">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span>+91-9876543210 (9AM-6PM IST)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>support@gift360.io</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder="Ask me anything about gift vouchers..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                            <Bot className="w-3 h-3" />
                            Smart assistant • Ask me anything!
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default GiftVoucherChatbot;
