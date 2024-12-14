import React from 'react';
import '../App.css';

function Table({ columns, data, onView, onEdit, onDelete }) {
    return (
        <table className="style__table">
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                    ))}
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id_usuario}>
                        {columns.map((column, index) => (
                            <td key={index}>{row[column]}</td>
                        ))}
                        <td>
                            <a onClick={() => onView(row)}>
                                <span className="material-symbols-outlined view">visibility</span>
                            </a>
                            <a onClick={() => onEdit(row)}>
                                <span className="material-symbols-outlined edit">edit</span>
                            </a>
                            <a onClick={() => onDelete(row)}>
                                <span className="material-symbols-outlined delet">delete</span>
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
