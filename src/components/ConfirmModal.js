import React from "react";

function ConfirmModal({ message, onConfirm, onCancel, show }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header bg-warning">
            <h5 className="modal-title">Xác nhận</h5>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Hủy
            </button>
            <button className="btn btn-warning" onClick={onConfirm}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
