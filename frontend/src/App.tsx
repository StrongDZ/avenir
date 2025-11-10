import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { RecommendationPage } from "./pages/RecommendationPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { RewardPage } from "./pages/RewardPage";
import { CartProvider } from "./contexts/CartContext";
import { RewardProvider } from "./contexts/RewardContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationStack } from "./components/common/Notification";
import { Shell } from "./components/common/Shell";
import { LoginPage } from "./pages/LoginPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Loader } from "./components/common/Loader";
import { AccountPage } from "./pages/AccountPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export default function App() {
    return (
        <NotificationProvider>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </NotificationProvider>
    );
}

function AppLayout() {
    const { user, loading } = useAuth();
    const userId = user?.id ?? "demo-user";

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <Loader text="Preparing your personalized experience..." />
            </div>
        );
    }

    return (
        <CartProvider key={userId} userId={userId}>
            <RewardProvider key={userId} userId={userId}>
                <Shell>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/recommend" element={<RecommendationPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/rewards" element={<RewardPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/account" element={<AccountPage />} />
                    </Routes>
                    <NotificationStack />
                </Shell>
            </RewardProvider>
        </CartProvider>
    );
}
