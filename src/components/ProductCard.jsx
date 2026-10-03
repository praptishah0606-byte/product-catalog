import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card-link"
      >
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        </div>

        <div className="product-content">
          <span className="product-category">
            {product.category}
          </span>

          <h2 className="product-title">
            {product.title}
          </h2>

          <div className="product-bottom">
            <span className="product-price">
              ${product.price.toFixed(2)}
            </span>

            <span className="view-product">
              View →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;