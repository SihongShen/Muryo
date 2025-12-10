import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import './events.css';

const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const ChevronDown = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>);

// static data for displaying
const MOCK_EVENTS = [
    {
        id: 1,
        name: 'Comiket 103',
        date: '2023-12-30',
        location: 'Tokyo Big Sight',
        swaps: [
            { 
                id: 101,
                partner: 'Nekobox', 
                contact: 'Twitter', 
                item: [
                    { name: 'Miku Badge', qty: 2 },
                    { name: 'Sticker Set', qty: 1 }
                ], 
                packed: true 
            },
            { id: 102, partner: 'Ghost', contact: 'WeChat', item: [ {name: 'Sticker Set', qty: 1}], packed: false }
        ]
    },
    {
        id: 2,
        name: 'CP 30',
        date: '2024-12-27',
        location: 'Shanghai',
        swaps: []
    }
];

function EventsPage() {
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

    const [events, setEvents] = useState(MOCK_EVENTS);
    const [products, setProducts] = useState([]);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [tempItems, setTempItems] = useState([]);
    const [addingEventId, setAddingEventId] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);

    // get actual products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/products'); 
                // const res = await fetch('/api/products'); 
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products for dropdown");
            }
        };
        fetchProducts();
    }, []);

    // calculate dates
    const getDaysLeft = (dateString) => {
        const diff = new Date(dateString) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    // expand icon
    const toggleExpand = (id) => {
        setExpandedEventId(expandedEventId === id ? null : id);
        setAddingEventId(null);
        setTempItems([]);
    };

    // add btn
    const toggleAddMode = (id, e) => {
        if(e) e.stopPropagation();
        if (addingEventId === id) {
            setAddingEventId(null);
            setTempItems([]);
        } else {
            setAddingEventId(id);
            setTempItems([]);
        }
    };

    // add products to temp area
    const handleAddItemToDraft = (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const formData = new FormData(form);
        
        const productName = formData.get('product');
        const qty = formData.get('qty');

        if (!productName || !qty) return;

        setTempItems(prev => [...prev, { name: productName, qty: qty }]);
        
        form.querySelector('[name="product"]').value = "";
        form.querySelector('[name="qty"]').value = "";
    };

    // confirm info
    const handleConfirmSwap = (eventId, e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        if (!formData.get('partner') || tempItems.length === 0) {
            alert("Please enter a name and add at least one item.");
            return;
        }

        const newSwap = {
            id: Date.now(),
            partner: formData.get('partner'),
            contact: formData.get('contact'),
            item: tempItems,
            packed: false
        };

        // uodate Events state
        setEvents(prev => prev.map(ev => {
            if (ev.id === eventId) {
                return { ...ev, swaps: [...ev.swaps, newSwap] };
            }
            return ev;
        }));
        
        // reset
        setAddingEventId(null);
        setTempItems([]);
        form.reset();
    };

    // exchanged state
    const togglePacked = (eventId, swapId) => {
        setEvents(prev => prev.map(ev => {
            if (ev.id === eventId) {
                const updatedSwaps = ev.swaps.map(s => 
                    s.id === swapId ? { ...s, packed: !s.packed } : s
                );
                return { ...ev, swaps: updatedSwaps };
            }
            return ev;
        }));
    };

    // add new event
    const handleAddNewEvent = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const newEvent = {
            id: Date.now(),
            name: formData.get('name'),
            date: formData.get('date'),
            location: formData.get('location'),
            swaps: []
        };

        setEvents(prev => [newEvent, ...prev]);
        setShowEventModal(false);
    };

    return (
        <div className="product-page-wrapper">
            <div className="glass-background-layer" />
            <Sidebar activePage="events" typeColor={displayTypeColor} foreColor={foreColor} />

            <div className="main-content">
                <header className="page-header">
                    <h1 style={{ color: displayTypeColor }}>Event Schedule</h1>
                    <span className="count-badge" style={{ borderColor: displayTypeColor, color: displayTypeColor }}>
                        {events.length} Upcoming
                    </span>
                </header>

                <div className="product-list-container">
                    {events.map(event => (
                        <div key={event.id} className={`event-card ${expandedEventId === event.id ? 'expanded' : ''}`} 
                             style={{ borderColor: displayTypeColor, color: displayTypeColor, background: 'rgba(255,255,255,0.6)' }}>
                            
                            <div className="event-main-row" onClick={() => toggleExpand(event.id)}>
                                <div className="countdown-box" style={{ background: displayTypeColor, color: foreColor }}>
                                    <span className="days-num">{getDaysLeft(event.date)}</span>
                                    <span className="days-label">DAYS</span>
                                </div>

                                <div className="event-info">
                                    <h3>{event.name}</h3>
                                    <div className="event-meta">
                                        <span>📅 {event.date}</span>
                                        <span>📍 {event.location}</span>
                                    </div>
                                </div>

                                <div className="expand-icon" style={{ transform: expandedEventId === event.id ? 'rotate(180deg)' : 'rotate(0)' }}>
                                    <ChevronDown />
                                </div>
                            </div>

                            {expandedEventId === event.id && (
                                <div className="swap-section">
                                    <div className="swap-divider" style={{ background: displayTypeColor, opacity: 0.2 }} />
                                    
                                    <div className="swap-section-header">
                                        <h4>Swap List ({event.swaps.length})</h4>
                                        
                                        {addingEventId !== event.id && (
                                            <button 
                                                className="open-add-btn"
                                                onClick={(e) => toggleAddMode(event.id, e)}
                                                style={{ borderColor: displayTypeColor, color: displayTypeColor }}
                                            >
                                                <PlusIcon /> Add People
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="swap-list">
                                        {event.swaps.map(swap => (
                                            <div key={swap.id} className="swap-item" style={{ borderColor: displayTypeColor }}>
                                                <div 
                                                    className={`check-circle ${swap.packed ? 'checked' : ''}`}
                                                    onClick={() => togglePacked(event.id, swap.id)}
                                                    style={{ border: `2px solid ${displayTypeColor}` }}
                                                >
                                                    {swap.packed && <CheckIcon />}
                                                </div>
                                                
                                                <div className="swap-details">
                                                    <div className="swap-header-row">
                                                        <span className="partner-name">{swap.partner}</span>
                                                        <span className="contact-tag" style={{ border: `1px solid ${displayTypeColor}`, opacity: 0.7 }}>{swap.contact}</span>
                                                    </div>
                                                </div>

                                                <div className="swap-items-grid">
                                                        {swap.item.map((it, idx) => (
                                                            <div key={idx} style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                                                • {it.name} <span style={{fontWeight:'bold'}}>x{it.qty}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                            </div>
                                        ))}
                                    </div>

                                    {addingEventId === event.id && (
                                        <form className="add-swap-form-complex visible" onSubmit={(e) => handleConfirmSwap(event.id, e)}>
                                            <div className="form-header-row" style={{justifyContent: 'space-between', display: 'flex'}}>
                                                <span style={{fontWeight: 'bold', fontSize: '0.9rem'}}>New Entry</span>
                                                <span onClick={() => toggleAddMode(event.id)} style={{cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6}}>Cancel</span>
                                            </div>

                                            <div className="form-row-top">
                                                <input name="partner" placeholder="Partner Name" style={{ borderColor: displayTypeColor }} autoFocus />
                                                <select name="contact" style={{ borderColor: displayTypeColor }}>
                                                    <option value="WeChat">WeChat</option>
                                                    <option value="QQ">QQ</option>
                                                    <option value="RED">RedNote</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            {tempItems.length > 0 && (
                                                <div className="draft-items-area" style={{ background: 'rgba(255,255,255,0.4)', borderColor: displayTypeColor }}>
                                                    {tempItems.map((t, i) => (
                                                        <span key={i} className="draft-tag" style={{ border: `1px solid ${displayTypeColor}` }}>{t.name} x{t.qty}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="form-row-bottom">
                                                <select name="product" defaultValue="" style={{ borderColor: displayTypeColor, flex: 2 }}>
                                                    <option value="" disabled>Add Item...</option>
                                                    {products.length > 0 ? products.map(p => <option key={p._id} value={p.name} style={{color:'black'}}>{p.name}</option>) : <option disabled>No items</option>}
                                                </select>
                                                <input name="qty" type="number" placeholder="1" style={{ borderColor: displayTypeColor, width: '60px' }} />
                                                <button type="button" onClick={handleAddItemToDraft} style={{ border: `1px solid ${displayTypeColor}`, color: displayTypeColor, background: 'transparent' }}>+</button>
                                            </div>

                                            <button type="submit" className="confirm-swap-btn" style={{ background: displayTypeColor, color: foreColor }}>Confirm Swap Entry</button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button 
                    className="fab-add-btn" 
                    onClick={() => setShowEventModal(true)} 
                    style={{ background: displayTypeColor, color: foreColor }}
                >
                    <PlusIcon />
                </button>

                {showEventModal && (
                    <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ border: `2px solid ${displayTypeColor}`, color: displayTypeColor }}>
                            <h2>Add New Event</h2>
                            <form onSubmit={handleAddNewEvent} className="modal-form">
                                <input name="name" placeholder="Event Name (e.g. Comiket)" required style={{ borderColor: displayTypeColor }} />
                                <input name="date" type="date" required style={{ borderColor: displayTypeColor }} />
                                <input name="location" placeholder="Location" required style={{ borderColor: displayTypeColor }} />
                                
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowEventModal(false)} style={{ color: displayTypeColor }}>Cancel</button>
                                    <button type="submit" style={{ background: displayTypeColor, color: foreColor }}>Add Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventsPage;