function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">!</div>

      <h2>Something went wrong</h2>

      <p>{message}</p>

      <button
        type="button"
        className="retry-button"
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  );
}

export default ErrorMessage;