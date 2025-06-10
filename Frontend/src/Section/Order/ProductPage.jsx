import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Filter,
  Grid,
  List,
  Star,
} from "lucide-react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import "../Order/ProductPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Mock product data
// const mockProducts = [
//   {
//     id: 1,
//     name: "iPhone 14 Pro",
//     price: 999.99,
//     stock: 25,
//     image:
//       "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
//     category: "Electronics",
//     brand: "Apple",
//     rating: 4.8,
//   },
//   {
//     id: 2,
//     name: "Nike Air Max 270",
//     price: 129.99,
//     stock: 50,
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
//     category: "Footwear",
//     brand: "Nike",
//     rating: 4.6,
//   },
//   {
//     id: 3,
//     name: 'MacBook Pro 16"',
//     price: 2499.99,
//     stock: 10,
//     image:
//       "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
//     category: "Electronics",
//     brand: "Apple",
//     rating: 4.9,
//   },
//   {
//     id: 4,
//     name: "Levi's 501 Jeans",
//     price: 89.99,
//     stock: 75,
//     image:
//       "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
//     category: "Clothing",
//     brand: "Levi's",
//     rating: 4.4,
//   },
//   {
//     id: 5,
//     name: "Sony WH-1000XM4",
//     price: 349.99,
//     stock: 30,
//     image:
//       "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
//     category: "Electronics",
//     brand: "Sony",
//     rating: 4.7,
//   },
//   {
//     id: 6,
//     name: "Adidas Ultraboost 22",
//     price: 179.99,
//     stock: 40,
//     image:
//       "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
//     category: "Footwear",
//     brand: "Adidas",
//     rating: 4.5,
//   },
//   {
//     id: 7,
//     name: "Samsung Galaxy S23",
//     price: 799.99,
//     stock: 35,
//     image:
//       "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop",
//     category: "Electronics",
//     brand: "Samsung",
//     rating: 4.6,
//   },
//   {
//     id: 8,
//     name: "Calvin Klein Hoodie",
//     price: 79.99,
//     stock: 60,
//     image:
//       "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
//     category: "Clothing",
//     brand: "Calvin Klein",
//     rating: 4.3,
//   },
// ];

const SelectProductsForOrder = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);

  const returnPath = location.state?.returnTo || "/orderdash";

  const categories = [...new Set(allProducts.map((p) => p.category))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetProductDetails");
        if (res.data.data && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((item) => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
            stock: 100, // Use actual stock if your backend sends it, otherwise default
            image: "https://via.placeholder.com/150", // Or use item.product_image if exists
            category: item.category,
            brand: "Generic", // Use actual brand if available
            rating: 4.5, // Default or fetched from backend
          }));

          setAllProducts(formatted);
          setFilteredProducts(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch product data:", err);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  React.useEffect(() => {
    let filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, allProducts]);

  const addToOrder = (product) => {
    const existing = selectedProducts.find((p) => p.id === product.id);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id
            ? { ...p, quantity: Math.min(p.quantity + 1, product.stock) }
            : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    } else {
      const product = allProducts.find((p) => p.id === productId);
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === productId
            ? { ...p, quantity: Math.min(newQuantity, product.stock) }
            : p
        )
      );
    }
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  const handleAddOrder = () => {
    const orderDetails = {
      items: selectedProducts,
      totalItems: getTotalItems(),
      totalAmount: getTotalAmount().toFixed(2),
    };

    console.log(orderDetails);

    navigate(returnPath, { state: { newProduct: orderDetails } });
  };
  const renderGridCard = (product) => {
    const selectedProduct = selectedProducts.find((p) => p.id === product.id);
    const isSelected = !!selectedProduct;

    return (
      <div
        key={product.id}
        className={`product-card ${isSelected ? "selected" : ""}`}
      >
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          {product.stock < 10 && (
            <span className="low-stock-badge">Low Stock</span>
          )}
        </div>

        <div className="product-content">
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-brand">
              {product.brand} • {product.category}
            </p>
          </div>

          <div className="product-rating">
            <Star className="star-icon" size={16} />
            <span className="rating-text">{product.rating}</span>
            <span className="divider">•</span>
            <span className="stock-text">{product.stock} in stock</span>
          </div>

          <div className="product-footer">
            <span className="product-price">{product.price}</span>

            {!isSelected ? (
              <button
                onClick={() => addToOrder(product)}
                disabled={product.stock === 0}
                className="add-button"
              >
                <Plus size={16} />
                Add
              </button>
            ) : (
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    updateQuantity(product.id, selectedProduct.quantity - 1)
                  }
                  className="quantity-btn remove"
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-display">
                  {selectedProduct.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(product.id, selectedProduct.quantity + 1)
                  }
                  disabled={selectedProduct.quantity >= product.stock}
                  className="quantity-btn add"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderListCard = (product) => {
    const selectedProduct = selectedProducts.find((p) => p.id === product.id);
    const isSelected = !!selectedProduct;

    return (
      <div
        key={product.id}
        className={`list-card ${isSelected ? "selected" : ""}`}
      >
        <div className="list-card-content">
          <img src={product.image} alt={product.name} className="list-image" />

          <div className="list-info">
            <h3 className="list-product-name">{product.name}</h3>
            <p className="list-product-brand">
              {product.brand} • {product.category}
            </p>
            <div className="list-rating">
              <Star className="star-icon" size={16} />
              <span className="rating-text">{product.rating}</span>
              <span className="divider">•</span>
              <span className="stock-text">{product.stock} in stock</span>
            </div>
          </div>

          <div className="list-actions">
            <div className="list-price">{product.price}</div>

            <div className="list-controls">
              {!isSelected ? (
                <button
                  onClick={() => addToOrder(product)}
                  disabled={product.stock === 0}
                  className="add-button"
                >
                  <Plus size={16} />
                  Add
                </button>
              ) : (
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateQuantity(product.id, selectedProduct.quantity - 1)
                    }
                    className="quantity-btn remove"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="quantity-display">
                    {selectedProduct.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(product.id, selectedProduct.quantity + 1)
                    }
                    disabled={selectedProduct.quantity >= product.stock}
                    className="quantity-btn add"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="app-container">
        <div className="main-container">
          {/* Header */}
          <div className="header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div>
    <h1 className="main-title">Select Products for Order</h1>
    <p className="subtitle">Choose products to add to your order</p>
  </div>

  <button
    onClick={() => navigate(-1)}
    className="back-button"
    style={{
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer"
    }}
  >
    ← Back
  </button>
</div>


          <div className="content-grid">
            {/* Main Content */}
            <div className="main-content">
              {/* Search and Filters */}
              <div className="filter-section">
                <div className="filter-controls">
                  <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <div className="view-controls">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`view-btn ${
                        viewMode === "grid" ? "active" : ""
                      }`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`view-btn ${
                        viewMode === "list" ? "active" : ""
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div
                className={
                  viewMode === "grid" ? "products-grid" : "products-list"
                }
              >
                {filteredProducts.map((product) =>
                  viewMode === "grid"
                    ? renderGridCard(product)
                    : renderListCard(product)
                )}
              </div>

              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <Search size={48} className="no-products-icon" />
                  <h3 className="no-products-title">No products found</h3>
                  <p className="no-products-text">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="sidebar">
              <div className="order-summary">
                <div className="summary-header">
                  <ShoppingCart className="cart-icon" size={24} />
                  <h2 className="summary-title">Order Summary</h2>
                  {getTotalItems() > 0 && (
                    <span className="item-count">{getTotalItems()}</span>
                  )}
                </div>

                {selectedProducts.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart size={48} className="empty-cart-icon" />
                    <p className="empty-cart-text">No products selected</p>
                  </div>
                ) : (
                  <div className="cart-content">
                    <div className="selected-products">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="summary-item">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="summary-image"
                          />
                          <div className="summary-details">
                            <h4 className="summary-name">{product.name}</h4>
                            <p className="summary-price">
                              {product.price} × {product.quantity}
                            </p>
                          </div>
                          <div className="summary-total">
                            {(product.price * product.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="summary-totals">
                      <div className="total-row">
                        <span className="total-label">Total Items:</span>
                        <span className="total-value">{getTotalItems()}</span>
                      </div>
                      <div className="total-row final">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-value">
                          {getTotalAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      className="create-order-btn"
                      onClick={handleAddOrder}
                    >
                      Add Order
                    </button>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default SelectProductsForOrder;
