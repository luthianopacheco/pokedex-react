import { Outlet } from 'react-router';
import Header from './header';
import Footer from './footer';
import './layout.css'

export default function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}