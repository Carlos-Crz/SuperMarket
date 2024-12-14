import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";

describe("Table component", () => {
    const mockColumns = ["name", "email"];
    const mockData = [
        { id_usuario: 1, name: "John Doe", email: "john@example.com" },
        { id_usuario: 2, name: "Jane Doe", email: "jane@example.com" },
    ];
    const mockOnView = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    test("renders table with columns and data", () => {
        render(
            <Table 
                columns={mockColumns} 
                data={mockData} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        // Verificar encabezados
        mockColumns.forEach((column) => {
            expect(screen.getByText(column)).toBeInTheDocument();
        });

        // Verificar datos
        mockData.forEach((row) => {
            expect(screen.getByText(row.name)).toBeInTheDocument();
            expect(screen.getByText(row.email)).toBeInTheDocument();
        });

        // Verificar columna de acciones
        expect(screen.getAllByText("visibility").length).toBe(mockData.length);
        expect(screen.getAllByText("edit").length).toBe(mockData.length);
        expect(screen.getAllByText("delete").length).toBe(mockData.length);
    });

    test("calls onView when view button is clicked", () => {
        render(
            <Table 
                columns={mockColumns} 
                data={mockData} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        const viewButtons = screen.getAllByText("visibility");
        fireEvent.click(viewButtons[0]);
        expect(mockOnView).toHaveBeenCalledWith(mockData[0]);
    });

    test("calls onEdit when edit button is clicked", () => {
        render(
            <Table 
                columns={mockColumns} 
                data={mockData} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        const editButtons = screen.getAllByText("edit");
        fireEvent.click(editButtons[1]);
        expect(mockOnEdit).toHaveBeenCalledWith(mockData[1]);
    });

    test("calls onDelete when delete button is clicked", () => {
        render(
            <Table 
                columns={mockColumns} 
                data={mockData} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        const deleteButtons = screen.getAllByText("delete");
        fireEvent.click(deleteButtons[0]);
        expect(mockOnDelete).toHaveBeenCalledWith(mockData[0]);
    });
});
