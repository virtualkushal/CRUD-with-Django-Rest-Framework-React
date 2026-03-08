import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(() => {
    axios.get("http://127.0.0.1:8000/api/items/")
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId === null) {
      axios.post("http://127.0.0.1:8000/api/items/create/", { name, quantity })
        .then(() => {
          setName("");
          setQuantity(1);
          fetchItems();
        })
        .catch(err => console.log(err));
    } else {
      axios.put(`http://127.0.0.1:8000/api/items/${editId}/update/`, { name, quantity })
        .then(() => {
          setName("");
          setQuantity(1);
          setEditId(null);
          fetchItems();
        })
        .catch(err => console.log(err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://127.0.0.1:8000/api/items/${id}/delete/`)
        .then(() => fetchItems())
        .catch(err => console.log(err));
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setQuantity(item.quantity);
    setEditId(item.id);
  };

  const handleCancel = () => {
    setName("");
    setQuantity(1);
    setEditId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container">
      <h1>🛒 Grocery List</h1>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Item Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          min="1" 
          required 
        />
        <button type="submit">{editId ? "Update" : "Add Item"}</button>
        {editId && (
          <button type="button" className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>No items in your grocery list yet!</p>
          <p>Add some items above 👆</p>
        </div>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">Quantity: {item.quantity}</span>
                <span className="item-date">{formatDate(item.created_at)}</span>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button className="cancel" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

