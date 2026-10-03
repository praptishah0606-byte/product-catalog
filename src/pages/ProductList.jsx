import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import fallbackProducts from "../product";

const API_URL =
  "https://fakestoreapi.noksha.dev/api/products";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setUsingFallback(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid product data received.");
      }

      setProducts(data);
    } catch (error) {
      console.warn(
        "Product API is unavailable. Using fallback products.",
        error
      );

      setProducts(fallbackProducts);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <main className="products-page">
      {/* HEADER */}

      <section className="products-header">
        <div>
          <p className="eyebrow">OUR COLLECTION</p>

          <h1>Product Catalog</h1>

          <p className="products-subtitle">
            Explore our collection of quality products.
          </p>
        </div>

        {!loading && (
          <span className="product-count">
            {filteredProducts.length} Products
          </span>
        )}
      </section>

      {/* SEARCH AND CATEGORY */}

      <section className="product-filters">
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="category-box">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category === "all"
                  ? "All Categories"
                  : category}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* FALLBACK MESSAGE */}

      {usingFallback && !loading && (
        <div className="fallback-notice">
          Demo data is being displayed because the
          product API is temporarily unavailable.
        </div>
      )}

      {/* LOADING */}

      {loading && <Loader />}

      {/* PRODUCTS */}

      {!loading && filteredProducts.length > 0 && (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </section>
      )}

      {/* NO PRODUCTS */}

      {!loading && filteredProducts.length === 0 && (
        <div className="no-products">
          <div className="no-products-icon">
            ⌕
          </div>

          <h2>No products found</h2>

          <p>
            Try a different search term or category.
          </p>

          <button
            type="button"
            className="clear-filters-button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}

export default ProductList;