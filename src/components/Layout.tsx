import { NavLink, Outlet } from 'react-router-dom'
import { useColorScheme } from '../lib/settings'

const NAV = [
  { to: '/', label: 'Accueil', icon: '🏠', end: true },
  { to: '/themes', label: 'Code', icon: '📚' },
  { to: '/examen', label: 'Examen', icon: '⏱️' },
  { to: '/revision', label: 'Révision', icon: '🔁' },
  { to: '/conduite', label: 'Conduite', icon: '🚗' },
  { to: '/plus', label: 'Plus', icon: '☰' },
]

export function Layout() {
  const [scheme, toggle] = useColorScheme()
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Permis B1</span>
        <button
          type="button"
          className="icon-btn"
          onClick={toggle}
          aria-label={scheme === 'dark' ? 'Світла тема' : 'Темна тема'}
        >
          {scheme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <nav className="bottomnav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className="navitem">
            <span aria-hidden>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
