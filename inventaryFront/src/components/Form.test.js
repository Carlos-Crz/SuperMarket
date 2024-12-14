import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from "./Form";

// Mock data for testing
const mockFields = [
  { name: "username", label: "Username", type: "text", required: true, placeholder: "Enter username" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email" },
  { name: "role", label: "Role", type: "select", required: true }
];

const mockSelectOptions = {
  role: [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" }
  ]
};

const mockFormData = {
  username: "",
  email: "",
  role: ""
};

const mockSetFormData = jest.fn();
const mockOnSubmit = jest.fn();

// Test to check if the form renders with the provided fields and buttons
describe("Form component", () => {
  test("renders form with fields and buttons", () => {
    render(
      <Form
        fields={mockFields}
        title="Test Form"
        buttons={[{ text: "Submit", type: "submit", className: "submit-button" }]}
        onSubmit={mockOnSubmit}
        formData={mockFormData}
        setFormData={mockSetFormData}
        selectOptions={mockSelectOptions}
      />
    );

    // Check if the form title is rendered
    expect(screen.getByText(/Test Form/i)).toBeInTheDocument();

    // Check if the input fields are rendered
    mockFields.forEach(field => {
      if (field.type === "select") {
        expect(screen.getByLabelText(field.label)).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveTextContent("Seleccione una opción");
      } else {
        expect(screen.getByPlaceholderText(field.placeholder)).toBeInTheDocument();
      }
    });

    // Check if the submit button is rendered
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test("calls setFormData when input is changed", () => {
    render(
      <Form
        fields={mockFields}
        title="Test Form"
        buttons={[{ text: "Submit", type: "submit", className: "submit-button" }]}
        onSubmit={mockOnSubmit}
        formData={mockFormData}
        setFormData={mockSetFormData}
        selectOptions={mockSelectOptions}
      />
    );

    // Simulate input change
    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
      target: { value: "newUsername" }
    });

    // Verify that setFormData was called with the expected arguments
    expect(mockSetFormData).toHaveBeenCalledWith({
      ...mockFormData,
      username: "newUsername"
    });
  });

  test("calls onSubmit when the form is submitted", () => {
    render(
      <Form
        fields={mockFields}
        title="Test Form"
        buttons={[{ text: "Submit", type: "submit", className: "submit-button" }]}
        onSubmit={mockOnSubmit}
        formData={mockFormData}
        setFormData={mockSetFormData}
        selectOptions={mockSelectOptions}
      />
    );

    // Simulate form submission
    fireEvent.submit(screen.getByTestId("form"));

    // Check if the onSubmit function was called
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
