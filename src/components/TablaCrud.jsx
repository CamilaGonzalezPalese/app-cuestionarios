import './TablaCrud.css';
import { useEffect, useState } from 'react';

export function TablaCrud({ service, columns, formFields }) {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const res = await service.getAll();
        setItems(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await service.update(editingId, formData);
        } else {
            await service.create(formData);
        }
        setFormData({});
        setEditingId(null);
        fetchData();
    };

    const handleEdit = (item) => {
        setFormData(item);
        setEditingId(item.id);
    };

    const handleDelete = async (id) => {
        await service.remove(id);
        fetchData();
    };

    return (
        <div className="crud-table">
            <form onSubmit={handleSubmit}>
                {formFields.map(field => (
                    <input
                        key={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.label}
                    />
                ))}
                <button className="crud-button create" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        {columns.map(col => <th key={col}>{col}</th>)}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            {columns.map(col => <td key={col}>{item[col.toLowerCase()]}</td>)}
                            <td>
                                <button className="crud-button edit" onClick={() => handleEdit(item)}>Editar</button>
                                <button className="crud-button delete" onClick={() => handleDelete(item.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
