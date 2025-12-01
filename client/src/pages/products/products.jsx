import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import './products.css';

function ProductPage() {
    const { typeColor, foreColor } = useOutletContext();
    // state to hold products
    const [products, setproducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // form state
    const [formData, setFormData] = useState({
        name: '',
        imageURL: '',
        category: '',
        character: '',
        ip: '',
        quantity: 0,
        description: ''
    });

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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    // POST new product to server
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Product added successfully!');
                fetchProducts(); // refresh product list
                setFormData({
                    name: '',
                    imageURL: '',
                    category: '',
                    character: '',
                    ip: '',
                    quantity: 0,
                    description: ''
                });
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        } 
    };

    // DELETE product by id
    const handleDelete = async (id) => {
        if(!window.confirm('delete?')) return;
        try {
            await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
            fetchProducts(); // 刷新列表
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // input styles
    const inputStyle = {
        padding: '8px',
        borderRadius: '8px',
        border: `1px solid ${typeColor}`,
        background: 'rgba(255,255,255,0.8)',
        outline: 'none',
        width: '100%'
    };

return (
    <div className="product-page-container" style={{ width: '100%', height: '100%' }}>
      
      <Sidebar activePage="products" typeColor={typeColor} foreColor={foreColor} />

      <div className="content" style={{ 
          marginLeft: '100px', 
          padding: '40px',
          height: '100%',
          overflowY: 'auto' 
      }}>
        <h1 style={{ color: typeColor, fontSize: '2.5rem', marginBottom: '20px' }}>
          My Collection
        </h1>

        {/* --- 添加区域 (表单) --- */}
        <div style={{ 
            marginBottom: '40px', 
            padding: '20px', 
            border: `2px dashed ${typeColor}`, 
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.4)'
        }}>
          <h3 style={{ color: typeColor, marginBottom: '15px' }}>Add New Item</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input name="name" placeholder="名称 (Name)" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
            <input name="category" placeholder="类别 (Category: 吧唧/立牌...)" value={formData.category} onChange={handleInputChange} style={inputStyle} />
            <input name="character" placeholder="角色 (Character)" value={formData.character} onChange={handleInputChange} style={inputStyle} />
            <input name="ip" placeholder="作品/IP" value={formData.ip} onChange={handleInputChange} style={inputStyle} />
            <input name="imageURL" placeholder="图片URL (Image Link)" value={formData.imageURL} onChange={handleInputChange} style={inputStyle} />
            <input type="number" name="quantity" placeholder="数量" value={formData.quantity} onChange={handleInputChange} style={inputStyle} />
            <input name="description" placeholder="备注 (Note)" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
            
            <button type="submit" style={{ 
              gridColumn: 'span 2', 
              padding: '10px', 
              background: typeColor, 
              color: foreColor, 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Add to Collection
            </button>
          </form>
        </div>
        
        {/* --- 展示区域 (列表) --- */}
        {loading ? (
          <p style={{ color: typeColor }}>Loading...</p>
        ) : (
          <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px',
              paddingBottom: '50px' 
          }}>
            {products.map(item => (
              <div key={item._id} style={{ 
                background: 'rgba(255,255,255,0.6)', 
                backdropFilter: 'blur(5px)',
                border: `2px solid ${typeColor}`,
                borderRadius: '15px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative'
              }}>
                {/* 如果有图片就显示图片 */}
                {item.imageUrl && (
                    <div style={{ width: '100%', height: '150px', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#ddd' }}>
                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                )}
                
                <h3 style={{ color: typeColor, margin: 0 }}>{item.name}</h3>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    <p>IP: {item.ip} / Char: {item.character}</p>
                    <p>Type: {item.category} | Qty: {item.quantity}</p>
                    {item.note && <p style={{ fontStyle: 'italic', marginTop: '5px' }}>"{item.note}"</p>}
                </div>

                <button 
                  onClick={() => handleDelete(item._id)}
                  style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    background: 'red', color: 'white', border: 'none', 
                    borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' 
                  }}
                >
                    ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;