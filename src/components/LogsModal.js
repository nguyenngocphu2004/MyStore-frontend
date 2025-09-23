import { Modal, Button } from "react-bootstrap"; // hoặc dùng bootstrap đơn giản

function LogsModal({ show, onClose, logs }) {
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Lịch sử chỉnh sửa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {logs.length === 0 ? (
          <p>Chưa có chỉnh sửa nào</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Số lượng cũ</th>
                <th>Số lượng mới</th>
                <th>Giá cũ</th>
                <th>Giá mới</th>
                <th>Người sửa</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.old_quantity ?? "-"}</td>
                  <td>{log.new_quantity ?? "-"}</td>
                  <td>{log.old_price ? log.old_price.toLocaleString() + " đ" : "-"}</td>
                  <td>{log.new_price ? log.new_price.toLocaleString() + " đ" : "-"}</td>
                  <td>{log.username}</td>
                  <td>{new Date(log.created_at).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogsModal;
