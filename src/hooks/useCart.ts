// hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart, mergeCart } from "@/api/cartApi";
import type { Cart, AddToCartRequest, OrderRequest } from "@/types/cart";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// LocalStorage cart key
const GUEST_CART_KEY = "guestCart";

// Helper functions for localStorage cart
const getGuestCart = (): AddToCartRequest[] => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to get guest cart", e);
    return [];
  }
};

const saveGuestCart = (items: AddToCartRequest[]) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save guest cart", e);
  }
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (e) {
    console.error("Failed to clear guest cart", e);
  }
};

export const useCart = (clientId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();


  // Get cart
const { data: cart, isLoading, isError, refetch } = useQuery({
  queryKey: ["cart", clientId],
  queryFn: () => getCart(clientId!),
  enabled: !!clientId,
  staleTime: 30 * 1000,
  placeholderData: () => {
    // Show guest cart items immediately while fetching backend cart
    if (!clientId) return undefined;
    
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return undefined;
    
    const mergeFlag = `cart_merged_${clientId}`;
    if (localStorage.getItem(mergeFlag)) return undefined; // Already merged
    
    // Create placeholder cart with guest items
    const guestItems = guestCart.map((item, index) => ({
      itemId: `guest-${Date.now()}-${index}`,
      brandId: item.brandId,
      brandName: item.brandName,
      quantity: item.quantity,
      unitValue: item.unitValue,
      lineTotal: item.quantity * item.unitValue,
      image: item.image,
    }));
    
    return {
      clientId: clientId!,
      items: guestItems,
      totalAmount: guestItems.reduce((sum, item) => sum + item.lineTotal, 0),
      totalItems: guestItems.reduce((sum, item) => sum + item.quantity, 0),
      currency: "INR"
    };
  }
});


  // ✅ OPTIMISTIC ADD - Updates UI immediately
  // ✅ OPTIMISTIC ADD - Updates UI immediately
  const addMutation = useMutation({
    mutationFn: (item: AddToCartRequest) => {
      // If not logged in, save to localStorage
      if (!clientId) {
        const guestCart = getGuestCart();
        const existingIndex = guestCart.findIndex(
          (i) => i.brandId === item.brandId && i.unitValue === item.unitValue
        );
        
        if (existingIndex > -1) {
          guestCart[existingIndex].quantity += item.quantity;
        } else {
          guestCart.push(item);
        }
        
        saveGuestCart(guestCart);
        return Promise.resolve({ items: [], totalAmount: 0, totalItems: 0, clientId: "", currency: "INR" } as Cart);
      }
      
      return addToCart(clientId!, item);
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart", clientId] });
      const previousCart = queryClient.getQueryData<Cart>(["cart", clientId]);

      if (previousCart) {
        const existingItemIndex = previousCart.items.findIndex(
          (item) => item.brandId === newItem.brandId && item.unitValue === newItem.unitValue
        );

        let updatedItems;
        if (existingItemIndex > -1) {
          updatedItems = [...previousCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
            lineTotal: (updatedItems[existingItemIndex].quantity + newItem.quantity) * newItem.unitValue,
          };
        } else {
          updatedItems = [
            ...previousCart.items,
            {
              itemId: `temp-${Date.now()}`,
              brandId: newItem.brandId,
              brandName: newItem.brandName,
              quantity: newItem.quantity,
              unitValue: newItem.unitValue,
              lineTotal: newItem.quantity * newItem.unitValue,
              image: newItem.image,
            },
          ];
        }

        const newTotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
        queryClient.setQueryData(["cart", clientId], {
          ...previousCart,
          items: updatedItems,
          totalAmount: newTotal,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      }

      return { previousCart };
    },
    onSuccess: (data) => {
      if (clientId) {
        queryClient.setQueryData(["cart", clientId], data);
      }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart && clientId) {
        queryClient.setQueryData(["cart", clientId], context.previousCart);
      }
      toast({ title: "Failed to add to cart", variant: "destructive" });
    },
  });


  // ✅ OPTIMISTIC UPDATE QUANTITY - Changed to use itemId
  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartQuantity(clientId!, itemId, { quantity }),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart", clientId] });
      const previousCart = queryClient.getQueryData<Cart>(["cart", clientId]);

      if (previousCart) {
        const updatedItems = previousCart.items.map((item) => {
          if (item.itemId === itemId) {
            return {
              ...item,
              quantity,
              lineTotal: quantity * item.unitValue,
            };
          }
          return item;
        });

        const newTotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);

        queryClient.setQueryData<Cart>(["cart", clientId], {
          ...previousCart,
          items: updatedItems,
          totalAmount: newTotal,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      }

      return { previousCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", clientId], data);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", clientId], context.previousCart);
      }
      toast({ title: "Failed to update quantity", variant: "destructive" });
    },
  });

  // ✅ OPTIMISTIC REMOVE - Changed to use itemId
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFromCart(clientId!, itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart", clientId] });
      const previousCart = queryClient.getQueryData<Cart>(["cart", clientId]);

      if (previousCart) {
        const updatedItems = previousCart.items.filter((item) => item.itemId !== itemId);
        const newTotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);

        queryClient.setQueryData<Cart>(["cart", clientId], {
          ...previousCart,
          items: updatedItems,
          totalAmount: newTotal,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      }

      return { previousCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", clientId], data);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", clientId], context.previousCart);
      }
      toast({ title: "Failed to remove item", variant: "destructive" });
    },
  });

  // ✅ OPTIMISTIC CLEAR
  const clearMutation = useMutation({
    mutationFn: () => clearCart(clientId!),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart", clientId] });
      const previousCart = queryClient.getQueryData<Cart>(["cart", clientId]);

      queryClient.setQueryData<Cart>(["cart", clientId], {
        clientId: clientId!,
        items: [],
        totalAmount: 0,
        currency: "INR",
        totalItems: 0,
      });

      return { previousCart };
    },
    onSuccess: () => {
      toast({ title: "Cart cleared" });
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", clientId], context.previousCart);
      }
      toast({ title: "Failed to clear cart", variant: "destructive" });
    },
  });

// ✅ MERGE GUEST CART ON LOGIN - WITH OPTIMISTIC UPDATE
useEffect(() => {
  const mergeGuestCart = async () => {
    if (!clientId) return;
    
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    // Check if already merged using localStorage flag
    const mergeFlag = `cart_merged_${clientId}`;
    if (localStorage.getItem(mergeFlag)) {
      console.log("Already merged for this clientId");
      clearGuestCart();
      return;
    }

    console.log(`Starting merge of ${guestCart.length} guest cart items`);
    
    // Set flag IMMEDIATELY to prevent duplicate merges
    localStorage.setItem(mergeFlag, 'true');
    
    // ✅ OPTIMISTIC UPDATE: Show guest items in cart immediately
    const currentCart = queryClient.getQueryData<Cart>(["cart", clientId]) || {
      clientId: clientId!,
      items: [],
      totalAmount: 0,
      totalItems: 0,
      currency: "INR"
    };

    // Convert guest cart to cart items
    const guestItems = guestCart.map((item, index) => ({
      itemId: `guest-${Date.now()}-${index}`,
      brandId: item.brandId,
      brandName: item.brandName,
      quantity: item.quantity,
      unitValue: item.unitValue,
      lineTotal: item.quantity * item.unitValue,
      image: item.image,
    }));

    // Combine current cart with guest items
    const combinedItems = [...currentCart.items, ...guestItems];
    const newTotal = combinedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const newTotalItems = combinedItems.reduce((sum, item) => sum + item.quantity, 0);

    // ✅ Update cache immediately for instant UI update
    queryClient.setQueryData(["cart", clientId], {
      ...currentCart,
      items: combinedItems,
      totalAmount: newTotal,
      totalItems: newTotalItems,
    });
    
    // Clear guest cart IMMEDIATELY
    clearGuestCart();

    // ✅ Now merge in background and sync with backend
    try {
      // Merge guest cart items with backend cart
      await mergeCart(clientId, guestCart);
      
      // Refetch to get real data from backend (with proper itemIds)
      await refetch();
      
      toast({
        title: "Cart Updated",
        description: `${guestCart.length} item(s) added from your session`
      });
      
      console.log("Merge completed successfully");
    } catch (error) {
      console.error("Failed to merge guest cart", error);
      
      // On error, remove flag and restore guest cart so user can retry
      localStorage.removeItem(mergeFlag);
      saveGuestCart(guestCart);
      
      // Revert to original cart on error
      queryClient.setQueryData(["cart", clientId], currentCart);
      
      toast({
        title: "Cart Sync Failed",
        description: "Some items couldn't be added",
        variant: "destructive"
      });
    }
  };

  mergeGuestCart();
}, [clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateOrderRequest = (): OrderRequest | null => {
    if (!clientId || !cart || cart.items.length === 0) {
      return null;
    }

    const today = new Date();
    const yymmdd =
      today.getFullYear().toString().slice(-2) +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");

    const uuid = window.crypto.randomUUID();
    const orderNumber =
      "ORD" + yymmdd + uuid.replace(/-/g, "").slice(0, 12).toUpperCase();

    return {
      order: {
        clientId,
        orderNumber,
        totalAmount: cart.totalAmount,
        currency: "INR",
        status: "PENDING",
      },
      items: cart.items.map((item) => ({
        brandId: item.brandId,
        quantity: item.quantity,
        unitValue: item.unitValue,
        lineTotal: item.lineTotal,
        meta: "{}",
      })),
    } as OrderRequest;
  };

  return {
    cart,
    isLoading,
    isError,
    refetch,
    addToCart: addMutation.mutate,
    updateQuantity: (itemId: string, quantity: number) =>
      updateMutation.mutate({ itemId, quantity }),
    removeFromCart: removeMutation.mutate,
    clearCart: clearMutation.mutate,
    generateOrderRequest,
    totalItems: clientId 
  ? (cart?.totalItems || 0) 
  : getGuestCart().reduce((sum, item) => sum + item.quantity, 0),
  };
};
