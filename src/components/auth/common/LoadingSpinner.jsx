const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <p className="mb-0">{text}</p>
    </div>
  );
};

export default LoadingSpinner;