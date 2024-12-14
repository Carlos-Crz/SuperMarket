import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button'; // Asegúrate de importar el componente correctamente

describe('Button component', () => {
  test('renders the button with the correct text', () => {
    render(<Button text="Click Me" onClick={() => {}} />);
    // Verifica que el texto "Click Me" se renderice en el botón
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls the onClick function when the button is clicked', () => {
    const mockOnClick = jest.fn(); // Crea una función simulada para la prueba
    render(<Button text="Click Me" onClick={mockOnClick} />);
    
    // Simula un clic en el botón
    fireEvent.click(screen.getByText('Click Me'));
    
    // Verifica que la función onClick se haya llamado
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
