export default function Loading() {
  return (
    <div className="loading-spinner">
      <style>{`
        .loading-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #09f;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `}</style>
      <div className="spinner"></div>
    </div>
  );
}
