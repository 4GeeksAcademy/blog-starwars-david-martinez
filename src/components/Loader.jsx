export const Loader = ({ text = "Loading Star Wars data..." }) => (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ minHeight: "50vh" }}
  >
    <div className="spinner-border text-warning" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 mb-0 text-white">{text}</p>
  </div>
);
