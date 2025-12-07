import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import './products.css';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const EditIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);

function ProductPage() {
    const { typeColor, foreColor } = useOutletContext();
    // state to hold products
    const [products, setproducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // add pop-up window
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    // form state
    const initialFormState = {
        name: '',
        imageURL: '',
        category: '',
        character: '',
        ip: '',
        quantity: 0,
        description: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    //GET products from server
    const fetchProducts = async () => {
        try{
            const response = await fetch('http://localhost:5001/api/products');
            const data = await response.json();
            setproducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    // fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // handle form input changes
   const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // add button
    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    // edit button
    const handleEdit = (product, e) => {
        e.stopPropagation();
        setEditingProduct(product);
        setFormData({
            name: product.name,
            imageUrl: product.imageUrl || '',
            category: product.category || '',
            character: product.character || '',
            ip: product.ip || '',
            quantity: product.quantity || 1,
            description: product.description || ''
        });
        setShowModal(true);
    };

    // POST new product to server
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEdit = !!editingProduct;
        const url = isEdit
                    ? `http://localhost:5001/api/products/${editingProduct._id}`
                    : 'http://localhost:5001/api/products';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Product added successfully!');
                fetchProducts(); // refresh product list
                setShowModal(false);
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        } 
    };

    // DELETE product by id
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if(!window.confirm('Delete this item?')) return;
        try {
            await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const cardStyle = {
        borderColor: typeColor,
        color: typeColor,
        background: 'rgba(255, 255, 255, 0.6)'
    };

    return (
        <div className="product-page-wrapper">

            <div className="glass-background-layer" />

            <Sidebar activePage="products" typeColor={typeColor} foreColor={foreColor} />

            <div className="main-content">
                <header className="page-header">
                    <h1 style={{ color: typeColor }}>My Collections</h1>
                    <span className="count-badge" style={{ borderColor: typeColor, color: typeColor }}>
                        {products.length} items
                    </span>
                </header>

                {loading ? (
                    <div className="loading-state" style={{ color: typeColor }}>Loading...</div>
                ) : products.length === 0 ? (
                    <div className="empty-state" style={{ color: typeColor }}>
                        <h2> Nothing here yet...</h2>
                        <p> Click the button below to add your first collection!</p>
                    </div>
                ) : (
                    <div className="product-list-container">
                        {products.map(item => (
                            <div key={item._id} className="product-horizontal-card" style={cardStyle}>
                                <div className="card-left-media">
                                    {item.imageURL ? (
                                        <img src={item.imageURL} alt={item.name} />
                                    ) : (
                                        <div className="placeholder-image" style={{ background: typeColor, opacity: 0.1 }}></div>
                                    )}
                                </div>

                                <div className="card-right-info">
                                    <div className="info-header">
                                        <h3>{item.name}</h3>
                                        <div className="quantity-badge" style={{ border: `1px solid ${typeColor}` }}>
                                            x{item.quantity}
                                        </div>
                                    </div>

                                    <div className="details-expand-area">
                                        <div className="tags-container">
                                            {item.category && <span className="detail-tag" style={{background: typeColor, color: foreColor}}>{item.category}</span>}
                                            {item.ip && <span className="detail-tag outline" style={{borderColor: typeColor}}>{item.ip}</span>}
                                            {item.character && <span className="detail-tag outline" style={{borderColor: typeColor}}>{item.character}</span>}
                                        </div>
                                        {item.description && (
                                            <p className="item-note" style={{ borderLeft: `3px solid ${typeColor}` }}>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="card-actions">
                                    <button className="action-btn edit-btn" onClick={(e) => handleEdit(item, e)} style={{ color: typeColor, borderColor: typeColor }}>
                                        <EditIcon />
                                    </button>
                                    <button className="action-btn delete-btn" onClick={(e) => handleDelete(item._id, e)} style={{ color: typeColor, borderColor: typeColor }}>
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className="fab-add-btn" onClick={handleAddNew} style={{ background: typeColor, color: foreColor }}>
                <PlusIcon />
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div 
                        className="modal-content" 
                        onClick={e => e.stopPropagation()}
                        style={{ border: `2px solid ${typeColor}`, color: typeColor }}
                    >
                        <h2>Add New Item</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <input name="name" placeholder="Name *" value={formData.name} onChange={handleInputChange} required style={{ borderColor: typeColor }} />
                            <div className="form-row">
                                <input name="category" placeholder="Category (e.g. Badge)" value={formData.category} onChange={handleInputChange} style={{ borderColor: typeColor }} />
                                <input type="number" name="quantity" placeholder="Qty" value={formData.quantity} onChange={handleInputChange} style={{ borderColor: typeColor }} />
                            </div>
                            <div className="form-row">
                                <input name="character" placeholder="Character" value={formData.character} onChange={handleInputChange} style={{ borderColor: typeColor }} />
                                <input name="ip" placeholder="Series / IP" value={formData.ip} onChange={handleInputChange} style={{ borderColor: typeColor }} />
                            </div>
                            <input name="imageURL" placeholder="Image URL (http://...)" value={formData.imageURL} onChange={handleInputChange} style={{ borderColor: typeColor }} />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ borderColor: typeColor }} rows="3" />
                            
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} style={{ color: typeColor }}>Cancel</button>
                                <button type="submit" style={{ background: typeColor, color: foreColor }}>Add Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductPage;