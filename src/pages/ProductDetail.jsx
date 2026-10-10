
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import fallbackProducts from "../product";

const API_URL = "https://fakestoreapi.noksha.dev/api/products";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setProduct(null);
    setUsingFallback(false);

    try {
      // Use the SAME API as ProductList.jsx
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch products");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid product data");
      }

      // Find the exact product that was clicked
      const selectedProduct = data.find(
        (item) => String(item.id) === String(id)
      );

      setProduct(selectedProduct || null);
    } catch (error) {
      console.warn("Product API unavailable:", error);

      // Use local products only when the API fails
      const selectedProduct = fallbackProducts.find(
        (item) => String(item.id) === String(id)
      );

      setProduct(selectedProduct || null);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <main className="product-detail-page">
        <Loader />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>Sorry, this product could not be found.</p>
          <Link to="/" className="back-button">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <Link to="/" className="back-button">
        ← Back to Products
      </Link>

      {usingFallback && (
        <div className="fallback-notice">
          Showing demo product data because the API is
          temporarily unavailable.
        </div>
      )}

      <section className="product-detail-card">
        <div className="detail-image-container">
          <img
            src={product.image}
            alt={product.title}
            className="detail-image"
          />
        </div>

        <div className="detail-content">
          <span className="detail-category">
            {product.category}
          </span>

          <h1 className="detail-title">
            {product.title}
          </h1>

          <p className="detail-price">
            ${Number(product.price).toFixed(2)}
          </p>

          <div className="detail-divider" />

          <h2>Description</h2>

          <p className="detail-description">
            {product.description}
          </p>

          <Link
            to="/"
            className="detail-back-button"
          >
            ← Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
