import React, { useMemo, useCallback, useState } from "react";
import { Card, Button, Badge, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import LoginFormComponent from "../auth/LoginFormComponent";
import "./EstablishmentSidebar.css";

export default function EstablishmentSidebar({
  establishment,
  imageUrl,
  handleImgError,
  navigate,
  openSchedulePopup,
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingEmployer, setPendingEmployer] = useState(null);

  const isAuthenticated = () => !!localStorage.getItem("token");

  const handleScheduleClick = (emp) => {
    if (!isAuthenticated()) {
      setPendingEmployer(emp);
      setShowLoginModal(true);
      return;
    }
    openSchedulePopup(emp);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingEmployer) {
      setTimeout(() => {
        openSchedulePopup(pendingEmployer);
        setPendingEmployer(null);
      }, 300);
    }
  };

  const isValid = useCallback(
    (v) =>
      v !== null &&
      v !== undefined &&
      v !== "" &&
      v !== "null" &&
      !(typeof v === "number" && isNaN(v)),
    []
  );

  const employers = useMemo(
    () => establishment?.employers?.filter((emp) => emp?.user) || [],
    [establishment]
  );

  if (!establishment) return <div className="sidebar-loading-skeleton"></div>;

  return (
    <>
      <div className="est-sidebar">
        {employers.length > 0 && (
          <Card className="est-card">
            <Card.Header className="d-flex align-items-center justify-content-between">
              <span>💈 Colaboradores</span>
              <Badge bg="info" className="px-2 py-1">
                {employers.length}
              </Badge>
            </Card.Header>
            <Card.Body>
              {employers.map((emp) => {
                const u = emp.user || {};
                const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim();
                if (!isValid(fullName)) return null;
                return (
                  <div key={emp.id} className="est-employee-card mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className="d-flex align-items-center flex-grow-1 cursor-pointer"
                        onClick={() =>
                          u.user_name
                            ? navigate(`/employer/view/${u.user_name}`)
                            : null
                        }
                      >
                        <div className="position-relative me-3">
                          <div className="est-avatar-frame">
                            {isValid(u.avatar) ? (
                              <img
                                src={imageUrl(u.avatar)}
                                onError={handleImgError}
                                className="est-avatar-img"
                                alt={fullName}
                              />
                            ) : (
                              <div className="est-avatar-placeholder">
                                {u.first_name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          <div
                            className={`est-status-dot ${
                              emp.is_available ? "online" : "offline"
                            }`}
                          ></div>
                        </div>

                        <div>
                          <div className="fw-semibold text-light fs-6">
                            {fullName}
                          </div>

                          {isValid(emp.role) && (
                            <div className="text-info small">{emp.role}</div>
                          )}

                          <div className="text-secondary small mt-1">
                            👁️ {emp.total_views || 0} visualizações • 👤{" "}
                            {emp.unique_users || 0} usuários únicos
                          </div>

                          {emp.total_appointments > 0 && (
                            <div className="text-success small">
                              💇 {emp.total_appointments} atendimentos realizados
                            </div>
                          )}

                          {u.about && (
                            <div className="text-secondary small mt-1 text-truncate">
                              {u.about}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline-warning"
                        title="Agendar horário"
                        className="est-employee-btn"
                        onClick={() => handleScheduleClick(emp)}
                      >
                        Agendar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        )}
      </div>

      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
        size="md"
        backdrop="static"
        className="login-modal"
      >
        <Modal.Body className="bg-dark text-light p-4 rounded-3">
          <h5 className="text-center mb-3">Faça login para continuar</h5>
          <LoginFormComponent onSuccess={handleLoginSuccess} />
        </Modal.Body>
      </Modal>
    </>
  );
}

EstablishmentSidebar.propTypes = {
  establishment: PropTypes.object,
  imageUrl: PropTypes.func.isRequired,
  handleImgError: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  openSchedulePopup: PropTypes.func.isRequired,
};
