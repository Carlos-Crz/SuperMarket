import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoSection from './InfoSection';

describe('InfoSection component', () => {
  test('renders the title', () => {
    render(<InfoSection title="Main Title" />);
    // Verifica que el título se renderice correctamente
    expect(screen.getByText('Main Title')).toBeInTheDocument();
  });

  test('renders the subtitle when showSubtitle is true', () => {
    render(<InfoSection title="Main Title" subtitle="Sub Title" showSubtitle={true} />);
    // Verifica que el subtítulo se renderice
    expect(screen.getByText('Sub Title')).toBeInTheDocument();
  });

  test('does not render the subtitle when showSubtitle is false', () => {
    render(<InfoSection title="Main Title" subtitle="Sub Title" showSubtitle={false} />);
    // Verifica que el subtítulo no se renderice
    expect(screen.queryByText('Sub Title')).not.toBeInTheDocument();
  });

  test('renders the description when showDescription is true', () => {
    render(
      <InfoSection
        title="Main Title"
        description="This is a description"
        showDescription={true}
      />
    );
    // Verifica que la descripción se renderice
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  test('does not render the description when showDescription is false', () => {
    render(
      <InfoSection
        title="Main Title"
        description="This is a description"
        showDescription={false}
      />
    );
    // Verifica que la descripción no se renderice
    expect(screen.queryByText('This is a description')).not.toBeInTheDocument();
  });
});
