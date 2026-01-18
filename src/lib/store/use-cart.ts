
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItemDisplay } from '@/types'

interface CartState {
    items: CartItemDisplay[]
    isLoading: boolean
    addItem: (item: CartItemDisplay) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    clearCart: () => void
    syncWithUser: () => Promise<void>
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: async (newItem) => {
                const items = get().items
                const existingItem = items.find(
                    (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
                )

                // Optimistic update for Guest (or User if we want immediate UI feedback)
                // For simplified Phase 1.4:
                // If Guest: Local only.
                // If User: Call API to add, then re-fetch or optimistically update.
                // To detect User, we can check Session?
                // But Store works outside components. We can pass existing session status?
                // Or just try API call if we think we might be logged in (or handle 401 silently).
                // Better approach: Store is dumb. It just tries to network if configured.
                // Implementation Plan said: "sync specific items (merge logic)" via API.

                // Let's rely on components (AddToCart) to trigger API if logged in?
                // OR simpler: `useCartStore` persists to localStorage.
                // When auth state changes (SignIn), we call `syncWithUser`.

                // For now, let's implement local logic first, then API calls if we are authenticated.
                // But we don't have auth state here.
                // We will handle API calls in the components mostly, or pass a flag?
                // ACTUALLY, usually the pattern is:
                // `addToCart` in component checks session.
                // If session, call API. If success, update store.
                // If no session, update store (stored in localStorage).

                // BUT we want the store to be the source of truth.
                // Lets make `addItem` handle local logic, and optionally Sync.
                // Wait, if I am guest, I add to local.
                // Then I log in. `syncWithUser` runs. It sends local items to server. Server merges. Returns new list. Store updates.

                if (existingItem) {
                    const updatedItems = items.map((i) =>
                        i.id === existingItem.id
                            ? { ...i, quantity: i.quantity + newItem.quantity }
                            : i
                    )
                    set({ items: updatedItems })
                } else {
                    set({ items: [...items, { ...newItem, id: newItem.id || `local-${Date.now()}` }] })
                }

                // We will add API hooks later or let the `syncWithUser` handle the DB part mostly?
                // If user is logged in, every action should ideally sync.
                // We can't easily check auth here without importing `getSession` which is async.
            },

            removeItem: async (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) })
            },

            updateQuantity: async (itemId, quantity) => {
                set({ items: get().items.map((i) => i.id === itemId ? { ...i, quantity } : i) })
            },

            clearCart: () => set({ items: [] }),

            syncWithUser: async () => {
                set({ isLoading: true })
                try {
                    // 1. Get current local items
                    const localItems = get().items

                    // 2. Send to Sync API
                    const res = await fetch('/api/cart/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: localItems }),
                    })

                    if (res.ok) {
                        const data = await res.json()
                        set({ items: data.data || [] })
                    }
                } catch (error) {
                    console.error('Failed to sync cart:', error)
                } finally {
                    set({ isLoading: false })
                }
            }
        }),
        {
            name: 'arnaka-cart-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // We handle hydration manually or strictly on client to avoid mismatch
        }
    )
)
