// src/components/GlobalNav.jsx
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../App";
import useImageUtils from "../hooks/useImageUtils";
import CitySelectorModal from "./CitySelectorModal";
import ProcessingIndicatorComponent from "./ProcessingIndicatorComponent";

import "./GlobalNav.css";

export default function GlobalNav({ loadingMenu, handleLogout }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [processing, setProcessing] = useState(false);
  const isAuthed = !!user;

  const fullName = useMemo(() => {
    if (!user) return "Minha conta";
    const fn = (user.first_name || "").trim();
    const ln = (user.last_name || "").trim();
    return (
      `${fn} ${ln}`.trim() ||
      user.name ||
      user.username ||
      user.email ||
      "Minha conta"
    );
  }, [user]);

  const { imageUrl, handleImgError, placeholderSvg } = useImageUtils({
    fallbackText: fullName,
    fallbackShape: "round",
  });

  const avatarSrc = useMemo(() => {
    const raw =
      user?.images?.avatar ||
      user?.images?.profile ||
      user?.avatar ||
      null;

    return imageUrl(raw) || placeholderSvg || "/images/user.png";
  }, [user, imageUrl, placeholderSvg]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const closeAll = () => {
    setUserMenuOpen(false);
  };

  const [showCityModal, setShowCityModal] = useState(false);
  const [currentCity, setCurrentCity] = useState(
    localStorage.getItem("selectedCity")
  );
  const [currentUF, setCurrentUF] = useState(
    localStorage.getItem("selectedUF")
  );

  const handleSelectCity = ({ city, uf }) => {
    localStorage.setItem("selectedCity", city);
    localStorage.setItem("selectedUF", uf);
    setCurrentCity(city);
    setCurrentUF(uf);
    setShowCityModal(false);
  };

  const locationText =
    currentCity && currentUF
      ? `${currentCity} / ${currentUF}`
      : "Localização não definida";

  const onLogout = async () => {
    setProcessing(true);

    try {
      if (handleLogout) {
        await handleLogout();
      }
    } catch {
      // O logout local continua mesmo se a API falhar.
    } finally {
      localStorage.clear();
      closeAll();
      window.dispatchEvent(new Event("authChanged"));
      window.location.replace("/login");
    }
  };

  useEffect(() => closeAll(), [location.pathname]);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const navIsLoading = !!loadingMenu;

  if (processing) {
    return (
      <ProcessingIndicatorComponent
        gifSrc="/images/logo.gif"
        minDuration={0}
      />
    );
  }

  return (
    <>
      <header className="inkapnav">
        <div className="inkapnav__bar">
          <div className="inkapnav__left">
            <Link to="/" className="inkapnav__brand">
              <img
                src="/images/logo.png"
                alt="Logo Inkap"
                className="inkapnav__logo"
              />
            </Link>

            <nav className="inkapnav__links">
              <Link to="/establishments" className="inkapnav__link">
                Estabelecimentos
              </Link>
              <Link to="/employers" className="inkapnav__link">
                Profissionais
              </Link>
              <Link to="/item/services" className="inkapnav__link">
                Serviços
              </Link>
              <Link to="/item/products" className="inkapnav__link">
                Produtos
              </Link>
            </nav>

            <div className="inkapnav__locationWrap">
              <div className="inkapnav__location">
                <span className="inkapnav__locationDot" />
                <span className="inkapnav__locationText">{locationText}</span>
              </div>

              <button
                className="inkapnav__changeCityBtn"
                onClick={() => setShowCityModal(true)}
              >
                Trocar cidade
              </button>
            </div>
          </div>

          <div className="inkapnav__right">
            {!navIsLoading && !isAuthed && (
              <div className="inkapnav__authActions">
                <Link
                  to="/login"
                  className="inkapnav__btn inkapnav__btn--ghost"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="inkapnav__btn inkapnav__btn--primary"
                >
                  Criar conta
                </Link>
              </div>
            )}

            {!navIsLoading && isAuthed && (
              <div className="inkapnav__user" ref={userMenuRef}>
                <button
                  className="inkapnav__userBtn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                >
                  <img
                    src={avatarSrc}
                    alt={fullName}
                    className="inkapnav__avatar"
                    onError={handleImgError}
                  />
                  <span className="inkapnav__userName">{fullName}</span>
                </button>

                {userMenuOpen && (
                  <div className="inkapnav__userMenu">
                    <Link
                      to="/user/update"
                      className="inkapnav__userMenuItem"
                      onClick={closeAll}
                    >
                      Meus dados
                    </Link>

                    <div className="inkapnav__divider" />

                    <Link
                      to="/order/my"
                      className="inkapnav__userMenuItem"
                      onClick={closeAll}
                    >
                      Meus agendamentos
                    </Link>

                    <div className="inkapnav__divider" />

                    <Link
                      to="/establishment/my"
                      className="inkapnav__userMenuItem"
                      onClick={closeAll}
                    >
                      Meus estabelecimentos
                    </Link>

                    <Link
                      to="/establishment/create"
                      className="inkapnav__userMenuItem"
                      onClick={closeAll}
                    >
                      Criar estabelecimento
                    </Link>

                    <div className="inkapnav__divider" />

                    <Link
                      to="/employer/dashboard"
                      className="inkapnav__userMenuItem"
                      onClick={closeAll}
                    >
                      Área do colaborador
                    </Link>

                    <div className="inkapnav__divider" />

                    <Link
                      to="/dashboard"
                      className="inkapnav__userMenuItem"
                      onClick={closeAll}
                    >
                      Dashboard
                    </Link>

                    <button
                      className="inkapnav__userMenuItem inkapnav__logout"
                      onClick={onLogout}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <CitySelectorModal
        user={user || {}}
        show={showCityModal}
        onClose={() => setShowCityModal(false)}
        onSelectCity={handleSelectCity}
      />
    </>
  );
}

GlobalNav.propTypes = {
  loadingMenu: PropTypes.bool,
  handleLogout: PropTypes.func,
};
