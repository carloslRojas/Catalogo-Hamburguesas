/**
 * Catálogo Digital Interactivo & Constructor de Hamburguesas
 * Arquitectura: Vanilla JS Modular (ES6+) sin backend
 * Optimizado para Mobile-First e Instagram WebView
 */

const MENU_DATA = {
  brand: {
    name: "BRASA & CO.",
    tagline: "Smash Burgers Artesanales",
    whatsappNumber: "584240000000",
    currency: "$",
    prepTime: "15 - 25 min",
    pickupAddress: "Av. Principal Las Mercedes, Local 4B (Retiro Express)"
  },

  // Catálogo de hamburguesas (con la Hamburguesa Base Clásica preseleccionada por defecto)
  catalog: [
    {
      id: "classic-smash",
      name: "La Clásica Smash",
      badge: "Más Vendida 🔥",
      basePrice: 6.00,
      description: "Nuestra hamburguesa insignia al estilo artesanal con bordes crujientes al grill.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
      baseIngredients: [
        "Pan artesanal brioche tostado en mantequilla",
        "1 Carne smash 100g de res premium",
        "Queso cheddar fundido",
        "Tocineta crujiente ahumada",
        "Cebolla morada fresca en plumas",
        "Pepinillos encurtidos en casa",
        "Salsa de la casa y toque de mostaza"
      ]
    },
    {
      id: "oklahoma-onion",
      name: "Oklahoma Crispy",
      badge: "Favorita del Chef ⭐",
      basePrice: 6.50,
      description: "Carne smash prensada con abundante cebolla caramelizada al grill, doble cheddar y pan brioche.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80",
      baseIngredients: [
        "Pan artesanal de papa",
        "1 Carne smash prensada con cebolla al grill",
        "Queso cheddar americano",
        "Tocineta crujiente",
        "Cebolla morada",
        "Pepinillos dill",
        "Salsa de la casa"
      ]
    },
    {
      id: "truffle-bacon",
      name: "Truffle & Bacon Melt",
      badge: "Edición Especial 🍔",
      basePrice: 7.00,
      description: "Combinación intensa de tocineta glaseada, queso cheddar madurado y emulsión de la casa.",
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80",
      baseIngredients: [
        "Pan artesanal brioche",
        "1 Carne smash 100g",
        "Queso cheddar fundido",
        "Tocineta crujiente",
        "Cebolla morada",
        "Pepinillos",
        "Salsa de la casa"
      ]
    }
  ],

  // Selector de proteína (Radio buttons interactivos)
  proteins: [
    {
      id: "simple",
      name: "Simple (1 Carne)",
      subtitle: "Incluida en el precio base (100g)",
      priceDelta: 0.00,
      icon: "🥩",
      badge: "Incluida"
    },
    {
      id: "doble",
      name: "Doble Carne",
      subtitle: "200g de pura jugosidad smash",
      priceDelta: 2.00,
      icon: "🥩🥩",
      badge: "Popular"
    },
    {
      id: "triple",
      name: "Triple Carne",
      subtitle: "300g para apetitos voraces",
      priceDelta: 3.50,
      icon: "🥩🥩🥩",
      badge: "Brutal"
    }
  ],

  // Sección "Excluir ingredientes" (Chips / Toggles táctiles sin costo)
  exclusions: [
    { id: "no-pickles", label: "Sin pepinillos", icon: "🥒" },
    { id: "no-onion", label: "Sin cebolla", icon: "🧅" },
    { id: "no-mustard", label: "Sin mostaza", icon: "🌭" },
    { id: "no-house-sauce", label: "Sin salsa de la casa", icon: "🥣" },
    { id: "no-bacon", label: "Sin tocineta", icon: "🥓" },
    { id: "no-cheese", label: "Sin queso cheddar", icon: "🧀" }
  ],

  // Adicionales con costo (Checkboxes con precio visible)
  extras: [
    {
      id: "extra-bacon",
      name: "Doble tocineta",
      description: "Porción extra de tocineta ahumada ultra crujiente",
      price: 1.00,
      icon: "🥓"
    },
    {
      id: "extra-cheese",
      name: "Extra queso",
      description: "Doble lonja de queso cheddar americano fundido",
      price: 0.80,
      icon: "🧀"
    },
    {
      id: "extra-garlic-sauce",
      name: "Salsa de ajo extra",
      description: "Envase de 2oz de nuestra cremosa salsa de ajo rostizado",
      price: 0.50,
      icon: "🧄"
    }
  ],

  // Modalidades y Zonas de Entrega
  deliveryConfig: {
    modes: [
      {
        id: "pickup",
        name: "Retiro en tienda",
        subtitle: "Pickup sin costo adicional",
        fee: 0.00,
        icon: "🏪"
      },
      {
        id: "delivery",
        name: "Envío a domicilio",
        subtitle: "Delivery rápido según tu zona",
        fee: null, // Depende de la zona seleccionada
        icon: "🛵"
      }
    ],
    zones: [
      { id: "centro", name: "Zona Centro", eta: "15-20 min", price: 1.50 },
      { id: "norte", name: "Zona Norte", eta: "20-30 min", price: 2.00 },
      { id: "periferia", name: "Zona Periferia", eta: "30-45 min", price: 3.00 }
    ]
  }
};

/* ==========================================================================
   ESTADO REACTIVO DE LA APLICACIÓN
   ========================================================================== */
const state = {
  selectedBurgerId: MENU_DATA.catalog[0].id,
  selectedProteinId: MENU_DATA.proteins[0].id, // 'simple' ($0.00)
  selectedExclusions: new Set(),               // IDs de ingredientes excluidos
  selectedExtras: new Set(),                   // IDs de adicionales con costo
  quantity: 1,

  // Estado del Modal de Entrega
  isModalOpen: false,
  deliveryMode: "pickup",                      // 'pickup' | 'delivery'
  selectedZoneId: MENU_DATA.deliveryConfig.zones[0].id, // 'centro' ($1.50) por defecto cuando es delivery
  customer: {
    fullName: "",
    phone: "",
    address: "",
    notes: ""
  }
};

/* ==========================================================================
   FUNCIONES DE CÁLCULO PURO (SELECTORES DE PRECIO)
   ========================================================================== */
const formatCurrency = (amount) => `${MENU_DATA.brand.currency}${Number(amount).toFixed(2)}`;

const getSelectedBurger = () =>
  MENU_DATA.catalog.find((b) => b.id === state.selectedBurgerId) || MENU_DATA.catalog[0];

const getSelectedProtein = () =>
  MENU_DATA.proteins.find((p) => p.id === state.selectedProteinId) || MENU_DATA.proteins[0];

const getSelectedExtrasList = () =>
  MENU_DATA.extras.filter((extra) => state.selectedExtras.has(extra.id));

const getSelectedExclusionsList = () =>
  MENU_DATA.exclusions.filter((excl) => state.selectedExclusions.has(excl.id));

const getSelectedDeliveryZone = () =>
  MENU_DATA.deliveryConfig.zones.find((z) => z.id === state.selectedZoneId) ||
  MENU_DATA.deliveryConfig.zones[0];

const calculateOrderTotals = () => {
  const burger = getSelectedBurger();
  const protein = getSelectedProtein();
  const extras = getSelectedExtrasList();

  const extrasUnitTotal = extras.reduce((acc, item) => acc + item.price, 0);
  const unitSubtotal = burger.basePrice + protein.priceDelta + extrasUnitTotal;
  const subtotal = unitSubtotal * state.quantity;

  const deliveryFee =
    state.deliveryMode === "delivery" ? getSelectedDeliveryZone().price : 0.0;

  const grandTotal = subtotal + deliveryFee;

  return {
    basePrice: burger.basePrice,
    proteinDelta: protein.priceDelta,
    extrasUnitTotal,
    unitSubtotal,
    subtotal,
    deliveryFee,
    grandTotal
  };
};

/* ==========================================================================
   RENDERIZADO DE COMPONENTES UI
   ========================================================================== */

/**
 * Renderiza el selector de catálogo superior y la tarjeta principal de la hamburguesa
 */
const renderHeroAndCatalog = () => {
  const burger = getSelectedBurger();

  // Tabs de catálogo
  const catalogTabsContainer = document.getElementById("catalog-tabs");
  catalogTabsContainer.innerHTML = MENU_DATA.catalog
    .map((item) => {
      const isSelected = item.id === state.selectedBurgerId;
      return `
        <button
          type="button"
          data-action="select-burger"
          data-id="${item.id}"
          class="tactile-btn flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all flex items-center gap-2 ${
            isSelected
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
              : "bg-slate-800/80 text-slate-300 border-slate-700/80 hover:border-slate-600"
          }"
        >
          <span>🍔 ${item.name}</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-bold ${
            isSelected ? "bg-slate-950/20 text-slate-950" : "bg-slate-900/80 text-amber-400"
          }">${formatCurrency(item.basePrice)}</span>
        </button>
      `;
    })
    .join("");

  // Tarjeta principal de la hamburguesa base
  const burgerHeroContainer = document.getElementById("burger-hero");
  burgerHeroContainer.innerHTML = `
    <div class="relative rounded-3xl overflow-hidden bg-slate-800/90 border border-slate-700/70 shadow-2xl">
      <div class="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
        <img
          src="${burger.image}"
          alt="${burger.name}"
          class="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div class="absolute top-3 left-3 flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
            ${burger.badge}
          </span>
        </div>

        <div class="absolute top-3 right-3">
          <span class="px-3.5 py-1.5 rounded-2xl text-sm font-extrabold bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-lg">
            Base ${formatCurrency(burger.basePrice)}
          </span>
        </div>

        <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              ${burger.name}
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-2">
              ${burger.description}
            </p>
          </div>
        </div>
      </div>

      <!-- Ingredientes estándar de la hamburguesa base -->
      <div class="p-4 sm:p-5 bg-slate-800/60">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Ingredientes estándar incluidos
          </span>
          <span class="text-[11px] text-slate-400">Receta original</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${burger.baseIngredients
            .map(
              (ing) => `
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-700/60">
                • ${ing}
              </span>
            `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
};

/**
 * Renderiza el Selector de Proteína (Paso 1)
 */
const renderProteinSelector = () => {
  const container = document.getElementById("protein-options");
  container.innerHTML = MENU_DATA.proteins
    .map((protein) => {
      const isSelected = protein.id === state.selectedProteinId;
      const priceLabel =
        protein.priceDelta === 0
          ? "Incluida ($0.00)"
          : `+${formatCurrency(protein.priceDelta)}`;

      return `
        <button
          type="button"
          role="radio"
          aria-checked="${isSelected}"
          data-action="select-protein"
          data-id="${protein.id}"
          class="tactile-btn w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
            isSelected
              ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10"
              : "bg-slate-800/70 border-slate-700/80 hover:border-slate-600"
          }"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            <!-- Radio indicator -->
            <div class="w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
              isSelected
                ? "border-amber-400 bg-amber-500 text-slate-950"
                : "border-slate-500 bg-slate-900/60"
            }">
              ${
                isSelected
                  ? `<svg class="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
                  : ""
              }
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm sm:text-base ${
                  isSelected ? "text-amber-300" : "text-white"
                }">
                  ${protein.name}
                </span>
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-700/80 text-slate-300"
                }">
                  ${protein.badge}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5 truncate">${protein.subtitle}</p>
            </div>
          </div>

          <div class="flex flex-col items-end flex-shrink-0">
            <span class="text-sm font-extrabold ${
              isSelected ? "text-amber-400" : "text-slate-200"
            }">
              ${priceLabel}
            </span>
            <span class="text-xs opacity-80">${protein.icon}</span>
          </div>
        </button>
      `;
    })
    .join("");
};

/**
 * Renderiza la sección "Excluir ingredientes" (Chips táctiles sin alterar el precio)
 */
const renderExclusions = () => {
  const container = document.getElementById("exclusion-options");
  const countBadge = document.getElementById("exclusions-count");
  const activeCount = state.selectedExclusions.size;

  if (countBadge) {
    countBadge.textContent =
      activeCount > 0 ? `${activeCount} excluido${activeCount > 1 ? "s" : ""}` : "Con todo";
    countBadge.className = `text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
      activeCount > 0
        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
        : "bg-slate-800 text-slate-400 border border-slate-700"
    }`;
  }

  container.innerHTML = MENU_DATA.exclusions
    .map((item) => {
      const isExcluded = state.selectedExclusions.has(item.id);
      return `
        <button
          type="button"
          role="checkbox"
          aria-checked="${isExcluded}"
          data-action="toggle-exclusion"
          data-id="${item.id}"
          class="tactile-btn px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
            isExcluded
              ? "bg-rose-500/15 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/40 shadow-sm"
              : "bg-slate-800/70 border-slate-700/80 text-slate-300 hover:border-slate-600"
          }"
        >
          <span class="flex items-center gap-2 truncate">
            <span>${item.icon}</span>
            <span class="truncate">${item.label}</span>
          </span>
          <span class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs transition-colors ${
            isExcluded
              ? "bg-rose-500 text-white"
              : "bg-slate-900/80 border border-slate-600 text-transparent"
          }">
            ✕
          </span>
        </button>
      `;
    })
    .join("");
};

/**
 * Renderiza la sección "Adicionales con costo" (Checkboxes con precio visible)
 */
const renderExtras = () => {
  const container = document.getElementById("extras-options");
  container.innerHTML = MENU_DATA.extras
    .map((extra) => {
      const isChecked = state.selectedExtras.has(extra.id);
      return `
        <button
          type="button"
          role="checkbox"
          aria-checked="${isChecked}"
          data-action="toggle-extra"
          data-id="${extra.id}"
          class="tactile-btn w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
            isChecked
              ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10"
              : "bg-slate-800/70 border-slate-700/80 hover:border-slate-600"
          }"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            <!-- Checkbox box -->
            <div class="w-6 h-6 rounded-lg flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
              isChecked
                ? "border-amber-400 bg-amber-500 text-slate-950"
                : "border-slate-500 bg-slate-900/60"
            }">
              ${
                isChecked
                  ? `<svg class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
                  : ""
              }
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-base">${extra.icon}</span>
                <span class="font-bold text-sm sm:text-base ${
                  isChecked ? "text-amber-300" : "text-white"
                }">
                  ${extra.name}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">${extra.description}</p>
            </div>
          </div>

          <div class="flex-shrink-0">
            <span class="inline-block px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold ${
              isChecked
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-slate-900/90 text-amber-400 border border-amber-500/30"
            }">
              +${formatCurrency(extra.price)}
            </span>
          </div>
        </button>
      `;
    })
    .join("");
};

/**
 * Actualiza el selector de cantidad y el resumen en vivo antes de la barra fija
 */
const renderLiveSummaryCard = () => {
  const burger = getSelectedBurger();
  const protein = getSelectedProtein();
  const extras = getSelectedExtrasList();
  const exclusions = getSelectedExclusionsList();
  const totals = calculateOrderTotals();

  const quantityEl = document.getElementById("burger-quantity");
  if (quantityEl) quantityEl.textContent = state.quantity;

  const liveBreakdownEl = document.getElementById("live-breakdown");
  if (!liveBreakdownEl) return;

  liveBreakdownEl.innerHTML = `
    <div class="space-y-2 text-xs sm:text-sm">
      <div class="flex justify-between items-center text-slate-300">
        <span>🍔 ${burger.name} (Base)</span>
        <span class="font-semibold text-white">${formatCurrency(burger.basePrice)}</span>
      </div>
      <div class="flex justify-between items-center text-slate-300">
        <span>🥩 Proteína: <strong class="text-amber-400">${protein.name}</strong></span>
        <span class="font-semibold text-white">${
          protein.priceDelta > 0 ? `+${formatCurrency(protein.priceDelta)}` : "$0.00"
        }</span>
      </div>
      ${
        extras.length > 0
          ? extras
              .map(
                (ex) => `
          <div class="flex justify-between items-center text-amber-300/90">
            <span>➕ ${ex.name}</span>
            <span class="font-semibold">+${formatCurrency(ex.price)}</span>
          </div>
        `
              )
              .join("")
          : ""
      }
      ${
        exclusions.length > 0
          ? `
          <div class="pt-1 border-t border-slate-700/60 flex flex-wrap gap-1 items-center text-rose-300">
            <span class="font-semibold mr-1">🚫 Sin:</span>
            ${exclusions.map((e) => `<span class="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-[11px]">${e.label}</span>`).join("")}
          </div>
        `
          : ""
      }
      ${
        state.quantity > 1
          ? `
          <div class="pt-2 border-t border-slate-700/60 flex justify-between items-center text-slate-200 font-bold">
            <span>Cantidad (${state.quantity}x ${formatCurrency(totals.unitSubtotal)})</span>
            <span class="text-amber-400">${formatCurrency(totals.subtotal)}</span>
          </div>
        `
          : ""
      }
    </div>
  `;
};

/**
 * Actualiza la Sticky Bottom Bar de manera reactiva con animación en el precio
 */
const renderStickyBottomBar = (animatePrice = true) => {
  const totals = calculateOrderTotals();
  const subtotalEl = document.getElementById("sticky-subtotal");
  const metaEl = document.getElementById("sticky-meta");

  if (subtotalEl) {
    subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (animatePrice) {
      subtotalEl.classList.remove("price-pop");
      // Forzar reflow para reiniciar animación
      void subtotalEl.offsetWidth;
      subtotalEl.classList.add("price-pop");
    }
  }

  if (metaEl) {
    const extrasCount = state.selectedExtras.size;
    const protein = getSelectedProtein();
    const parts = [protein.name.split(" ")[0]];
    if (extrasCount > 0) parts.push(`+${extrasCount} extra${extrasCount > 1 ? "s" : ""}`);
    if (state.quantity > 1) parts.push(`x${state.quantity} uds`);
    metaEl.textContent = parts.join(" • ");
  }
};

/**
 * Renderiza el contenido dinámico del Modal de Entrega (Pickup vs Delivery + Zonas + Desglose)
 */
const renderCheckoutModal = () => {
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  if (state.isModalOpen) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  } else {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    return;
  }

  // Renderizar botones de modalidad (Pickup vs Delivery)
  const modeContainer = document.getElementById("delivery-mode-selector");
  modeContainer.innerHTML = MENU_DATA.deliveryConfig.modes
    .map((mode) => {
      const isSelected = state.deliveryMode === mode.id;
      const feeText =
        mode.id === "pickup" ? "Gratis ($0.00)" : "Desde $1.50";
      return `
        <button
          type="button"
          data-action="select-delivery-mode"
          data-mode="${mode.id}"
          class="tactile-btn p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            isSelected
              ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-md"
              : "bg-slate-800/80 border-slate-700 text-slate-300"
          }"
        >
          <div class="flex items-center justify-between w-full mb-1">
            <span class="text-xl">${mode.icon}</span>
            <span class="text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
              isSelected
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-900 text-slate-400"
            }">${feeText}</span>
          </div>
          <div>
            <p class="font-bold text-sm ${isSelected ? "text-amber-300" : "text-white"}">${
        mode.name
      }</p>
            <p class="text-[11px] text-slate-400 leading-tight mt-0.5">${mode.subtitle}</p>
          </div>
        </button>
      `;
    })
    .join("");

  // Mostrar/ocultar sección de zonas de delivery y campo de dirección obligatoria
  const zonesSection = document.getElementById("delivery-zones-section");
  const addressFieldWrapper = document.getElementById("address-field-wrapper");
  const pickupInfoBanner = document.getElementById("pickup-info-banner");

  if (state.deliveryMode === "delivery") {
    zonesSection.classList.remove("hidden");
    addressFieldWrapper.classList.remove("hidden");
    pickupInfoBanner.classList.add("hidden");

    const zonesContainer = document.getElementById("delivery-zones-options");
    zonesContainer.innerHTML = MENU_DATA.deliveryConfig.zones
      .map((zone) => {
        const isSelected = state.selectedZoneId === zone.id;
        return `
          <button
            type="button"
            data-action="select-zone"
            data-zone="${zone.id}"
            class="tactile-btn p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              isSelected
                ? "bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/50"
                : "bg-slate-800/70 border-slate-700/80 text-slate-300"
            }"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                isSelected ? "border-amber-400 bg-amber-500" : "border-slate-500"
              }">
                ${isSelected ? `<span class="w-1.5 h-1.5 rounded-full bg-slate-950"></span>` : ""}
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold ${
                  isSelected ? "text-amber-300" : "text-white"
                }">${zone.name}</p>
                <p class="text-[11px] text-slate-400">⏱️ Est. ${zone.eta}</p>
              </div>
            </div>
            <span class="text-xs sm:text-sm font-extrabold ${
              isSelected ? "text-amber-400" : "text-slate-200"
            }">
              +${formatCurrency(zone.price)}
            </span>
          </button>
        `;
      })
      .join("");
  } else {
    zonesSection.classList.add("hidden");
    addressFieldWrapper.classList.add("hidden");
    pickupInfoBanner.classList.remove("hidden");
    document.getElementById("pickup-address-text").textContent = MENU_DATA.brand.pickupAddress;
  }

  // Actualizar resumen de costos en el modal
  const totals = calculateOrderTotals();
  const burger = getSelectedBurger();
  const protein = getSelectedProtein();
  const extras = getSelectedExtrasList();
  const exclusions = getSelectedExclusionsList();

  const summaryBox = document.getElementById("modal-order-summary");
  summaryBox.innerHTML = `
    <div class="space-y-1.5 text-xs sm:text-sm">
      <div class="flex justify-between text-slate-300">
        <span>${state.quantity}x ${burger.name} (${protein.name})</span>
        <span class="font-semibold text-white">${formatCurrency(
          (burger.basePrice + protein.priceDelta) * state.quantity
        )}</span>
      </div>
      ${
        extras.length > 0
          ? `<div class="flex justify-between text-slate-300">
              <span>Adicionales (${extras.map((e) => e.name).join(", ")})</span>
              <span class="font-semibold text-amber-300">+${formatCurrency(
                totals.extrasUnitTotal * state.quantity
              )}</span>
            </div>`
          : ""
      }
      ${
        exclusions.length > 0
          ? `<div class="text-xs text-rose-300">
              <span>Excluidos: ${exclusions.map((e) => e.label).join(", ")} ($0.00)</span>
            </div>`
          : ""
      }
      <div class="flex justify-between text-slate-300 pt-1 border-t border-slate-700/60">
        <span>Subtotal comida</span>
        <span class="font-bold text-white">${formatCurrency(totals.subtotal)}</span>
      </div>
      <div class="flex justify-between text-slate-300">
        <span>${
          state.deliveryMode === "delivery"
            ? `Tarifa de envío (${getSelectedDeliveryZone().name})`
            : "Retiro en tienda (Pickup)"
        }</span>
        <span class="font-bold ${
          totals.deliveryFee > 0 ? "text-amber-400" : "text-emerald-400"
        }">${totals.deliveryFee > 0 ? `+${formatCurrency(totals.deliveryFee)}` : "GRATIS ($0.00)"}</span>
      </div>
      <div class="flex justify-between items-center text-base sm:text-lg font-extrabold text-white pt-2 border-t border-slate-700">
        <span>Total Estimado</span>
        <span class="text-amber-400 text-xl">${formatCurrency(totals.grandTotal)}</span>
      </div>
    </div>
  `;
};

/* ==========================================================================
   VALIDACIÓN Y GENERACIÓN DE PEDIDO POR WHATSAPP
   ========================================================================== */

const showValidationError = (message, fieldId = null) => {
  const alertBox = document.getElementById("form-error-alert");
  const alertText = document.getElementById("form-error-text");

  if (alertBox && alertText) {
    alertText.textContent = message;
    alertBox.classList.remove("hidden", "shake-error");
    void alertBox.offsetWidth;
    alertBox.classList.add("shake-error");
  }

  if (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.focus();
      field.classList.add("border-rose-500", "ring-2", "ring-rose-500/40");
      setTimeout(() => {
        field.classList.remove("border-rose-500", "ring-2", "ring-rose-500/40");
      }, 2500);
    }
  }
};

const clearValidationError = () => {
  const alertBox = document.getElementById("form-error-alert");
  if (alertBox) alertBox.classList.add("hidden");
};

const buildWhatsAppMessage = () => {
  const burger = getSelectedBurger();
  const protein = getSelectedProtein();
  const extras = getSelectedExtrasList();
  const exclusions = getSelectedExclusionsList();
  const totals = calculateOrderTotals();
  const zone = getSelectedDeliveryZone();

  const fullName = state.customer.fullName.trim();
  const phone = state.customer.phone.trim();
  const address = state.customer.address.trim();
  const notes = state.customer.notes.trim();

  const lines = [
    `🍔 *NUEVO PEDIDO - ${MENU_DATA.brand.name}* 🔥`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Cliente:* ${fullName}`,
    `📱 *Teléfono:* ${phone}`,
    `🛵 *Modalidad:* ${
      state.deliveryMode === "delivery"
        ? `Envío a domicilio (${zone.name})`
        : "Retiro en tienda (Pickup)"
    }`
  ];

  if (state.deliveryMode === "delivery") {
    lines.push(`📍 *Dirección exacta:* ${address}`);
  } else {
    lines.push(`📍 *Retiro en:* ${MENU_DATA.brand.pickupAddress}`);
  }

  if (notes) {
    lines.push(`📝 *Nota:* ${notes}`);
  }

  lines.push(
    `━━━━━━━━━━━━━━━━━━━━`,
    `🧾 *DETALLE DE LA HAMBURGUESA:*`,
    `• *${state.quantity}x ${burger.name}* (Base: ${formatCurrency(burger.basePrice)} c/u)`,
    `• *Proteína:* ${protein.name} (${
      protein.priceDelta > 0 ? `+${formatCurrency(protein.priceDelta)}` : "Incluida $0.00"
    })`
  );

  if (exclusions.length > 0) {
    lines.push(`• *Excluir ingredientes:* ${exclusions.map((e) => e.label).join(", ")} ($0.00)`);
  } else {
    lines.push(`• *Ingredientes base:* Con todos los ingredientes estándar`);
  }

  if (extras.length > 0) {
    lines.push(`• *Adicionales con costo:*`);
    extras.forEach((ex) => {
      lines.push(`   ➕ ${ex.name} (+${formatCurrency(ex.price)})`);
    });
  } else {
    lines.push(`• *Adicionales con costo:* Ninguno`);
  }

  lines.push(
    `━━━━━━━━━━━━━━━━━━━━`,
    `💰 *DESGLOSE DE PAGO:*`,
    `• Subtotal Hamburguesa(s): *${formatCurrency(totals.subtotal)}*`,
    `  _(Base ${formatCurrency(totals.basePrice * state.quantity)} + Proteína/Extras ${formatCurrency(
      (totals.proteinDelta + totals.extrasUnitTotal) * state.quantity
    )})_`,
    `• Tarifa de Envío: *${
      totals.deliveryFee > 0 ? formatCurrency(totals.deliveryFee) : "$0.00 (Pickup)"
    }*`,
    `💵 *TOTAL ESTIMADO: ${formatCurrency(totals.grandTotal)}*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `✨ _Enviado desde el Catálogo Digital Interactivo. Quedo atento para coordinar el pago._`
  );

  return lines.join("\n");
};

const handleWhatsAppSubmit = (event) => {
  event.preventDefault();
  clearValidationError();

  // Sincronizar campos del formulario
  const nameInput = document.getElementById("customer-name");
  const phoneInput = document.getElementById("customer-phone");
  const addressInput = document.getElementById("customer-address");
  const notesInput = document.getElementById("customer-notes");

  state.customer.fullName = nameInput ? nameInput.value : "";
  state.customer.phone = phoneInput ? phoneInput.value : "";
  state.customer.address = addressInput ? addressInput.value : "";
  state.customer.notes = notesInput ? notesInput.value : "";

  if (state.customer.fullName.trim().length < 2) {
    showValidationError("Por favor ingresa tu nombre completo para identificar tu pedido.", "customer-name");
    return;
  }

  const cleanPhone = state.customer.phone.replace(/[^\d+]/g, "");
  if (cleanPhone.length < 7) {
    showValidationError("Por favor ingresa un número de teléfono válido.", "customer-phone");
    return;
  }

  if (state.deliveryMode === "delivery" && state.customer.address.trim().length < 6) {
    showValidationError(
      "La dirección exacta es obligatoria para pedidos con envío a domicilio (Delivery).",
      "customer-address"
    );
    return;
  }

  const rawMessage = buildWhatsAppMessage();
  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${MENU_DATA.brand.whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
};

/* ==========================================================================
   INICIALIZACIÓN Y DELEGACIÓN DE EVENTOS
   ========================================================================== */
const updateAllUI = (animatePrice = true) => {
  renderHeroAndCatalog();
  renderProteinSelector();
  renderExclusions();
  renderExtras();
  renderLiveSummaryCard();
  renderStickyBottomBar(animatePrice);
  if (state.isModalOpen) {
    renderCheckoutModal();
  }
};

const initApp = () => {
  updateAllUI(false);

  // Delegación global de clics interactivos
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const action = trigger.dataset.action;

    switch (action) {
      case "select-burger": {
        const burgerId = trigger.dataset.id;
        if (burgerId && burgerId !== state.selectedBurgerId) {
          state.selectedBurgerId = burgerId;
          updateAllUI(true);
        }
        break;
      }

      case "select-protein": {
        const proteinId = trigger.dataset.id;
        if (proteinId && proteinId !== state.selectedProteinId) {
          state.selectedProteinId = proteinId;
          renderProteinSelector();
          renderLiveSummaryCard();
          renderStickyBottomBar(true);
        }
        break;
      }

      case "toggle-exclusion": {
        const exclusionId = trigger.dataset.id;
        if (!exclusionId) return;
        if (state.selectedExclusions.has(exclusionId)) {
          state.selectedExclusions.delete(exclusionId);
        } else {
          state.selectedExclusions.add(exclusionId);
        }
        // Excluir ingredientes no altera el precio, pero actualiza el estado visual y resumen
        renderExclusions();
        renderLiveSummaryCard();
        renderStickyBottomBar(false);
        break;
      }

      case "toggle-extra": {
        const extraId = trigger.dataset.id;
        if (!extraId) return;
        if (state.selectedExtras.has(extraId)) {
          state.selectedExtras.delete(extraId);
        } else {
          state.selectedExtras.add(extraId);
        }
        renderExtras();
        renderLiveSummaryCard();
        renderStickyBottomBar(true);
        break;
      }

      case "change-qty": {
        const delta = parseInt(trigger.dataset.delta, 10) || 0;
        const nextQty = Math.max(1, Math.min(20, state.quantity + delta));
        if (nextQty !== state.quantity) {
          state.quantity = nextQty;
          renderLiveSummaryCard();
          renderStickyBottomBar(true);
        }
        break;
      }

      case "reset-builder": {
        state.selectedProteinId = MENU_DATA.proteins[0].id;
        state.selectedExclusions.clear();
        state.selectedExtras.clear();
        state.quantity = 1;
        updateAllUI(true);
        break;
      }

      case "open-checkout-modal": {
        state.isModalOpen = true;
        clearValidationError();
        renderCheckoutModal();
        break;
      }

      case "close-checkout-modal": {
        state.isModalOpen = false;
        renderCheckoutModal();
        break;
      }

      case "select-delivery-mode": {
        const mode = trigger.dataset.mode;
        if (mode && (mode === "pickup" || mode === "delivery")) {
          state.deliveryMode = mode;
          clearValidationError();
          renderCheckoutModal();
        }
        break;
      }

      case "select-zone": {
        const zoneId = trigger.dataset.zone;
        if (zoneId) {
          state.selectedZoneId = zoneId;
          renderCheckoutModal();
        }
        break;
      }

      default:
        break;
    }
  });

  // Formulario de envío a WhatsApp
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleWhatsAppSubmit);
  }

  // Cerrar modal con tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.isModalOpen) {
      state.isModalOpen = false;
      renderCheckoutModal();
    }
  });
};

document.addEventListener("DOMContentLoaded", initApp);
