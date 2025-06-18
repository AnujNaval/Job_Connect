import AppNavbar from './AppNavbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-fill">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}