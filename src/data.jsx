// DATA.JSX — Store global de la app (clientes, presupuestos, pedidos, configuraciones, productos)
import React from "react";

const DataContext = React.createContext();

export function useData() {
  return React.useContext(DataContext);
}

// ---------- HELPERS ----------

// Genera un ID simple (por si no querés usar crypto.randomUUID en todos lados)
const createId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Genera el próximo número de presupuesto tipo "P-0001"
function generateBudgetNumber(list) {
  const nums = list
    .map((b) => b.number)
    .filter(Boolean)
    .map((n) => parseInt(String(n).replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));

  const last = nums.length ? Math.max(...nums) : 0;
  const next = last + 1;
  return `P-${String(next).padStart(4, "0")}`;
}

// ---------- DATOS INICIALES ----------

const initialData = {
  clients: [
    {
      id: "c1",
      name: "Cliente ejemplo",
      email: "cliente@ejemplo.com",
      phone: "11-1234-5678",
      notes: "Cliente de prueba inicial",
    },
  ],
  budgets: [
    {
      id: "b1",
      number: "P-0001",
      clientId: "c1",
      clientName: "Cliente ejemplo",
      date: "2025-01-01",
      status: "Pendiente",
      items: [
        { id: "i1", name: "Silla ergonómica", qty: 1, unitPrice: 150000 },
      ],
      total: 150000,
      createdISO: "2025-01-01T00:00:00.000Z",
    },
  ],
  orders: [],
  productConfigs: [], // configuraciones guardadas desde el configurador
  products: [], // catálogo de productos base
};

// ---------- PROVIDER ----------

export function DataContextProvider({ children }) {
  const [data, setData] = React.useState(initialData);

  // Desestructuramos para que sea más cómodo usar desde el contexto
  const { clients, budgets, orders, productConfigs, products } = data;

  // ---------- CLIENTES ----------

  function addClient(clientInput) {
    const newClient = {
      id: crypto.randomUUID(),
      name: clientInput.name.trim(),
      email: clientInput.email?.trim() || "",
      phone: clientInput.phone?.trim() || "",
      notes: clientInput.notes?.trim() || "",
    };

    setData((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));

    return newClient;
  }

  function updateClient(id, patch) {
    setData((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    }));
  }

  // ---------- PRESUPUESTOS ----------

  function addBudget({ clientId, date, items }) {
    setData((prev) => {
      const number = generateBudgetNumber(prev.budgets);

      const client = prev.clients.find((c) => c.id === clientId);
      const normalizedItems = items.map((it, index) => ({
        id: createId() + "-" + index,
        name: it.name,
        qty: Number(it.qty || 0),
        unitPrice: Number(it.unitPrice || 0),
      }));

      const total = normalizedItems.reduce(
        (acc, it) => acc + it.qty * it.unitPrice,
        0
      );

      const newBudget = {
        id: createId(),
        number,
        clientId,
        clientName: client ? client.name : "Cliente sin nombre",
        date: date || new Date().toISOString().slice(0, 10),
        status: "Pendiente",
        items: normalizedItems,
        total,
        createdISO: new Date().toISOString(),
      };

      return {
        ...prev,
        budgets: [newBudget, ...prev.budgets],
      };
    });
  }

  function duplicateBudget(budgetId) {
    setData((prev) => {
      const original = prev.budgets.find((b) => b.id === budgetId);
      if (!original) return prev;

      const number = generateBudgetNumber(prev.budgets);

      const cloned = {
        ...original,
        id: createId(),
        number,
        status: "Pendiente",
        createdISO: new Date().toISOString(),
      };

      return {
        ...prev,
        budgets: [cloned, ...prev.budgets],
      };
    });
  }

  function updateBudgetStatus(id, status) {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    }));
  }

  // ---------- PEDIDOS ----------

  function addOrderFromBudget(budget) {
    setData((prev) => {
      const nextNumber =
        "O-" + String(prev.orders.length + 1).padStart(3, "0");

      const newOrder = {
        id: crypto.randomUUID(),
        number: nextNumber,
        clientName: budget.clientName,
        createdISO: new Date().toISOString().slice(0, 10),
        total: budget.total,
        status: "Pendiente recepción",
        items: budget.items.map((it) => ({
          id: crypto.randomUUID(),
          name: it.name,
          qty: it.qty,
          received: false,
        })),
      };

      return {
        ...prev,
        orders: [...prev.orders, newOrder],
      };
    });
  }

  // ÍTEMS + ESTADO de pedido en un solo lugar
  function updateOrderItemStatus(orderId, itemId, received) {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => {
        if (o.id !== orderId) return o;

        const updatedItems = o.items.map((it) =>
          it.id === itemId ? { ...it, received } : it
        );

        const total = updatedItems.length;
        const receivedCount = updatedItems.filter((i) => i.received).length;

        let status = "Pendiente recepción";
        if (receivedCount === 0) {
          status = "Pendiente recepción";
        } else if (receivedCount < total) {
          status = "Recepción parcial";
        } else {
          status = "Recepción completa";
        }

        return {
          ...o,
          items: updatedItems,
          status,
        };
      }),
    }));
  }

  function updateOrderStatus(orderId, status) {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    }));
  }

   // ---------- CONFIGURADOR DE PRODUCTOS ----------

  function addProductConfig(configInput) {
    const newConfig = {
      id: crypto.randomUUID(),
      name: configInput.name.trim() || "Configuración sin nombre",
      model: configInput.model,
      color: configInput.color,
      fondo: configInput.fondo, // 'visto' | 'plus'
      texture: configInput.texture || "blend-faplac", // 👈 nueva propiedad: textura (por defecto línea Blend)
      width: Number(configInput.width) || 0,
      depth: Number(configInput.depth) || 0,
      height: Number(configInput.height) || 0,
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      productConfigs: [newConfig, ...prev.productConfigs],
    }));

    return newConfig;
  }


  // ---------- CATÁLOGO DE PRODUCTOS (base) ----------

  function addProduct(productInput) {
    const newProduct = {
      id: crypto.randomUUID(),
      name: productInput.name.trim(),
      code: productInput.code?.trim() || "",
      category: productInput.category?.trim() || "",
      basePrice: Number(productInput.basePrice) || 0,
      imageUrl: productInput.imageUrl?.trim() || "",
      notes: productInput.notes?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
    }));

    return newProduct;
  }

  function updateProduct(id, patch) {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
  }

  // ---------- VALOR DEL CONTEXTO ----------

  const value = {
    clients,
    budgets,
    orders,
    productConfigs,
    products,
    addClient,
    updateClient,
    addBudget,
    duplicateBudget,
    addOrderFromBudget,
    updateBudgetStatus,
    updateOrderItemStatus,
    updateOrderStatus,
    addProductConfig,
    addProduct,
    updateProduct,
  };

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}
