import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import DateDisplay from '../../components/DateDisplay';
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

    // deal a bit with color pattern
    const fColor = String(foreColor).toLowerCase();
    const tColor = String(typeColor).toLowerCase();
    const colorMap = {
        '#f2eadf': '#0a3a40',
        '#122459': '#122459',
        '#bfbdb8': '#000000',
    };
    const displayTypeColor = (tColor === '#ffffff' && colorMap[fColor]) 
        ? colorMap[fColor] 
        : typeColor;

    // state to hold products
    const [products, setproducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // add pop-up window
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    // select function
    const [filters, setFilters] = useState({ category: 'All', character: 'All', ip: 'All'});
    // sort function
    const [sortBy, setSortBy] = useState('newest');
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
            // const response = await fetch('/api/products');
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

    // helper function: get the unique product as required
    const getUniqueValues = (key) => {
        const values = products.map(item => item[key]).filter(Boolean);
        return['All', ...new Set(values)];
    };

    // get final list
    const filteredAndSortedProducts = products.filter(item => {
        const matchCategory = filters.category === 'All' || item.category === filters.category;
        const matchCharacter = filters.character === 'All' || item.character === filters.character;
        const matchIp = filters.ip === 'All' || item.ip === filters.ip;
        return matchCategory && matchCharacter && matchIp;
    }).sort((a, b) => {
        switch(sortBy){
            case 'newest': return new Date(b.time) - new Date(a.time);
            case 'oldest': return new Date(a.time) - new Date(b.time);
            case 'most': return b.quantity - a.quantity;
            case 'least': return a.quantity - b.quantity;
            default: return 0;
        }
    });

    // handle form input changes
    const handleInputChange = (e) => setFormData({ 
        ...formData, 
        [e.target.name]: e.target.value 
    });

    // handle filter change
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // translate uploaded img to Base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 15 * 1024 * 1024){
            alert("Image is too large! Please upload an image under 15MB. <3");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        // after transforming, send to database
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageURL: reader.result }));
        };
    };

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
            imageURL: product.imageURL || '',
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
                    // ? `/api/products/${editingProduct._id}`
                    // : '/api/products';
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
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const cardStyle = {
        borderColor: displayTypeColor,
        color: displayTypeColor,
        background: 'rgba(255, 255, 255, 0.6)'
    };

    const selectStyle = {
        borderColor: displayTypeColor,
        color: displayTypeColor,
        background: 'transparent',
        padding: '5px 10px',
        borderRadius: '15px',
        outline: 'none',
        fontSize: '0.85rem',
        cursor: 'pointer'
    };

    return (
        <div className="product-page-wrapper">

            <div className="glass-background-layer" />

            <Sidebar activePage="products" typeColor={displayTypeColor} foreColor={foreColor} />

            <div className="main-content">
                <header className="page-header">
                    <h1 style={{ color: displayTypeColor }}>My Collections</h1>

                    <div className="header-controls">
                        <div className="filter-group">
                            <select name="category" value={filters.category} onChange={handleFilterChange} style={selectStyle}>
                                <option value="All">Category: All</option>
                                {getUniqueValues('category').filter(v => v !== 'All').map(v => <option key={v} value={v}>{v}</option>)}
                            </select>

                            <select name="character" value={filters.character} onChange={handleFilterChange} style={selectStyle}>
                                <option value="All">Char: All</option>
                                {getUniqueValues('character').filter(v => v !== 'All').map(v => <option key={v} value={v}>{v}</option>)}
                            </select>

                            <select name="ip" value={filters.ip} onChange={handleFilterChange} style={selectStyle}>
                                <option value="All">IP: All</option>
                                {getUniqueValues('ip').filter(v => v !== 'All').map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>

                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
                            <option value="newest">Sort: Newest</option>
                            <option value="oldest">Sort: Oldest</option>
                            <option value="most">Qty: High to Low</option>
                            <option value="least">Qty: Low to High</option>
                        </select>

                        <div style={{ width: '1px', height: '20px', background: displayTypeColor, opacity: 0.3 }}></div>

                        <span className="count-badge" style={{ color: displayTypeColor }}>
                            {filteredAndSortedProducts.length} items
                        </span>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-state" style={{ color: displayTypeColor }}>Loading...</div>
                ) : filteredAndSortedProducts.length === 0 ? (
                    <div className="empty-state" style={{ color: displayTypeColor }}>
                        {products.length === 0 ? (
                            <>
                                <h2>Nothing here yet...</h2>
                                <p>Click the button below to add your first collection!</p>
                            </>
                        ) : (
                            <h3>No items match your filters.</h3>
                        )}
                    </div>
                ) : (
                    <div className="product-list-container">
                        {filteredAndSortedProducts.map(item => (
                            <div key={item._id} className="product-horizontal-card" style={cardStyle}>
                                <div className="card-left-media">
                                    {item.imageURL ? (
                                        <img src={item.imageURL} alt={item.name} />
                                    ) : (
                                        <div className="placeholder-image" style={{ background: displayTypeColor, opacity: 0.1 }}></div>
                                    )}
                                </div>

                                <div className="card-right-info">
                                    <div className="info-header">
                                        <h3>{item.name}</h3>
                                        <div className="quantity-badge" style={{ border: `1px solid ${displayTypeColor}` }}>
                                            x{item.quantity}
                                        </div>

                                         <DateDisplay 
                                            dateString={item.time}
                                            style={{
                                                marginLeft: '30px',
                                                marginTop: '2px',
                                                fontWeight: 'normal'
                                            }}/>
                                    </div>

                                    <div className="details-expand-area">
                                        <div className="tags-container">
                                            {item.category && <span className="detail-tag outline" style={{borderColor: displayTypeColor}}>{item.category}</span>}
                                            {item.ip && <span className="detail-tag outline" style={{borderColor: displayTypeColor}}>{item.ip}</span>}
                                            {item.character && <span className="detail-tag outline" style={{borderColor: displayTypeColor}}>{item.character}</span>}
                                        </div>
                                        {item.description && (
                                            <p className="item-note" style={{ borderLeft: `3px solid ${displayTypeColor}` }}>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button 
                                        className="action-btn edit-btn" 
                                        onClick={(e) => handleEdit(item, e)} 
                                        style={{ color: displayTypeColor, borderColor: displayTypeColor }}
                                        aria-label='edit content'
                                    >
                                        <EditIcon />
                                    </button>
                                    <button 
                                        className="action-btn delete-btn" 
                                        onClick={(e) => handleDelete(item._id, e)} 
                                        style={{ color: displayTypeColor, borderColor: displayTypeColor }}
                                        aria-label='delete button'
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button 
                className="fab-add-btn" 
                onClick={handleAddNew} 
                style={{ background: displayTypeColor, color: foreColor }}
                aria-label='add new product'
            >
                <PlusIcon />
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div 
                        className="modal-content" 
                        onClick={e => e.stopPropagation()}
                        style={{ border: `2px solid ${displayTypeColor}`, color: displayTypeColor }}
                    >
                        <h2>Add New Item</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <input name="name" placeholder="Name *" value={formData.name} onChange={handleInputChange} required style={{ borderColor: displayTypeColor }} />
                            <div className="form-row">
                                <input name="category" placeholder="Category (e.g. Badge)" value={formData.category} onChange={handleInputChange} style={{ borderColor: displayTypeColor }} />
                                <input type="number" name="quantity" placeholder="Qty" value={formData.quantity} onChange={handleInputChange} style={{ borderColor: displayTypeColor }} />
                            </div>
                            <div className="form-row">
                                <input name="character" placeholder="Character" value={formData.character} onChange={handleInputChange} style={{ borderColor: displayTypeColor }} />
                                <input name="ip" placeholder="Series / IP" value={formData.ip} onChange={handleInputChange} style={{ borderColor: displayTypeColor }} />
                            </div>
                            <div className="file-input-wrapper" style={{ border: `1px solid ${displayTypeColor}`, borderRadius: '8px', padding: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    Upload Image (Max 15MB)
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    style={{ fontSize: '0.9rem' }}
                                />
                                {formData.imageURL && (
                                    <div style={{ marginTop: '10px', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ccc' }}>
                                        <img src={formData.imageURL} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ borderColor: displayTypeColor }} rows="3" />
                            
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} style={{ color: displayTypeColor }}>Cancel</button>
                                <button type="submit" style={{ background: displayTypeColor, color: foreColor }}>Add Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductPage;