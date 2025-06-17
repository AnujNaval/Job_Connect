import AppNavbar from './AppNavbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <AppNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}