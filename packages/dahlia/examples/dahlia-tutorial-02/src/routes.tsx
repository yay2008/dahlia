import { Routes } from 'dahlia/router'
import { Home } from './pages/Home'
import { About } from './pages/About'

export const routes: Routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
]