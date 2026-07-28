import { AppStoreProvider, useAppStore } from './store/AppStore';
import { RouterProvider, useRouter } from './store/Router';
import { DemoBar } from './components/DemoBar';
import { ToastContainer } from './components/ui';
import { LoginScreen } from './screens/customer/LoginScreen';
import { ProductsScreen } from './screens/customer/ProductsScreen';
import { ProductDetailScreen } from './screens/customer/ProductDetailScreen';
import { MyPageScreen } from './screens/customer/MyPageScreen';
import { EditProfileScreen } from './screens/customer/EditProfileScreen';
import { AdminLoginScreen } from './screens/admin/AdminLoginScreen';
import { DashboardScreen } from './screens/admin/DashboardScreen';
import { MembersScreen } from './screens/admin/MembersScreen';
import { MemberDetailScreen } from './screens/admin/MemberDetailScreen';
import { NewProductScreen } from './screens/admin/NewProductScreen';

function ScreenRouter() {
  const { path } = useRouter();
  const { viewMode } = useAppStore();

  // パスに基づいて画面をレンダリング
  if (path === '/login') return <LoginScreen />;
  if (path === '/products') return <ProductsScreen />;
  if (path.startsWith('/product/')) return <ProductDetailScreen />;
  if (path === '/mypage') return <MyPageScreen />;
  if (path === '/mypage/edit') return <EditProfileScreen />;
  if (path === '/admin/login') return <AdminLoginScreen />;
  if (path === '/admin/dashboard') return <DashboardScreen />;
  if (path === '/admin/members') return <MembersScreen />;
  if (path.startsWith('/admin/member/')) return <MemberDetailScreen />;
  if (path === '/admin/products/new') return <NewProductScreen />;

  // フォールバック — ビューモードに応じたデフォルト画面
  return viewMode === 'admin' ? <AdminLoginScreen /> : <LoginScreen />;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DemoBar />
      <ScreenRouter />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppStoreProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AppStoreProvider>
  );
}

export default App;
