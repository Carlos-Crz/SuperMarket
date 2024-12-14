import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

// Mock para useLocation de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/Dashboard' })
}));

describe('Sidebar component', () => {
  test('should render sidebar with navigation items', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isSidebarHidden={false}
          isSidebarCollapsed={false}
          toggleSidebarCollapse={() => {}}
        />
      </MemoryRouter>
    );

    // Verificar que el elemento de la barra lateral y sus elementos de navegación estén presentes
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Gestión de categorías')).toBeInTheDocument();
    expect(screen.getByText('Gestión de productos')).toBeInTheDocument();
    expect(screen.getByText('Gestión de proveedores')).toBeInTheDocument();
    expect(screen.getByText('Gestión de ventas')).toBeInTheDocument();
    expect(screen.getByText('Gestión de cajas')).toBeInTheDocument();
    expect(screen.getByText('Gestión de clientes')).toBeInTheDocument();
    expect(screen.getByText('Gestión de usuarios')).toBeInTheDocument();
  });

  test('should highlight the active link based on the current route', () => {
    render(
      <MemoryRouter initialEntries={['/Dashboard']}>  {/* Inicializar con la ruta /Dashboard */}
        <Sidebar
          isSidebarHidden={false}
          isSidebarCollapsed={false}
          toggleSidebarCollapse={() => {}}
        />
      </MemoryRouter>
    );

    // Verificar que la clase active esté aplicada al elemento de la barra lateral correspondiente
    expect(screen.getByText('Dashboard').parentElement).toHaveClass('sidebar__item--active');
  });

  test('should call toggleSidebarCollapse when the collapse button is clicked', () => {
    const mockToggleSidebarCollapse = jest.fn();

    render(
      <MemoryRouter>
        <Sidebar
          isSidebarHidden={false}
          isSidebarCollapsed={false}
          toggleSidebarCollapse={mockToggleSidebarCollapse}
        />
      </MemoryRouter>
    );

    // Simular un clic en el botón de colapso
    fireEvent.click(screen.getByText('Colapsar Menu'));

    // Verificar que la función mockToggleSidebarCollapse fue llamada
    expect(mockToggleSidebarCollapse).toHaveBeenCalledTimes(1);
  });

  test('should render correctly when sidebar is hidden', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isSidebarHidden={true}  // Pasar isSidebarHidden como true
          isSidebarCollapsed={false}
          toggleSidebarCollapse={() => {}}
        />
      </MemoryRouter>
    );

    // Verificar que la clase active esté aplicada al elemento contenedor
    expect(screen.getByRole('complementary')).toHaveClass('active');
  });
});
