import { useMemo, useState } from 'react';
import { products } from './products.js';
import { getRecommendations } from './api/recommendations.js';

export default function App() {
  const [preference, setPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [lastSource, setLastSource] = useState(null);
  const [error, setError] = useState('');

  const averagePrice = useMemo(() => {
    const total = products.reduce((sum, p) => sum + p.price, 0);
    return Math.round(total / products.length);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!preference.trim()) {
      setError('Tell us a budget, category, or what you care about.');
      return;
    }

    setLoading(true);
    try {
      const result = await getRecommendations(preference, products);
      setRecommendations(result.items);
      setLastSource(result.source);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <header className="stack">
        <div className="panel">
          <h1>Product Choice</h1>
          <p className="lead">
          Enter your budget, product category, or use case to see personalized product recommendations below.
          </p>
          <form onSubmit={onSubmit}>
            <label htmlFor="preference">Your choice</label>
            <textarea
              id="preference"
              placeholder="I want a phone under $500 with a great camera"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Thinking...' : 'Search'}
            </button>
            {error ? <div className="hint" style={{ color: '#dc2626' }}>{error}</div> : null}

            {/* {lastSource ? (
              <div className="hint">
                Source: <strong>{lastSource}</strong>
              </div>
            ) : null} */}
          </form>
          {recommendations.length > 0 ? (
            <section className="recommendations">
              <h3>Recommended for you</h3>
              <div className="grid">
                {recommendations.map((item) => (
                  <article key={item.id} className="card">

                    <img src={item.image} alt={item.name} className='product-image' />
                    <span className="badge">{item.category}</span>
                    <h3>{item.name}</h3>
                    <div className="price">${item.price}</div>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </header>

      <section className="stack" style={{ marginTop: 24 }}>
        <div className="pill">
          Catalog overview — average price ${averagePrice}
        </div>
        <div className="grid">
          {products.map((product) => (
            <article key={product.id} className="card">
              <img src={product.image} alt={product.name} className='product-image' />
              <span className="badge">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="price">${product.price}</div>
              <p>{product.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
