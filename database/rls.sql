-- ============================================================================
-- ARTISAN BREW AI - ROW LEVEL SECURITY (RLS) & DATA ISOLATION POLICIES
-- ============================================================================

-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTION TO CHECK IF USER IS ADMIN
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- MENU ITEMS POLICIES
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
CREATE POLICY "Anyone can view menu items" ON public.menu_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert menu items" ON public.menu_items;
CREATE POLICY "Only admins can insert menu items" ON public.menu_items
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can update menu items" ON public.menu_items;
CREATE POLICY "Only admins can update menu items" ON public.menu_items
    FOR UPDATE USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can delete menu items" ON public.menu_items;
CREATE POLICY "Only admins can delete menu items" ON public.menu_items
    FOR DELETE USING (public.is_admin(auth.uid()));

-- ORDERS POLICIES
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update order status" ON public.orders;
CREATE POLICY "Admins can update order status" ON public.orders
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Users can insert order items for their order" ON public.order_items;
CREATE POLICY "Users can insert order items for their order" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- AI RECOMMENDATIONS POLICIES
DROP POLICY IF EXISTS "Users can view own recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view own recommendations" ON public.ai_recommendations
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create recommendation logs" ON public.ai_recommendations;
CREATE POLICY "Authenticated users can create recommendation logs" ON public.ai_recommendations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
