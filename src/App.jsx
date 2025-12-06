// APP.JSX — SPA Farber Panel Pro (modo cliente + modo interno)
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { DataContextProvider, useData } from "./data.jsx";
import { DataTable } from "./components.jsx";

/* ---------------------------
   AUTH CONTEXT (modo cliente / interno)
---------------------------- */

const AuthContext = React.createContext(null);

function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthContext.Provider");
  }
  return ctx;
}

/* ---------------------------
   HELPERS VISUALES
---------------------------- */

function readableModel(value) {
  if (value === "silla-ergonomica") return "Silla ergonómica";
  if (value === "sillon-gerencial") return "Sillón gerencial";
  if (value === "escritorio") return "Escritorio";
  if (value === "mueble-guardado") return "Mueble de guardado";
  return value;
}

function readableTexture(value) {
  if (value === "blend-faplac") return "Línea Blend Faplac";
  if (value === "melamina-lisa") return "Melamina lisa";
  if (value === "madera") return "Madera / símil madera";
  return value || "Sin textura";
}

/* ---------------------------
   Hook tema
---------------------------- */

function useTheme() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return { theme, toggle };
}

/* ---------------------------
   Login modal simple
---------------------------- */

function LoginDialog({ onClose }) {
  const { login } = useAuth();
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(user, pass);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Acceso interno</h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="modal-body">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label>Usuario</label>
                <input
                  className="input"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Ej: farber"
                />
              </div>
              <div className="field">
                <label>Contraseña</label>
                <input
                  className="input"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••"
                />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit">Iniciar sesión</button>
            </div>
            <p className="helper-text" style={{ marginTop: 8 }}>
              Este acceso es solo para uso interno. Los clientes pueden usar el
              Menú principal y Presupuestos sin iniciar sesión.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Layout general
---------------------------- */

function Layout({ children }) {
  const { toggle } = useTheme();
  const { isAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Farber</h2>

        {/* VISIBLES PARA TODOS */}
        <NavLink
          to="/"
          className={({ isActive }) => "navlink" + (isActive ? " active" : "")}
          end
        >
          <span className="navlink-icon">🛒</span>
          <span className="navlink-label">Menú principal</span>
        </NavLink>

        <NavLink
          to="/budgets"
          className={({ isActive }) => "navlink" + (isActive ? " active" : "")}
        >
          <span className="navlink-icon">📄</span>
          <span className="navlink-label">Presupuestos</span>
        </NavLink>

        {/* SOLO INTERNO (logueado) */}
        {isAdmin && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">📊</span>
              <span className="navlink-label">Dashboard</span>
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">📦</span>
              <span className="navlink-label">Pedidos</span>
            </NavLink>

            <NavLink
              to="/reception"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">📥</span>
              <span className="navlink-label">Recepción</span>
            </NavLink>

            <NavLink
              to="/configurator"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">🎛️</span>
              <span className="navlink-label">Configurador</span>
            </NavLink>

            <NavLink
              to="/clients"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">👥</span>
              <span className="navlink-label">Clientes</span>
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">🗃</span>
              <span className="navlink-label">Gestión de productos</span>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">📈</span>
              <span className="navlink-label">Reportes</span>
            </NavLink>

            <NavLink
              to="/tools"
              className={({ isActive }) =>
                "navlink" + (isActive ? " active" : "")
              }
            >
              <span className="navlink-icon">🧰</span>
              <span className="navlink-label">Utilidades</span>
            </NavLink>
          </>
        )}
      </aside>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <header className="header">
          <div>
            <strong>Farber Panel Pro</strong>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={
                isAdmin ? logout : () => setShowLogin(true)
              }
            >
              {isAdmin ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
            <button className="theme-toggle" onClick={toggle}>
              <span className="theme-toggle__icon">🌞</span>
              <span className="theme-toggle__icon">🌙</span>
            </button>
          </div>
        </header>

        <main className="main">{children}</main>
      </div>

      {showLogin && !isAdmin && (
        <LoginDialog onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

/* ---------------------------
   Dashboard interno
---------------------------- */

function DashboardView() {
  const { budgets, orders, productConfigs, clients, products } = useData();

  const totalBudgets = budgets.length;
  const approved = budgets.filter((b) => b.status === "Aprobado").length;
  const pending = totalBudgets - approved;

  const totalOrders = orders.length;
  const complete = orders.filter((o) => o.status === "Recepción completa")
    .length;
  const partial = orders.filter((o) => o.status === "Recepción parcial").length;
  const pendingOrders = totalOrders - complete - partial;

  const totalBudgetAmount = budgets.reduce(
    (sum, b) => sum + (b.total || 0),
    0
  );

  const formattedTotalBudgetAmount = `$ ${totalBudgetAmount.toLocaleString(
    "es-AR"
  )}`;

  const todayLabel = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-main">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard-sub">
              Estado general de presupuestos, pedidos y catálogo.
            </p>
          </div>

          <div className="dashboard-header-meta">
            <span className="dashboard-tag">Hoy · {todayLabel}</span>
            <span className="dashboard-tag dashboard-tag--soft">
              {clients.length} clientes · {products.length} productos
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>Flujo comercial</h2>
          <div className="cards dashboard-cards">
            <div className="card stat-card stat-card--accent">
              <div className="stat-card__icon">📄</div>
              <div>
                <div className="stat-card__label">Presupuestos</div>
                <div className="stat-card__value">{totalBudgets}</div>
                <div className="stat-card__hint">
                  {approved} aprobados · {pending} pendientes
                </div>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-card__icon">📦</div>
              <div>
                <div className="stat-card__label">Pedidos</div>
                <div className="stat-card__value">{totalOrders}</div>
                <div className="stat-card__hint">
                  {pendingOrders} pendientes · {partial} parciales ·{" "}
                  {complete} completos
                </div>
              </div>
            </div>

            <div className="card stat-card stat-card--muted">
              <div className="stat-card__icon">💰</div>
              <div>
                <div className="stat-card__label">
                  Monto total presupuestado
                </div>
                <div className="stat-card__value">
                  {formattedTotalBudgetAmount}
                </div>
                <div className="stat-card__hint">
                  Suma de todos los presupuestos cargados.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Catálogo y configuraciones</h2>
          <div className="cards dashboard-cards">
            <div className="card stat-card stat-card--ok">
              <div className="stat-card__icon">👥</div>
              <div>
                <div className="stat-card__label">Clientes</div>
                <div className="stat-card__value">{clients.length}</div>
                <div className="stat-card__hint">
                  Último: {clients[clients.length - 1]?.name || "—"}
                </div>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-card__icon">🪑</div>
              <div>
                <div className="stat-card__label">Productos</div>
                <div className="stat-card__value">{products.length}</div>
                <div className="stat-card__hint">
                  Último cargado: {products[0]?.name || "—"}
                </div>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-card__icon">🎛️</div>
              <div>
                <div className="stat-card__label">
                  Configuraciones guardadas
                </div>
                <div className="stat-card__value">
                  {productConfigs.length}
                </div>
                <div className="stat-card__hint">
                  Última: {productConfigs[0]?.name || "—"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------
   Menú principal (público)
---------------------------- */

function MainMenuView() {
  const { products } = useData();
  const [infoProduct, setInfoProduct] = React.useState(null);
  const [selections, setSelections] = React.useState({});

  const isFurniture = (p) => {
    const text = `${p.category || ""} ${p.name || ""}`.toLowerCase();
    return (
      text.includes("mueble") ||
      text.includes("escritorio") ||
      text.includes("silla") ||
      text.includes("sillón") ||
      text.includes("sillon")
    );
  };

  const getSelection = (id) => {
    return (
      selections[id] || {
        color: "#ff0040",
        width: "120",
        depth: "60",
        height: "75",
      }
    );
  };

  const updateSelection = (id, patch) => {
    setSelections((prev) => {
      const current =
        prev[id] || { color: "#ff0040", width: "120", depth: "60", height: "75" };
      return {
        ...prev,
        [id]: { ...current, ...patch },
      };
    });
  };

  const formatPrice = (value) => {
    const n = Number(value || 0);
    if (!n) return "-";
    return `$ ${n.toLocaleString("es-AR")}`;
  };

  return (
    <div>
      <div className="product-view-header">
        <div>
          <h1>Menú principal</h1>
          <p className="product-view-sub">
            Vista pensada para clientes: catálogo de productos, precios de
            referencia y, en el caso de mobiliario, color y medidas de forma
            orientativa. El armado final del pedido lo gestiona el equipo
            interno.
          </p>
        </div>
      </div>

      <div className="product-cards-grid" style={{ marginTop: 16 }}>
        {products.length === 0 ? (
          <p className="config-empty">
            Todavía no cargaste productos. Cargalos desde &quot;Gestión de
            productos&quot; (acceso interno).
          </p>
        ) : (
          products.map((p) => {
            const sel = getSelection(p.id);
            const furniture = isFurniture(p);
            return (
              <article key={p.id} className="card product-card">
                <div className="product-card__image-wrapper">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="product-card__image"
                    />
                  ) : (
                    <div className="product-card__image product-card__image--placeholder">
                      <span className="product-card__placeholder-icon">🪑</span>
                    </div>
                  )}
                  <div className="product-card__badge">
                    {p.category || "Sin categoría"}
                  </div>
                </div>

                <div className="product-card__body">
                  <div className="product-card__title-row">
                    <h3 className="product-card__title">{p.name}</h3>
                    {p.code && (
                      <span className="product-card__code">#{p.code}</span>
                    )}
                  </div>

                  <div className="product-card__price">
                    {formatPrice(p.basePrice)}
                  </div>

                  {furniture && (
                    <div
                      className="form-row"
                      style={{
                        marginTop: 6,
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div className="field">
                        <label>Color de referencia</label>
                        <div className="color-row">
                          <input
                            type="color"
                            className="input"
                            value={sel.color}
                            onChange={(e) =>
                              updateSelection(p.id, { color: e.target.value })
                            }
                          />
                          <span className="color-hex">{sel.color}</span>
                        </div>
                      </div>
                      <div className="field">
                        <label>Medidas (cm)</label>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            fontSize: 11,
                          }}
                        >
                          <input
                            className="input"
                            type="number"
                            min="40"
                            value={sel.width}
                            onChange={(e) =>
                              updateSelection(p.id, { width: e.target.value })
                            }
                            placeholder="Ancho"
                          />
                          <input
                            className="input"
                            type="number"
                            min="40"
                            value={sel.depth}
                            onChange={(e) =>
                              updateSelection(p.id, { depth: e.target.value })
                            }
                            placeholder="Prof."
                          />
                          <input
                            className="input"
                            type="number"
                            min="40"
                            value={sel.height}
                            onChange={(e) =>
                              updateSelection(p.id, { height: e.target.value })
                            }
                            placeholder="Alt."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {p.notes && !furniture && (
                    <p className="product-card__notes">{p.notes}</p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setInfoProduct(p)}
                    >
                      Info
                    </button>
                    <button
                      type="button"
                      disabled
                      title="En el futuro, esto va a permitir armar un pedido."
                      style={{
                        opacity: 0.7,
                        cursor: "not-allowed",
                      }}
                    >
                      Agregar a pedido (próximamente)
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {infoProduct && (
        <div
          className="modal-overlay"
          onClick={() => setInfoProduct(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Información del producto</h2>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setInfoProduct(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="modal-body">
              <div className="printable-budget">
                <header className="print-header">
                  <div>
                    <h1>{infoProduct.name}</h1>
                    <p className="print-subtitle">
                      {infoProduct.category || "Sin categoría definida"}
                    </p>
                  </div>
                  <div className="print-meta">
                    {infoProduct.code && (
                      <div>
                        <span className="print-label">Código</span>
                        <strong>{infoProduct.code}</strong>
                      </div>
                    )}
                    <div style={{ marginTop: 6 }}>
                      <span className="print-label">Precio base</span>
                      <strong>
                        {formatPrice(infoProduct.basePrice)}
                      </strong>
                    </div>
                  </div>
                </header>

                <section className="print-section">
                  <h3>Detalle</h3>
                  <p>{infoProduct.notes || "Sin notas adicionales."}</p>
                </section>

                {infoProduct.imageUrl && (
                  <section className="print-section">
                    <h3>Imagen</h3>
                    <img
                      src={infoProduct.imageUrl}
                      alt={infoProduct.name}
                      style={{
                        maxWidth: "100%",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        marginTop: 8,
                      }}
                    />
                  </section>
                )}

                <section className="print-footer">
                  <p className="print-conditions">
                    Esta ficha es informativa. El pedido y los ajustes finales
                    los realiza el equipo interno de Farber.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   Presupuestos (cliente + interno)
---------------------------- */

function BudgetsView() {
  const {
    clients,
    budgets,
    productConfigs,
    addClient,
    addBudget,
    duplicateBudget,
    addOrderFromBudget,
    updateBudgetStatus,
  } = useData();

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = React.useState("todos");
  const [sortField, setSortField] = React.useState("date");
  const [sortDir, setSortDir] = React.useState("desc");

  const [showForm, setShowForm] = React.useState(false);
  const [clientMode, setClientMode] = React.useState("existing");
  const [selectedClientId, setSelectedClientId] = React.useState(
    clients[0]?.id || ""
  );
  const [newClient, setNewClient] = React.useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [items, setItems] = React.useState([
    { tempId: 1, name: "", qty: 1, unitPrice: 0 },
  ]);

  const [date, setDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );

  const [selectedConfigId, setSelectedConfigId] = React.useState("");

  const [previewBudget, setPreviewBudget] = React.useState(null);

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        tempId: prev.length ? prev[prev.length - 1].tempId + 1 : 1,
        name: "",
        qty: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleChangeRow = (tempId, field, value) => {
    setItems((prev) =>
      prev.map((it) =>
        it.tempId === tempId ? { ...it, [field]: value } : it
      )
    );
  };

  const handleRemoveRow = (tempId) => {
    setItems((prev) => prev.filter((it) => it.tempId !== tempId));
  };

  const handleInsertConfig = () => {
    if (!selectedConfigId) {
      alert("Seleccioná una configuración para insertar.");
      return;
    }

    const cfg = productConfigs.find((c) => c.id === selectedConfigId);
    if (!cfg) return;

    const desc = `${cfg.name} (${readableModel(cfg.model)}, ${
      cfg.fondo === "visto" ? "fondo visto" : "fondo plus"
    }, ${cfg.width}x${cfg.depth}x${cfg.height} cm, ${readableTexture(
      cfg.texture
    )})`;
    setItems((prev) => [
      ...prev,
      {
        tempId: prev.length ? prev[prev.length - 1].tempId + 1 : 1,
        name: desc,
        qty: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleSubmitBudget = (e) => {
    e.preventDefault();

    let clientIdToUse = selectedClientId;

    if (clientMode === "new") {
      if (!newClient.name.trim()) {
        alert("El nombre del cliente es obligatorio.");
        return;
      }
      const created = addClient(newClient);
      clientIdToUse = created.id;
      setSelectedClientId(created.id);
    }

    const cleanItems = items.filter(
      (it) => it.name.trim() && Number(it.qty) > 0
    );

    if (!clientIdToUse) {
      alert("Seleccioná o cargá un cliente.");
      return;
    }
    if (!cleanItems.length) {
      alert("Agregá al menos un ítem al presupuesto.");
      return;
    }

    addBudget({
      clientId: clientIdToUse,
      date,
      items: cleanItems,
    });

    setShowForm(false);
    setItems([{ tempId: 1, name: "", qty: 1, unitPrice: 0 }]);
    setNewClient({ name: "", email: "", phone: "", notes: "" });
    setClientMode("existing");
    setSelectedConfigId("");
  };

  const handleApproveAndCreateOrder = (b) => {
    if (!isAdmin) return;
    updateBudgetStatus(b.id, "Aprobado");
    addOrderFromBudget(b);
    navigate("/orders");
  };

  const handlePrint = () => {
    window.print();
  };

  const processedBudgets = React.useMemo(() => {
    let list = [...budgets];

    if (statusFilter !== "todos") {
      list = list.filter((b) => b.status === statusFilter);
    }

    list.sort((a, b) => {
      let av;
      let bv;

      if (sortField === "date") {
        av = new Date(a.date || a.createdISO || 0).getTime();
        bv = new Date(b.date || b.createdISO || 0).getTime();
      } else if (sortField === "client") {
        av = (a.clientName || "").toLowerCase();
        bv = (b.clientName || "").toLowerCase();
      } else if (sortField === "number") {
        av = a.number || "";
        bv = b.number || "";
      } else {
        av = 0;
        bv = 0;
      }

      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });

    if (sortDir === "desc") list.reverse();

    return list;
  }, [budgets, statusFilter, sortField, sortDir]);

  return (
    <div>
      <h1>Presupuestos</h1>
      <p>
        Podés generar un presupuesto con tus datos y los productos acordados.
        En modo cliente, los precios finales y aprobaciones las gestiona el
        equipo interno.
      </p>

      {!isAdmin && (
        <p className="helper-text" style={{ marginTop: 6 }}>
          Estás en <strong>modo cliente</strong>: los precios unitarios no se
          pueden editar y la aprobación del pedido la realiza Farber.
        </p>
      )}

      {/* Filtros y orden */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className={
              "status-filter-btn" +
              (statusFilter === "todos" ? " active" : "")
            }
            onClick={() => setStatusFilter("todos")}
          >
            Todos
          </button>
          <button
            type="button"
            className={
              "status-filter-btn" +
              (statusFilter === "Pendiente" ? " active" : "")
            }
            onClick={() => setStatusFilter("Pendiente")}
          >
            Pendientes
          </button>
          <button
            type="button"
            className={
              "status-filter-btn" +
              (statusFilter === "Aprobado" ? " active" : "")
            }
            onClick={() => setStatusFilter("Aprobado")}
          >
            Aprobados
          </button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <select
            className="input"
            style={{ maxWidth: 180 }}
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="date">Ordenar por fecha</option>
            <option value="client">Ordenar por cliente</option>
            <option value="number">Ordenar por número</option>
          </select>

          <select
            className="input"
            style={{ maxWidth: 120 }}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div style={{ margin: "16px 0" }}>
        <button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cerrar formulario" : "Nuevo presupuesto"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Nuevo presupuesto</h3>

          <form onSubmit={handleSubmitBudget} className="form">
            <div className="form-row">
              <div className="field">
                <label>Fecha</label>
                <input
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Cliente</label>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ marginRight: 10 }}>
                    <input
                      type="radio"
                      name="clientMode"
                      value="existing"
                      checked={clientMode === "existing"}
                      onChange={() => setClientMode("existing")}
                    />{" "}
                    Existente
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="clientMode"
                      value="new"
                      checked={clientMode === "new"}
                      onChange={() => setClientMode("new")}
                    />{" "}
                    Nuevo
                  </label>
                </div>

                {clientMode === "existing" ? (
                  <select
                    className="input"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="form-row">
                    <div className="field">
                      <label>Nombre</label>
                      <input
                        className="input"
                        value={newClient.name}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input
                        className="input"
                        value={newClient.email}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Teléfono</label>
                      <input
                        className="input"
                        value={newClient.phone}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BLOQUE: configuraciones del configurador */}
            <div className="form-row">
              <div className="field">
                <label>Insertar configuración del configurador</label>
                {productConfigs.length === 0 ? (
                  <p className="helper-text">
                    Todavía no hay configuraciones guardadas. Crealas desde la
                    pestaña &quot;Configurador&quot; (acceso interno).
                  </p>
                ) : (
                  <div className="config-insert-row">
                    <select
                      className="input"
                      value={selectedConfigId}
                      onChange={(e) => setSelectedConfigId(e.target.value)}
                    >
                      <option value="">Elegir configuración...</option>
                      {productConfigs.map((cfg) => (
                        <option key={cfg.id} value={cfg.id}>
                          {cfg.name} · {readableModel(cfg.model)} ·{" "}
                          {cfg.fondo === "visto"
                            ? "Fondo visto"
                            : "Fondo plus"}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleInsertConfig}
                    >
                      Insertar en ítems
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Ítems del presupuesto</label>

                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it) => (
                        <tr key={it.tempId}>
                          <td>
                            <input
                              className="input"
                              value={it.name}
                              onChange={(e) =>
                                handleChangeRow(
                                  it.tempId,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="input"
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={(e) =>
                                handleChangeRow(
                                  it.tempId,
                                  "qty",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="input"
                              type="number"
                              min="0"
                              value={it.unitPrice}
                              onChange={(e) =>
                                handleChangeRow(
                                  it.tempId,
                                  "unitPrice",
                                  e.target.value
                                )
                              }
                              disabled={!isAdmin}
                              title={
                                !isAdmin
                                  ? "Los precios los carga el equipo interno."
                                  : ""
                              }
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(it.tempId)}
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  style={{ marginTop: 10 }}
                  onClick={handleAddRow}
                >
                  + Agregar línea
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button type="submit">Guardar presupuesto</button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={[
          {
            id: "number",
            label: "N°",
            accessor: (b) => b.number,
          },
          {
            id: "client",
            label: "Cliente",
            accessor: (b) => b.clientName,
          },
          {
            id: "date",
            label: "Fecha",
            accessor: (b) => b.date,
          },
          {
            id: "total",
            label: "Total",
            accessor: (b) =>
              b.total ? `$ ${b.total.toLocaleString("es-AR")}` : "-",
          },
          {
            id: "status",
            label: "Estado",
            render: (b) => (
              <span
                className={
                  "cell-status " +
                  (b.status === "Aprobado" ? "approved" : "pending")
                }
              >
                {b.status}
              </span>
            ),
          },
          {
            id: "actions",
            label: "",
            render: (b) => (
              <div className="table-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setPreviewBudget(b)}
                >
                  Ver / Imprimir
                </button>

                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => duplicateBudget(b.id)}
                    >
                      Duplicar
                    </button>

                    {b.status === "Aprobado" ? (
                      <button onClick={() => navigate("/orders")}>
                        Ver pedido →
                      </button>
                    ) : (
                      <button onClick={() => handleApproveAndCreateOrder(b)}>
                        Aprobar y generar pedido
                      </button>
                    )}
                  </>
                )}
              </div>
            ),
          },
        ]}
        data={processedBudgets}
        getRowKey={(b) => b.id}
        searchPlaceholder="Buscar presupuesto..."
      />

      {previewBudget && (
        <div
          className="modal-overlay"
          onClick={() => setPreviewBudget(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vista de presupuesto</h2>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setPreviewBudget(null)}
              >
                Cerrar
              </button>
            </div>

            <div className="modal-body">
              <div className="printable-budget">
                <header className="print-header">
                  <div>
                    <h1>Farber</h1>
                    <p className="print-subtitle">
                      Mobiliario y soluciones ergonómicas
                    </p>
                  </div>
                  <div className="print-meta">
                    <div>
                      <span className="print-label">Presupuesto</span>
                      <strong>{previewBudget.number}</strong>
                    </div>
                    <div>
                      <span className="print-label">Fecha</span>
                      <span>{previewBudget.date}</span>
                    </div>
                  </div>
                </header>

                <section className="print-section">
                  <h3>Cliente</h3>
                  <p>{previewBudget.clientName}</p>
                </section>

                <section className="print-section">
                  <h3>Detalle</h3>
                  <table className="print-table">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(previewBudget.items || []).map((it) => (
                        <tr key={it.id}>
                          <td>{it.name}</td>
                          <td>{it.qty}</td>
                          <td>
                            {it.unitPrice
                              ? `$ ${it.unitPrice.toLocaleString("es-AR")}`
                              : "-"}
                          </td>
                          <td>
                            {it.unitPrice
                              ? `$ ${(it.qty * it.unitPrice).toLocaleString(
                                  "es-AR"
                                )}`
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <section className="print-footer">
                  <div className="print-total">
                    <span>Total</span>
                    <strong>
                      {previewBudget.total
                        ? `$ ${previewBudget.total.toLocaleString("es-AR")}`
                        : "-"}
                    </strong>
                  </div>
                  <p className="print-conditions">
                    Este presupuesto es válido por 15 días. Los plazos de
                    entrega se confirman al momento de la aprobación del pedido.
                  </p>
                </section>
              </div>

              <div className="modal-actions no-print" style={{ marginTop: 16 }}>
                <button type="button" onClick={handlePrint}>
                  Imprimir
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setPreviewBudget(null)}
                  style={{ marginLeft: 8 }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   Pedidos
---------------------------- */

function OrdersView() {
  const { orders } = useData();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = React.useState("todos");

  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "todos") return orders;

    return orders.filter((o) => {
      if (statusFilter === "pendientes") {
        return o.status === "Pendiente recepción";
      }
      if (statusFilter === "parciales") {
        return o.status === "Recepción parcial";
      }
      if (statusFilter === "completos") {
        return o.status === "Recepción completa";
      }
      return true;
    });
  }, [orders, statusFilter]);

  const receptionProgress = (o) => {
    const total = o.items?.length || 0;
    if (!total) return 0;
    const received = o.items.filter((i) => i.received).length;
    return Math.round((received / total) * 100);
  };

  return (
    <div>
      <h1>Pedidos</h1>
      <p>Pedidos generados a partir de presupuestos aprobados.</p>

      <div className="status-filters">
        <button
          type="button"
          className={
            "status-filter-btn" +
            (statusFilter === "todos" ? " active" : "")
          }
          onClick={() => setStatusFilter("todos")}
        >
          Todos
        </button>
        <button
          type="button"
          className={
            "status-filter-btn" +
            (statusFilter === "pendientes" ? " active" : "")
          }
          onClick={() => setStatusFilter("pendientes")}
        >
          Pendientes
        </button>
        <button
          type="button"
          className={
            "status-filter-btn" +
            (statusFilter === "parciales" ? " active" : "")
          }
          onClick={() => setStatusFilter("parciales")}
        >
          Parciales
        </button>
        <button
          type="button"
          className={
            "status-filter-btn" +
            (statusFilter === "completos" ? " active" : "")
          }
          onClick={() => setStatusFilter("completos")}
        >
          Completos
        </button>
      </div>

      <DataTable
        columns={[
          {
            id: "number",
            label: "Pedido",
            accessor: (o) => o.number,
          },
          {
            id: "client",
            label: "Cliente",
            accessor: (o) => o.clientName,
          },
          {
            id: "date",
            label: "Fecha",
            accessor: (o) => o.createdISO,
          },
          {
            id: "total",
            label: "Total",
            accessor: (o) =>
              o.total ? `$ ${o.total.toLocaleString("es-AR")}` : "-",
          },
          {
            id: "progress",
            label: "Avance",
            render: (o) => {
              const p = receptionProgress(o);
              return (
                <div className="progress">
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <span className="progress-label">{p}%</span>
                </div>
              );
            },
          },
          {
            id: "status",
            label: "Recepción",
            render: (o) => (
              <span
                className={
                  "cell-status " +
                  (o.status === "Recepción completa"
                    ? "complete"
                    : o.status === "Recepción parcial"
                    ? "partial"
                    : "pending")
                }
              >
                {o.status}
              </span>
            ),
          },
          {
            id: "actions",
            label: "",
            render: (o) => (
              <button onClick={() => navigate(`/reception?id=${o.id}`)}>
                Recepción →
              </button>
            ),
          },
        ]}
        data={filteredOrders}
        getRowKey={(o) => o.id}
        searchPlaceholder="Buscar pedido..."
      />
    </div>
  );
}

/* ---------------------------
   Recepción
---------------------------- */

function ReceptionView() {
  const { orders, updateOrderItemStatus } = useData();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div>
        <h1>Recepción</h1>
        <p>No se encontró el pedido.</p>
        <button onClick={() => navigate("/orders")}>← Volver a pedidos</button>
      </div>
    );
  }

  const totalItems = order.items.length;
  const receivedItems = order.items.filter((i) => i.received).length;
  const percentage = totalItems
    ? Math.round((receivedItems / totalItems) * 100)
    : 0;

  const handleToggle = (itemId, checked) => {
    updateOrderItemStatus(order.id, itemId, checked);
  };

  return (
    <div>
      <h1>Recepción de productos</h1>
      <p>Marcá los productos recibidos de este pedido.</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <p>
          Estado:{" "}
          <span
            className={
              "cell-status " +
              (order.status === "Recepción completa"
                ? "complete"
                : "Recepción parcial" === order.status
                ? "partial"
                : "pending")
            }
          >
            {order.status}
          </span>
        </p>
        <p style={{ marginTop: 8 }}>
          Recibidos: {receivedItems}/{totalItems} · Avance: {percentage}%
        </p>
        <div className="progress" style={{ marginTop: 8 }}>
          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="progress-label">{percentage}%</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Recibido</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.received}
                    onChange={(e) => handleToggle(item.id, e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button style={{ marginTop: 16 }} onClick={() => navigate("/orders")}>
        ← Volver a pedidos
      </button>
    </div>
  );
}

/* ---------------------------
   Configurador
---------------------------- */

function ConfiguratorView() {
  const { addProductConfig, productConfigs } = useData();

  const [name, setName] = React.useState("");
  const [model, setModel] = React.useState("silla-ergonomica");
  const [color, setColor] = React.useState("#ff0040");
  const [fondo, setFondo] = React.useState("visto");
  const [texture, setTexture] = React.useState("blend-faplac");
  const [width, setWidth] = React.useState("120");
  const [depth, setDepth] = React.useState("60");
  const [height, setHeight] = React.useState("75");

  const handleSave = (e) => {
    e.preventDefault();

    const cfg = addProductConfig({
      name,
      model,
      color,
      fondo,
      texture,
      width,
      depth,
      height,
    });

    if (!name.trim()) {
      setName(cfg.name);
    }

    alert("Configuración guardada.");
  };

  const handleLoadFromList = (cfg) => {
    setName(cfg.name);
    setModel(cfg.model);
    setColor(cfg.color);
    setFondo(cfg.fondo);
    setTexture(cfg.texture || "blend-faplac");
    setWidth(String(cfg.width || ""));
    setDepth(String(cfg.depth || ""));
    setHeight(String(cfg.height || ""));
  };

  return (
    <div>
      <h1>Configurador de productos</h1>
      <p>
        Definí modelo, textura (incluida la línea Blend de Faplac), color, tipo
        de fondo y medidas. Podés guardar presets para reutilizarlos después en
        presupuestos.
      </p>

      <div className="config-grid">
        <div className="config-left card">
          <h3>Datos de la configuración</h3>

          <form className="form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="field">
                <label>Nombre de la configuración</label>
                <input
                  className="input"
                  placeholder="Ej: Escritorio recepción blanco"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Modelo</label>
                <select
                  className="input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="silla-ergonomica">Silla ergonómica</option>
                  <option value="sillon-gerencial">Sillón gerencial</option>
                  <option value="escritorio">Escritorio</option>
                  <option value="mueble-guardado">Mueble de guardado</option>
                </select>
              </div>

              <div className="field">
                <label>Tipo de fondo</label>
                <div className="pill-group">
                  <button
                    type="button"
                    className={
                      "pill" + (fondo === "visto" ? " pill--active" : "")
                    }
                    onClick={() => setFondo("visto")}
                  >
                    Fondo visto
                  </button>
                  <button
                    type="button"
                    className={
                      "pill" + (fondo === "plus" ? " pill--active" : "")
                    }
                    onClick={() => setFondo("plus")}
                  >
                    Fondo plus
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Textura / línea</label>
                <select
                  className="input"
                  value={texture}
                  onChange={(e) => setTexture(e.target.value)}
                >
                  <option value="blend-faplac">Línea Blend Faplac</option>
                  <option value="melamina-lisa">Melamina lisa</option>
                  <option value="madera">Madera / símil madera</option>
                </select>
                <p className="helper-text">
                  Podés ajustar estas opciones según el catálogo real de placas.
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Color</label>
                <div className="color-row">
                  <input
                    className="input"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <span className="color-hex">{color}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Ancho (cm)</label>
                <input
                  className="input"
                  type="number"
                  min="40"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Profundidad (cm)</label>
                <input
                  className="input"
                  type="number"
                  min="40"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Altura (cm)</label>
                <input
                  className="input"
                  type="number"
                  min="40"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button type="submit">Guardar configuración</button>
            </div>
          </form>
        </div>

        <div className="config-right">
          <div className="card config-preview">
            <h3>Preview en tiempo real</h3>
            <p className="config-preview__subtitle">
              Mock visual para ver el modelo, la textura y las medidas.
            </p>

            <div className="preview-figure">
              <div className="preview-main" style={{ backgroundColor: color }}>
                <span className="preview-label">
                  {readableModel(model)}
                  <br />
                  {fondo === "visto" ? "Fondo visto" : "Fondo plus"}
                  <br />
                  {readableTexture(texture)}
                </span>
              </div>
              <div className="preview-measures">
                {width} x {depth} x {height} cm · {readableTexture(texture)}
              </div>
            </div>
          </div>

          <div className="card config-list">
            <h3>Configuraciones guardadas</h3>
            {productConfigs.length === 0 ? (
              <p className="config-empty">
                Todavía no guardaste configuraciones.
              </p>
            ) : (
              <ul className="config-list__items">
                {productConfigs.map((cfg) => (
                  <li
                    key={cfg.id}
                    className="config-list__item"
                    onClick={() => handleLoadFromList(cfg)}
                    title="Cargar esta configuración en el formulario"
                  >
                    <div>
                      <strong>{cfg.name}</strong>
                      <div className="config-list__meta">
                        {readableModel(cfg.model)} ·{" "}
                        {cfg.fondo === "visto"
                          ? "Fondo visto"
                          : "Fondo plus"}{" "}
                        · {cfg.width}x{cfg.depth}x{cfg.height} cm ·{" "}
                        {readableTexture(cfg.texture)}
                      </div>
                    </div>
                    <div
                      className="config-color-dot"
                      style={{ backgroundColor: cfg.color }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Clientes
---------------------------- */

function ClientsView() {
  const { clients, addClient } = useData();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }
    addClient(form);
    setForm({ name: "", email: "", phone: "", notes: "" });
  };

  return (
    <div>
      <h1>Clientes</h1>
      <p>Listado de clientes y alta rápida de nuevos contactos.</p>

      <div className="card" style={{ marginTop: 16, marginBottom: 20 }}>
        <h3>Nuevo cliente</h3>
        <form
          className="form"
          onSubmit={handleSubmit}
          style={{ marginTop: 8 }}
        >
          <div className="form-row">
            <div className="field">
              <label>Nombre</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Notas</label>
              <input
                className="input"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Guardar cliente</button>
          </div>
        </form>
      </div>

      <DataTable
        columns={[
          { id: "name", label: "Nombre", accessor: (c) => c.name },
          { id: "email", label: "Email", accessor: (c) => c.email },
          { id: "phone", label: "Teléfono", accessor: (c) => c.phone },
          { id: "notes", label: "Notas", accessor: (c) => c.notes },
        ]}
        data={clients}
        getRowKey={(c) => c.id}
        searchPlaceholder="Buscar cliente..."
      />
    </div>
  );
}

/* ---------------------------
   Productos (gestión interna)
---------------------------- */

// ---------- Gestión simple de productos ----------
function ProductsView() {
  const { products, addProduct } = useData();

  const [form, setForm] = React.useState({
    name: "",
    code: "",
    category: "",
    basePrice: "",
    imageUrl: "",
    notes: "",
  });

  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("El nombre del producto es obligatorio.");
      return;
    }
    addProduct(form);
    setForm({
      name: "",
      code: "",
      category: "",
      basePrice: "",
      imageUrl: "",
      notes: "",
    });
  };

  const formatPrice = (value) => {
    const n = Number(value || 0);
    if (!n) return "-";
    return `$ ${n.toLocaleString("es-AR")}`;
  };

  // ---- Manejo de imagen (archivo local o URL) ----
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor subí una imagen (JPG, PNG, etc).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <h1>Gestión de productos</h1>
      <p>
        Lugar simple y liviano para cargar y modificar productos. La vista
        visual para vender está en &quot;Menú principal&quot;.
      </p>

      <div className="card" style={{ marginTop: 16, marginBottom: 20 }}>
        <h3>Nuevo producto</h3>
        <form
          className="form"
          onSubmit={handleSubmit}
          style={{ marginTop: 8 }}
        >
          <div className="form-row">
            <div className="field">
              <label>Nombre</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Código / referencia</label>
              <input
                className="input"
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Categoría</label>
              <input
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Precio base (AR$)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={form.basePrice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, basePrice: e.target.value }))
                }
              />
            </div>

            {/* ÁREA DE DRAG & DROP + FILE INPUT */}
            <div className="field">
              <label>Imagen</label>
              <div
                className={
                  "dropzone" + (dragActive ? " dropzone--active" : "")
                }
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
              >
                <div>📎 Arrastrá una imagen acá o hacé clic</div>
                <div className="dropzone__hint">
                  Se va a usar en las cards del menú principal y en la ficha del
                  producto.
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 12, color: "var(--text-soft)" }}>
                  O pegá una URL (opcional)
                </label>
                <input
                  className="input"
                  placeholder="Ej: https://.../silla.jpg"
                  value={form.imageUrl.startsWith("data:")
                    ? ""
                    : form.imageUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                />
              </div>

              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="product-form-preview"
                />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Notas</label>
              <input
                className="input"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="submit">Guardar producto</button>
          </div>
        </form>
      </div>

      <DataTable
        columns={[
          { id: "name", label: "Nombre", accessor: (p) => p.name },
          { id: "code", label: "Código", accessor: (p) => p.code },
          { id: "category", label: "Categoría", accessor: (p) => p.category },
          {
            id: "price",
            label: "Precio base",
            accessor: (p) => formatPrice(p.basePrice),
          },
          {
            id: "image",
            label: "Imagen",
            render: (p) =>
              p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                "—"
              ),
          },
          { id: "notes", label: "Notas", accessor: (p) => p.notes },
        ]}
        data={products}
        getRowKey={(p) => p.id}
        searchPlaceholder="Buscar producto..."
      />
    </div>
  );
}


/* ---------------------------
   Reportes
---------------------------- */

function ReportsView() {
  const { budgets, orders } = useData();

  const totalPresupuestos = budgets.length;
  const aprobados = budgets.filter((b) => b.status === "Aprobado").length;
  const totalPedidos = orders.length;
  const completos = orders.filter((o) => o.status === "Recepción completa")
    .length;

  return (
    <div>
      <h1>Reportes</h1>
      <p>
        Vista rápida de indicadores. Más adelante se puede ampliar con filtros,
        períodos y exportaciones.
      </p>

      <div className="cards" style={{ marginTop: 20 }}>
        <div className="card">
          <h3>Presupuestos aprobados</h3>
          <p>
            <strong>
              {aprobados} / {totalPresupuestos}
            </strong>
          </p>
        </div>
        <div className="card">
          <h3>Pedidos completados</h3>
          <p>
            <strong>
              {completos} / {totalPedidos}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Utilidades
---------------------------- */

function ToolsView() {
  return (
    <div>
      <h1>Utilidades</h1>
      <p>
        Espacio reservado para herramientas internas: calculadoras, plantillas,
        etc.
      </p>

      <div className="cards" style={{ marginTop: 20 }}>
        <div className="card">
          <h3>Ideas posibles</h3>
          <ul className="config-list__items">
            <li className="config-list__item">
              <div>
                <strong>Calculadora de metros</strong>
                <div className="config-list__meta">
                  Ingresar medidas y obtener costo total por metro lineal.
                </div>
              </div>
            </li>
            <li className="config-list__item">
              <div>
                <strong>Textos prearmados</strong>
                <div className="config-list__meta">
                  Plantillas para mails de aprobación, avisos, etc.
                </div>
              </div>
            </li>
            <li className="config-list__item">
              <div>
                <strong>Checklist de entrega</strong>
                <div className="config-list__meta">
                  Paso a paso para verificar que todo está OK antes de entregar.
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Rutas privadas (solo interno)
---------------------------- */

function PrivateRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/* ---------------------------
   App root
---------------------------- */

export default function App() {
  const [isAdmin, setIsAdmin] = React.useState(false);

  // OJO: credenciales de ejemplo, solo para entorno interno
  const login = (user, pass) => {
    if (user === "farber" && pass === "1234") {
      setIsAdmin(true);
      return true;
    }
    alert("Usuario o contraseña incorrectos.");
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const authValue = React.useMemo(
    () => ({ isAdmin, login, logout }),
    [isAdmin]
  );

  return (
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <DataContextProvider>
          <Layout>
            <Routes>
              {/* Público */}
              <Route path="/" element={<MainMenuView />} />
              <Route path="/menu" element={<MainMenuView />} />
              <Route path="/budgets" element={<BudgetsView />} />

              {/* Interno */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrdersView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reception"
                element={
                  <PrivateRoute>
                    <ReceptionView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/configurator"
                element={
                  <PrivateRoute>
                    <ConfiguratorView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <PrivateRoute>
                    <ClientsView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <ProductsView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <ReportsView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tools"
                element={
                  <PrivateRoute>
                    <ToolsView />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </DataContextProvider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
