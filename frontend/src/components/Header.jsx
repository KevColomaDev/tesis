import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.png';
import user from '../assets/user.png';
import { logoutRequest } from '../api/auth';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const logoutClick = async () =>{
    const response = await logoutRequest();
    console.log(response)
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="mx-auto h-10 invert brightness-0" src={logo} alt="Solca" />
              </div>
              <div className="hidden md:flex md:ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/habitaciones"
                    className={`block px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/habitaciones'
                        ? 'border-b-2 border-gray-300 text-gray-300'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Habitaciones
                  </Link>
                  <Link
                    to="/suministros"
                    className={`block px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/suministros'
                        ? 'border-b-2 border-gray-300 text-gray-300'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Suministros
                  </Link>
                  <Link
                    to="/donaciones"
                    className={`block px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === '/donaciones'
                        ? 'border-b-2 border-gray-300 text-gray-300'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Donaciones
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:flex md:ml-4">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <button
                  onClick={toggleMenu}
                  type="button"
                  className="relative flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={user} alt="user" />
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      onClick={()=> setIsMenuOpen(false)}
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                    >
                      Opciones del administrador
                    </Link>
                    <Link
                      onClick={()=> setIsMenuOpen(false)}
                      to="/actualizar-password"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                    >
                      Actualizar Contraseña
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={()=>logoutClick()}
                    >
                      Salir
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={toggleMobileMenu}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`block h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <svg
                  className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <Link
                to="/habitaciones"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={closeMobileMenu} // Close mobile menu on link click
              >
                Habitaciones
              </Link>
              <Link
                to="/suministros"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={closeMobileMenu} // Close mobile menu on link click
              >
                Suministros
              </Link>
              <Link
                to="/donaciones"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={closeMobileMenu} // Close mobile menu on link click
              >
                Donaciones
              </Link>
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={user} alt="user" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">Nombre Usuario</div>
                  <div className="mt-1 text-sm font-medium leading-none text-gray-400">email@example.com</div>
                </div>
              </div>
              <div className="mt-3 space-y-1" onClick={closeMobileMenu}>
                <Link
                  to="/actualizar-password"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Cambiar Contraseña
                </Link>
                <Link
                  to="/admin"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Opciones del administrador
                </Link>
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={()=>logoutClick()}
                >
                  Salir
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
