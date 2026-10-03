import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import fallbackProducts from "../product";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setUsingFallback(false);

      const response = await fetch(
        `https://fakestoreapi.com/products/${id}`
      );

      if (!response.ok) {
        throw new Error(
          `Product request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setProduct(data);
    } catch (error) {
      console.warn(
        "Fake Store API is unavailable. Using fallback product.",
        error
      );

      const fallbackProduct = fallbackProducts.find(
        (item) => item.id === Number(id)
      );

      setProduct(fallbackProduct || null);
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

          <p>
            The product you are looking for does not exist.
          </p>

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
          Demo product data is being displayed because the
          product API is temporarily unavailable.
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

          <div className="detail-divider"></div>

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