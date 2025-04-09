document.addEventListener("DOMContentLoaded", function () {
  // PIN Management System
  const loginOverlay = document.getElementById("loginOverlay");
  const appContainer = document.querySelector(".app-container");
  const pinDots = document.querySelectorAll(".pin-dot");
  const pinError = document.getElementById("pinError");
  const pinKeys = document.querySelectorAll(".pin-key");
  const logoutBtn = document.getElementById("logoutBtn");
  const changePinBtn = document.getElementById("changePinBtn");
  const changePinModal = document.getElementById("changePinModal");
  const setupPinModal = document.getElementById("setupPinModal");

  let currentPIN = "";

  // Load PIN from localStorage or show setup modal for first-time users
  const savedPIN = localStorage.getItem("userPIN");

  if (!savedPIN) {
    // First time user - show PIN setup
    setupPinModal.style.display = "flex";
  }

  // Setup PIN for first-time users
  const saveSetupPinBtn = document.getElementById("saveSetupPinBtn");
  if (saveSetupPinBtn) {
    saveSetupPinBtn.addEventListener("click", function () {
      const setupPin = document.getElementById("setupPin").value;
      const confirmSetupPin = document.getElementById("confirmSetupPin").value;
      const pinSetupError = document.getElementById("pinSetupError");

      // Validate PIN
      if (setupPin.length !== 6 || !/^\d+$/.test(setupPin)) {
        pinSetupError.textContent = "รหัส PIN ต้องเป็นตัวเลข 6 หลัก";
        return;
      }

      if (setupPin !== confirmSetupPin) {
        pinSetupError.textContent = "รหัส PIN ไม่ตรงกัน กรุณาลองอีกครั้ง";
        return;
      }

      // Save PIN to localStorage
      localStorage.setItem("userPIN", setupPin);
      setupPinModal.style.display = "none";
      alert("ตั้งค่ารหัส PIN สำเร็จ");
    });
  }

  // Handle PIN entry
  pinKeys.forEach((key) => {
    key.addEventListener("click", function () {
      const keyValue = this.getAttribute("data-key");

      if (keyValue === "clear") {
        // Clear last digit
        if (currentPIN.length > 0) {
          currentPIN = currentPIN.slice(0, -1);
          updatePINDisplay();
        }
      } else if (keyValue === "enter") {
        // Validate PIN
        if (currentPIN.length < 6) {
          showPINError("กรุณาใส่รหัส PIN ให้ครบ 6 หลัก");
          return;
        }

        // Get PIN from localStorage or use default
        const correctPIN = localStorage.getItem("userPIN") || "123456";

        if (currentPIN === correctPIN) {
          loginSuccess();
        } else {
          loginFailed();
        }
      } else {
        // Add digit to PIN (only if less than 6 digits)
        if (currentPIN.length < 6) {
          currentPIN += keyValue;
          updatePINDisplay();

          // Auto-validate when 6 digits are entered
          if (currentPIN.length === 6) {
            const correctPIN = localStorage.getItem("userPIN") || "123456";
            if (currentPIN === correctPIN) {
              loginSuccess();
            } else {
              loginFailed();
            }
          }
        }
      }
    });
  });

  // Change PIN functionality
  if (changePinBtn) {
    changePinBtn.addEventListener("click", function () {
      changePinModal.style.display = "flex";

      // Reset inputs
      document.getElementById("currentPin").value = "";
      document.getElementById("newPin").value = "";
      document.getElementById("confirmPin").value = "";
      document.getElementById("pinChangeError").textContent = "";
    });
  }

  // Save changed PIN
  const savePinBtn = document.getElementById("savePinBtn");
  if (savePinBtn) {
    savePinBtn.addEventListener("click", function () {
      const currentPin = document.getElementById("currentPin").value;
      const newPin = document.getElementById("newPin").value;
      const confirmPin = document.getElementById("confirmPin").value;
      const pinChangeError = document.getElementById("pinChangeError");

      // Get stored PIN
      const storedPIN = localStorage.getItem("userPIN") || "123456";

      // Validate current PIN
      if (currentPin !== storedPIN) {
        pinChangeError.textContent = "รหัส PIN ปัจจุบันไม่ถูกต้อง";
        return;
      }

      // Validate new PIN format
      if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
        pinChangeError.textContent = "รหัส PIN ใหม่ต้องเป็นตัวเลข 6 หลัก";
        return;
      }

      // Validate PIN confirmation
      if (newPin !== confirmPin) {
        pinChangeError.textContent = "รหัส PIN ใหม่ไม่ตรงกัน กรุณาลองอีกครั้ง";
        return;
      }

      // Save new PIN
      localStorage.setItem("userPIN", newPin);
      changePinModal.style.display = "none";
      alert("เปลี่ยนรหัส PIN สำเร็จ");
    });
  }

  function updatePINDisplay() {
    // Update PIN dots display
    pinDots.forEach((dot, index) => {
      if (index < currentPIN.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    });

    // Clear any error message
    pinError.textContent = "";
  }

  function showPINError(message) {
    pinError.textContent = message;
    document.querySelector(".pin-display").classList.add("shake");

    setTimeout(() => {
      document.querySelector(".pin-display").classList.remove("shake");
    }, 500);
  }

  function loginSuccess() {
    loginOverlay.style.display = "none";
    appContainer.style.display = "block";
  }

  function loginFailed() {
    currentPIN = "";
    updatePINDisplay();
    showPINError("รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่");
  }

  // Handle logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const confirmLogout = confirm("คุณต้องการออกจากระบบใช่หรือไม่?");
      if (confirmLogout) {
        // Reset PIN and show login screen
        currentPIN = "";
        updatePINDisplay();
        appContainer.style.display = "none";
        loginOverlay.style.display = "flex";
        closeAllModals();
      }
    });
  }

  // Add forgot PIN functionality
  const forgotPinLink = document.createElement("p");
  forgotPinLink.className = "forgot-pin";
  forgotPinLink.textContent = "ลืมรหัส PIN?";
  forgotPinLink.addEventListener("click", function () {
    const resetConfirm = confirm("คุณต้องการรีเซ็ตรหัส PIN หรือไม่?");
    if (resetConfirm) {
      localStorage.removeItem("userPIN");
      alert("รีเซ็ตรหัส PIN แล้ว กรุณาตั้งค่ารหัสใหม่");
      setupPinModal.style.display = "flex";
    }
  });

  // Append forgot PIN link to login screen
  const loginBody = document.querySelector(".login-body");
  if (loginBody) {
    loginBody.appendChild(forgotPinLink);
  }

  // Products database
  const products = [
    {
      id: 1,
      name: "เสื้อยืด Cotton 100%",
      price: 350,
      stock: 45,
      category: "เสื้อผ้า",
    },
    {
      id: 2,
      name: "กางเกงยีนส์ขายาว",
      price: 890,
      stock: 20,
      category: "เสื้อผ้า",
    },
    {
      id: 3,
      name: "รองเท้าผ้าใบ",
      price: 1200,
      stock: 15,
      category: "รองเท้า",
    },
    { id: 4, name: "กระเป๋าสะพาย", price: 750, stock: 8, category: "กระเป๋า" },
    { id: 5, name: "เสื้อเชิ้ต", price: 590, stock: 30, category: "เสื้อผ้า" },
    {
      id: 6,
      name: "กางเกงขาสั้น",
      price: 450,
      stock: 25,
      category: "เสื้อผ้า",
    },
    { id: 7, name: "รองเท้าแตะ", price: 250, stock: 40, category: "รองเท้า" },
    { id: 8, name: "กระเป๋าเป้", price: 890, stock: 12, category: "กระเป๋า" },
    {
      id: 9,
      name: "หูฟังบลูทูธ",
      price: 1500,
      stock: 18,
      category: "อุปกรณ์อิเล็กทรอนิกส์",
    },
    {
      id: 10,
      name: "สายชาร์จ USB-C",
      price: 250,
      stock: 50,
      category: "อุปกรณ์อิเล็กทรอนิกส์",
    },
  ];

  // Save products to localStorage for persistence
  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Load products from localStorage if available
  function loadProducts() {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      // Merge the saved products with our products array
      const parsedProducts = JSON.parse(savedProducts);
      parsedProducts.forEach((product) => {
        const existingIndex = products.findIndex((p) => p.id === product.id);
        if (existingIndex !== -1) {
          products[existingIndex] = product;
        } else {
          products.push(product);
        }
      });
    }
  }

  // Try to load products on startup
  loadProducts();

  // Update UI with real data on page load
  function updateUIWithSavedData() {
    // Update stock counts on product list
    products.forEach((product) => {
      const stockElement = document.querySelector(
        `.transaction-item[data-id="${product.id}"] .stock-count`
      );
      if (stockElement) {
        stockElement.textContent = product.stock;

        if (product.stock < 20) {
          stockElement.classList.add("low-stock");
        } else {
          stockElement.classList.remove("low-stock");
        }
      }
    });

    // Update product count
    const productCountStat = document.querySelectorAll(".stat-value")[2];
    if (productCountStat) {
      productCountStat.textContent = products.length;
    }

    // Update today's sales count
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const today = new Date().toLocaleDateString();
    const todayTransactions = transactions.filter((t) => t.date === today);

    const todaySalesCount = document.querySelectorAll(".stat-value")[0];
    if (todaySalesCount) {
      todaySalesCount.textContent = todayTransactions.length || "0";
    }
  }

  // Call this function after loading products
  updateUIWithSavedData();

  // Initialize notifications
  const notificationBadge = document.querySelector(".badge");
  const lowStockItems = products.filter((p) => p.stock < 20);
  if (notificationBadge && lowStockItems.length > 0) {
    notificationBadge.textContent = lowStockItems.length;
    notificationBadge.style.display = "flex";

    // Add click handler for notifications
    const notificationIcon = document.querySelector(".notification-badge");
    if (notificationIcon) {
      notificationIcon.addEventListener("click", function () {
        let message = "สินค้าใกล้หมด:\n-------------------\n";
        lowStockItems.forEach((item) => {
          message += `${item.name}: เหลือ ${item.stock} ชิ้น\n`;
        });
        alert(message);
      });
    }
  } else if (notificationBadge) {
    notificationBadge.style.display = "none";
  }

  // Settings icon functionality
  const settingsIcon = document.querySelector(".header-right .fa-gear");
  if (settingsIcon) {
    settingsIcon.addEventListener("click", function () {
      modals.settingsModal.style.display = "flex";
    });
  }

  // "ดูทั้งหมด" button next to "สินค้าล่าสุด"
  const viewAllRecentBtn = document.querySelector(
    ".transactions-section .view-all"
  );
  if (viewAllRecentBtn) {
    viewAllRecentBtn.addEventListener("click", function () {
      modals.allProductsModal.style.display = "flex";
      renderAllProducts();
    });
  }

  // All modals in the application
  const modals = {
    productModal: document.getElementById("productModal"),
    addProductModal: document.getElementById("addProductModal"),
    searchModal: document.getElementById("searchModal"),
    categoriesModal: document.getElementById("categoriesModal"),
    shippingModal: document.getElementById("shippingModal"),
    reportsModal: document.getElementById("reportsModal"),
    promotionsModal: document.getElementById("promotionsModal"),
    settingsModal: document.getElementById("settingsModal"),
    accountModal: document.getElementById("accountModal"),
    allProductsModal: document.getElementById("allProductsModal"),
    changePinModal: document.getElementById("changePinModal"),
    setupPinModal: document.getElementById("setupPinModal"),
  };

  // Function to close all modals
  function closeAllModals() {
    Object.values(modals).forEach((modal) => {
      if (modal) modal.style.display = "none";
    });
  }

  // Close modal when clicking the X button
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", closeAllModals);
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    Object.entries(modals).forEach(([name, modal]) => {
      if (modal && event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Open product details modal when clicking on a product
  document.querySelectorAll(".transaction-item").forEach((item) => {
    item.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);

      if (product) {
        document.getElementById("modalProductName").textContent = product.name;
        document.getElementById("modalProductId").textContent = product.id;
        document.getElementById(
          "modalProductPrice"
        ).textContent = `฿${product.price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        document.getElementById("modalProductStock").textContent =
          product.stock;
        document.getElementById("modalProductCategory").textContent =
          product.category;

        modals.productModal.style.display = "flex";
      }
    });
  });

  // Toggle active class on bottom navigation items
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");

      // Handle navigation specific actions
      const navId = this.id;
      if (navId === "accountNav") {
        modals.accountModal.style.display = "flex";
      } else if (navId === "scanNav") {
        // Simulate scanning a product
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];

        if (randomProduct) {
          document.getElementById("modalProductName").textContent =
            randomProduct.name;
          document.getElementById("modalProductId").textContent =
            randomProduct.id;
          document.getElementById(
            "modalProductPrice"
          ).textContent = `฿${randomProduct.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
          document.getElementById("modalProductStock").textContent =
            randomProduct.stock;
          document.getElementById("modalProductCategory").textContent =
            randomProduct.category;

          alert(`สแกนบาร์โค้ดสำเร็จ: ${randomProduct.name}`);
          modals.productModal.style.display = "flex";
        } else {
          alert(
            "เปิดกล้องเพื่อสแกนบาร์โค้ดสินค้า\n(ฟีเจอร์นี้อยู่ระหว่างการพัฒนา)"
          );
        }
      } else if (navId === "productsNav") {
        modals.allProductsModal.style.display = "flex";
        renderAllProducts();
      } else if (navId === "reportsNav") {
        modals.reportsModal.style.display = "flex";
      }
    });
  });

  // Make category items clickable
  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", function () {
      const categoryName = this.querySelector(".category-name").textContent;

      // Filter products by the selected category
      modals.allProductsModal.style.display = "flex";
      renderAllProducts();

      // Set the category filter
      const categoryFilter = document.getElementById("categoryFilter");
      if (categoryFilter) {
        categoryFilter.value = categoryName;

        // Trigger the change event
        const event = new Event("change");
        categoryFilter.dispatchEvent(event);
      }
    });
  });

  // Search modal - fix search button
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        const event = new Event("keyup");
        searchInput.dispatchEvent(event);
      }
    });
  }

  // Make search filters work
  const searchFilters = document.querySelectorAll(
    '.search-filters input[type="checkbox"]'
  );
  searchFilters.forEach((filter) => {
    filter.addEventListener("change", function () {
      const searchInput = document.getElementById("searchInput");
      if (searchInput && searchInput.value.length >= 2) {
        const event = new Event("keyup");
        searchInput.dispatchEvent(event);
      }
    });
  });

  // Product search functionality - update to respect filters
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  if (searchInput && searchResults) {
    searchInput.addEventListener("keyup", function () {
      const searchTerm = this.value.toLowerCase();
      searchResults.innerHTML = "";

      if (searchTerm.length < 2) return;

      // Get filter states
      const showAllProducts = document.querySelector(
        '.search-filters input[type="checkbox"]:nth-child(1)'
      ).checked;
      const showInStockOnly = document.querySelector(
        '.search-filters input[type="checkbox"]:nth-child(2)'
      ).checked;

      let filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.id.toString().includes(searchTerm)
      );

      // Apply in-stock filter if needed
      if (showInStockOnly) {
        filteredProducts = filteredProducts.filter(
          (product) => product.stock > 0
        );
      }

      if (filteredProducts.length === 0) {
        searchResults.innerHTML = `<p class="no-results">ไม่พบสินค้าที่ตรงกับ "${searchTerm}"</p>`;
        return;
      }

      filteredProducts.forEach((product) => {
        const resultItem = document.createElement("div");
        resultItem.className = "transaction-item";
        resultItem.setAttribute("data-id", product.id);

        resultItem.innerHTML = `
          <div class="transaction-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="transaction-details">
            <p class="transaction-title">${product.name}</p>
            <p class="transaction-date">คงเหลือ: <span class="stock-count ${
              product.stock < 20 ? "low-stock" : ""
            }">${product.stock}</span> ชิ้น</p>
          </div>
          <p class="transaction-amount deposit">฿${product.price.toLocaleString(
            "en-US"
          )}</p>
        `;

        resultItem.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          const product = products.find((p) => p.id === productId);

          if (product) {
            document.getElementById("modalProductName").textContent =
              product.name;
            document.getElementById("modalProductId").textContent = product.id;
            document.getElementById(
              "modalProductPrice"
            ).textContent = `฿${product.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
            document.getElementById("modalProductStock").textContent =
              product.stock;
            document.getElementById("modalProductCategory").textContent =
              product.category;

            modals.searchModal.style.display = "none";
            modals.productModal.style.display = "flex";
          }
        });

        searchResults.appendChild(resultItem);
      });
    });
  }

  // Settings toggles functionality
  document
    .querySelectorAll("#settingsModal .switch input")
    .forEach((toggle, index) => {
      toggle.addEventListener("change", function () {
        // Apply theme change immediately if it's the dark theme toggle
        if (index === 0) {
          if (this.checked) {
            document.documentElement.classList.add("dark-theme");
          } else {
            document.documentElement.classList.remove("dark-theme");
          }

          // Save theme preference
          localStorage.setItem("darkTheme", this.checked);
        }
      });
    });

  // Load theme preference
  if (localStorage.getItem("darkTheme") === "true") {
    document.documentElement.classList.add("dark-theme");
    const darkThemeToggle = document.querySelector(
      "#settingsModal .switch input"
    );
    if (darkThemeToggle) {
      darkThemeToggle.checked = true;
    }
  }

  // Form validation for adding products
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productStockInput = document.getElementById("productStock");

  [productNameInput, productPriceInput, productStockInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", function () {
        validateProductForm();
      });
    }
  });

  function validateProductForm() {
    const submitBtn = document.querySelector("#addProductForm .btn-submit");
    if (!submitBtn) return;

    const name = productNameInput ? productNameInput.value.trim() : "";
    const price = productPriceInput ? parseFloat(productPriceInput.value) : 0;
    const stock = productStockInput ? parseInt(productStockInput.value) : 0;

    if (name && !isNaN(price) && price > 0 && !isNaN(stock) && stock >= 0) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    } else {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
    }
  }

  // Enhance product card display
  function renderAllProducts() {
    const productsList = document.getElementById("allProductsList");
    if (!productsList) return;

    productsList.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.setAttribute("data-id", product.id);
      productCard.setAttribute("data-category", product.category);

      productCard.innerHTML = `
        <div class="product-image">
          <i class="fas fa-box"></i>
        </div>
        <div class="product-info">
          <div class="product-title">${product.name}</div>
          <div class="product-price">฿${product.price.toLocaleString(
            "en-US"
          )}</div>
          <div class="product-stock">คงเหลือ: <span class="${
            product.stock < 20 ? "low-stock" : ""
          }">${product.stock}</span> ชิ้น</div>
        </div>
      `;

      productCard.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);

        if (product) {
          document.getElementById("modalProductName").textContent =
            product.name;
          document.getElementById("modalProductId").textContent = product.id;
          document.getElementById(
            "modalProductPrice"
          ).textContent = `฿${product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
          document.getElementById("modalProductStock").textContent =
            product.stock;
          document.getElementById("modalProductCategory").textContent =
            product.category;

          modals.productModal.style.display = "flex";
        }
      });

      productsList.appendChild(productCard);
    });
  }

  // Transaction history - enhance with date range filtering
  const historyBtn = document.querySelector(".history-btn");
  if (historyBtn) {
    historyBtn.addEventListener("click", function () {
      // Get transactions from localStorage
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );

      if (transactions.length === 0) {
        alert("ไม่มีประวัติการขาย");
        return;
      }

      // Show most recent transactions first
      transactions.reverse();

      let historyText = "ประวัติการขาย\n-------------------\n";

      // Show last 5 transactions or all if less than 5
      const transactionsToShow = transactions.slice(0, 5);

      transactionsToShow.forEach((t) => {
        historyText += `${t.date} - ${t.product} x ${
          t.quantity
        } - ฿${t.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}\n`;
      });

      // Show total transactions
      historyText += `\nรวมทั้งหมด: ${transactions.length} รายการ`;

      // Add option to see all transactions
      if (transactions.length > 5) {
        historyText += "\n\nต้องการดูรายการทั้งหมดหรือไม่?";

        const showAll = confirm(historyText);
        if (showAll) {
          let allHistoryText = "ประวัติการขายทั้งหมด\n-------------------\n";

          transactions.forEach((t, index) => {
            allHistoryText += `${index + 1}. ${t.date} - ${t.product} x ${
              t.quantity
            } - ฿${t.amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}\n`;
          });

          alert(allHistoryText);
        }
      } else {
        alert(historyText);
      }
    });
  }

  // Confirmation Action Modal setup
  const confirmActionModal = document.getElementById("confirmActionModal");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmMessage = document.getElementById("confirmMessage");
  const confirmActionBtn = document.getElementById("confirmActionBtn");
  const cancelActionBtn = document.getElementById("cancelActionBtn");

  let currentConfirmAction = null;

  function showConfirmation(title, message, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmActionModal.style.display = "flex";

    // Store the callback for when user confirms
    currentConfirmAction = callback;
  }

  // Confirm button event
  if (confirmActionBtn) {
    confirmActionBtn.addEventListener("click", function () {
      confirmActionModal.style.display = "none";
      if (typeof currentConfirmAction === "function") {
        currentConfirmAction();
        currentConfirmAction = null;
      }
    });
  }

  // Cancel button event
  if (cancelActionBtn) {
    cancelActionBtn.addEventListener("click", function () {
      confirmActionModal.style.display = "none";
      currentConfirmAction = null;
    });
  }

  // Add sale button functionality - ปรับปรุงให้สมบูรณ์มากขึ้น
  const addSaleBtn = document.querySelector(".add-money-btn");
  if (addSaleBtn) {
    addSaleBtn.addEventListener("click", function () {
      // Create a product selection interface as a modal instead of alert
      const selectProductModal = document.createElement("div");
      selectProductModal.className = "modal";
      selectProductModal.style.display = "flex";

      selectProductModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>เลือกสินค้าที่ต้องการขาย</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <input type="text" id="saleSearchInput" placeholder="ค้นหาสินค้า...">
            </div>
            <div class="product-list">
              ${products
                .map(
                  (p) => `
                <div class="transaction-item sale-product-item" data-id="${
                  p.id
                }">
                  <div class="transaction-icon">
                    <i class="fas fa-box"></i>
                  </div>
                  <div class="transaction-details">
                    <p class="transaction-title">${p.name}</p>
                    <p class="transaction-date">คงเหลือ: <span class="stock-count ${
                      p.stock < 20 ? "low-stock" : ""
                    }">${p.stock}</span> ชิ้น</p>
                  </div>
                  <p class="transaction-amount deposit">฿${p.price.toLocaleString(
                    "en-US"
                  )}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(selectProductModal);

      // Add close button functionality
      const closeButton = selectProductModal.querySelector(".close-modal");
      closeButton.addEventListener("click", function () {
        document.body.removeChild(selectProductModal);
      });

      // Add search functionality
      const searchInput = selectProductModal.querySelector("#saleSearchInput");
      const productItems =
        selectProductModal.querySelectorAll(".sale-product-item");

      searchInput.addEventListener("input", function () {
        const term = this.value.toLowerCase();
        productItems.forEach((item) => {
          const title = item
            .querySelector(".transaction-title")
            .textContent.toLowerCase();
          if (title.includes(term)) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      });

      // Add product selection functionality
      productItems.forEach((item) => {
        item.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          const product = products.find((p) => p.id === productId);

          if (product) {
            // Remove the modal
            document.body.removeChild(selectProductModal);

            // Create a quantity selection modal
            const quantityModal = document.createElement("div");
            quantityModal.className = "modal";
            quantityModal.style.display = "flex";

            quantityModal.innerHTML = `
              <div class="modal-content">
                <div class="modal-header">
                  <h3>ระบุจำนวนสินค้า</h3>
                  <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                  <div class="product-info" style="text-align: center; margin-bottom: 20px;">
                    <h4>${product.name}</h4>
                    <p>ราคา: ฿${product.price.toLocaleString("en-US")}</p>
                    <p>คงเหลือ: ${product.stock} ชิ้น</p>
                  </div>
                  <div class="form-group">
                    <label for="saleQuantity">จำนวน</label>
                    <div class="quantity-control">
                      <button type="button" class="quantity-btn minus">-</button>
                      <input type="number" id="saleQuantity" min="1" max="${
                        product.stock
                      }" value="1">
                      <button type="button" class="quantity-btn plus">+</button>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>ราคารวม</label>
                    <p class="total-price">฿${product.price.toLocaleString(
                      "en-US"
                    )}</p>
                  </div>
                  <button class="btn-submit" id="confirmSaleBtn">ยืนยันการขาย</button>
                </div>
              </div>
            `;

            document.body.appendChild(quantityModal);

            // Add quantity controls
            const quantityInput = quantityModal.querySelector("#saleQuantity");
            const minusBtn = quantityModal.querySelector(".minus");
            const plusBtn = quantityModal.querySelector(".plus");
            const totalPrice = quantityModal.querySelector(".total-price");

            function updateTotalPrice() {
              const quantity = parseInt(quantityInput.value) || 1;
              const total = product.price * quantity;
              totalPrice.textContent = `฿${total.toLocaleString("en-US")}`;
            }

            minusBtn.addEventListener("click", function () {
              const currentValue = parseInt(quantityInput.value) || 1;
              if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateTotalPrice();
              }
            });

            plusBtn.addEventListener("click", function () {
              const currentValue = parseInt(quantityInput.value) || 1;
              if (currentValue < product.stock) {
                quantityInput.value = currentValue + 1;
                updateTotalPrice();
              }
            });

            quantityInput.addEventListener("input", updateTotalPrice);

            // Add close button functionality
            const closeQuantityBtn =
              quantityModal.querySelector(".close-modal");
            closeQuantityBtn.addEventListener("click", function () {
              document.body.removeChild(quantityModal);
            });

            // Confirm sale
            const confirmSaleBtn =
              quantityModal.querySelector("#confirmSaleBtn");
            confirmSaleBtn.addEventListener("click", function () {
              const quantity = parseInt(quantityInput.value) || 1;

              if (quantity <= 0 || quantity > product.stock) {
                alert("กรุณาระบุจำนวนให้ถูกต้อง");
                return;
              }

              const totalAmount = product.price * quantity;

              // Update total sales in localStorage
              let totalSales = parseFloat(
                localStorage.getItem("totalSales") || "125000"
              );
              totalSales += totalAmount;
              localStorage.setItem("totalSales", totalSales.toString());

              // Update UI with total sales
              const currentBalance = document.querySelector(".balance-amount");
              currentBalance.textContent = `฿${totalSales.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`;

              // Update product stock
              product.stock -= quantity;
              saveProducts();

              // Update the stats
              const todaySales = document.querySelector(".stat-value");
              let salesCount = parseInt(todaySales.textContent || "0");
              salesCount += 1;
              todaySales.textContent = salesCount;

              // Save transaction history
              const transactions = JSON.parse(
                localStorage.getItem("transactions") || "[]"
              );
              transactions.push({
                date: new Date().toLocaleDateString(),
                product: product.name,
                quantity: quantity,
                amount: totalAmount,
              });
              localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
              );

              // Find and update the displayed stock for this product
              const stockElement = document.querySelector(
                `.transaction-item[data-id="${product.id}"] .stock-count`
              );
              if (stockElement) {
                stockElement.textContent = product.stock;

                if (product.stock < 20) {
                  stockElement.classList.add("low-stock");
                } else {
                  stockElement.classList.remove("low-stock");
                }
              }

              // Show success message with animation
              addSaleBtn.classList.add("pulse");
              setTimeout(() => {
                addSaleBtn.classList.remove("pulse");
              }, 2000);

              // Remove the modal
              document.body.removeChild(quantityModal);

              // Show success message
              showSaleCompletedDialog(product.name, quantity, totalAmount);
            });
          }
        });
      });
    });
  }

  // แสดงข้อความยืนยันการขายสำเร็จ
  function showSaleCompletedDialog(productName, quantity, totalAmount) {
    const completedModal = document.createElement("div");
    completedModal.className = "modal";
    completedModal.style.display = "flex";

    completedModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>บันทึกการขายสำเร็จ</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body" style="text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 15px;"></i>
          <h4>ขายสินค้าสำเร็จ!</h4>
          <div class="sale-details" style="margin: 15px 0; text-align: left; background: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>สินค้า:</strong> ${productName}</p>
            <p><strong>จำนวน:</strong> ${quantity} ชิ้น</p>
            <p><strong>ยอดรวม:</strong> ฿${totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</p>
          </div>
          <div class="action-buttons" style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-submit" style="background-color: #6c757d; max-width: 150px;">พิมพ์ใบเสร็จ</button>
            <button class="btn-submit" style="max-width: 150px;" id="saleCompletedOkBtn">ตกลง</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(completedModal);

    // Close button
    const closeBtn = completedModal.querySelector(".close-modal");
    closeBtn.addEventListener("click", function () {
      document.body.removeChild(completedModal);
    });

    // OK button
    const okBtn = completedModal.querySelector("#saleCompletedOkBtn");
    okBtn.addEventListener("click", function () {
      document.body.removeChild(completedModal);
    });
  }

  // ระบบจำลองการสแกนบาร์โค้ด
  const scanBtn = document.getElementById("scanBtn");
  if (scanBtn) {
    scanBtn.addEventListener("click", function () {
      showSimulatedScanner();
    });
  }

  function showSimulatedScanner() {
    const scannerModal = document.createElement("div");
    scannerModal.className = "modal";
    scannerModal.style.display = "flex";

    scannerModal.innerHTML = `
      <div class="modal-content scanner-modal">
        <div class="modal-header">
          <h3>สแกนบาร์โค้ดสินค้า</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="scanner-container">
            <div class="scanner-viewfinder">
              <div class="scanner-laser"></div>
              <div class="scanner-corners">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
              </div>
            </div>
            <div class="scanner-instruction">
              <p>จัดตำแหน่งบาร์โค้ดให้อยู่ในกรอบ</p>
            </div>
          </div>
          <div class="button-container" style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button class="btn-submit" style="flex: 1; margin-right: 10px;" id="enterCodeManually">ใส่รหัสด้วยตนเอง</button>
            <button class="btn-submit" style="flex: 1; margin-left: 10px; background-color: #28a745;" id="simulateScan">จำลองการสแกน</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(scannerModal);

    // กำหนดเสียงเมื่อสแกนสำเร็จ
    const scanSound = document.createElement("audio");
    scanSound.src =
      "https://www.soundjay.com/buttons/sounds/button-09.mp3"; // URL เสียงสแกน
    scanSound.setAttribute("preload", "auto");

    // คลิกปิด
    const closeBtn = scannerModal.querySelector(".close-modal");
    closeBtn.addEventListener("click", function () {
      document.body.removeChild(scannerModal);
    });

    // จำลองการสแกน
    const simulateScanBtn = scannerModal.querySelector("#simulateScan");
    simulateScanBtn.addEventListener("click", function () {
      // แสดงการสแกน
      const viewfinder = scannerModal.querySelector(".scanner-viewfinder");
      viewfinder.classList.add("scanning");

      // เล่นเสียงสแกน
      scanSound.play();

      // จำลองเวลาในการสแกน
      setTimeout(() => {
        // เลือกสินค้าแบบสุ่ม
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];

        // ปิด modal scanner
        document.body.removeChild(scannerModal);

        // แสดงผลการสแกน
        showScannedProductResult(randomProduct);
      }, 1500);
    });

    // ปุ่มใส่รหัสด้วยตนเอง
    const enterCodeBtn = scannerModal.querySelector("#enterCodeManually");
    enterCodeBtn.addEventListener("click", function () {
      // สร้าง prompt รับรหัสสินค้า
      const manualCodeModal = document.createElement("div");
      manualCodeModal.className = "modal";
      manualCodeModal.style.display = "flex";

      manualCodeModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>ใส่รหัสสินค้า</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="manualProductCode">รหัสบาร์โค้ดสินค้า</label>
              <input type="text" id="manualProductCode" inputmode="numeric" placeholder="ตัวอย่าง: 8850123456789">
            </div>
            <button class="btn-submit" id="findProductBtn">ค้นหาสินค้า</button>
          </div>
        </div>
      `;

      // ปิด scanner modal ก่อน
      document.body.removeChild(scannerModal);

      // เพิ่ม manual code modal เข้า DOM
      document.body.appendChild(manualCodeModal);

      // เมื่อปิด manual code modal
      const closeCodeBtn = manualCodeModal.querySelector(".close-modal");
      closeCodeBtn.addEventListener("click", function () {
        document.body.removeChild(manualCodeModal);
      });

      // เมื่อคลิกปุ่มค้นหาสินค้า
      const findBtn = manualCodeModal.querySelector("#findProductBtn");
      findBtn.addEventListener("click", function () {
        const codeInput = document.getElementById("manualProductCode");
        const code = codeInput.value.trim();

        if (code === "") {
          showToast("กรุณาใส่รหัสบาร์โค้ดสินค้า", "warning");
          return;
        }

        // จำลองการหาสินค้าจากรหัส (ใช้เลขที่รับมาเป็น ID)
        let productId = parseInt(code.substring(0, 2)) % products.length;
        if (productId === 0) productId = 1; // ไม่ให้เป็น 0

        const product = products.find((p) => p.id === productId);
        if (product) {
          document.body.removeChild(manualCodeModal);
          showScannedProductResult(product);
        } else {
          showToast("ไม่พบสินค้าที่ตรงกับรหัสนี้", "error");
        }
      });
    });
  }

  // แสดงผลลัพธ์สินค้าที่สแกนได้
  function showScannedProductResult(product) {
    const resultModal = document.createElement("div");
    resultModal.className = "modal";
    resultModal.style.display = "flex";

    resultModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>ผลการสแกนสินค้า</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body" style="text-align: center">
          <div class="scanned-product">
            <div class="product-image" style="margin: 0 auto 15px">
              <i class="fas fa-box" style="font-size: 40px; color: var(--primary-color)"></i>
            </div>
            <h4 style="margin-bottom: 15px">${product.name}</h4>
            <p class="barcode" style="margin-bottom: 20px; font-family: 'Courier New', monospace; letter-spacing: 2px; font-size: 14px;">
              #${Array(8)
                .fill(0)
                .map(() => Math.floor(Math.random() * 10))
                .join("")}${product.id.toString().padStart(4, "0")}
            </p>
            <div class="product-details" style="background: #f5f5f5; padding: 15px; border-radius: 10px; text-align: left; margin-bottom: 20px">
              <p style="display: flex; justify-content: space-between; margin-bottom: 8px">
                <span>รหัสสินค้า:</span> <span>#${product.id}</span>
              </p>
              <p style="display: flex; justify-content: space-between; margin-bottom: 8px">
                <span>ราคา:</span> <span style="font-weight: bold; color: var(--secondary-color)">฿${product.price.toLocaleString(
                  "en-US"
                )}</span>
              </p>
              <p style="display: flex; justify-content: space-between; margin-bottom: 8px">
                <span>คงเหลือ:</span> <span class="${
                  product.stock < 20 ? "low-stock" : ""
                }">${product.stock} ชิ้น</span>
              </p>
              <p style="display: flex; justify-content: space-between">
                <span>หมวดหมู่:</span> <span>${product.category}</span>
              </p>
            </div>
            <div class="scanned-actions" style="display: flex; gap: 10px">
              <button class="btn-submit" style="flex: 1; background-color: var(--primary-color)" id="sellScannedBtn">
                <i class="fas fa-shopping-cart"></i> ขายสินค้านี้
              </button>
              <button class="btn-submit" style="flex: 1; background-color: #007bff" id="viewScannedBtn">
                <i class="fas fa-info-circle"></i> ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(resultModal);

    // ปิด modal
    const closeBtn = resultModal.querySelector(".close-modal");
    closeBtn.addEventListener("click", function () {
      document.body.removeChild(resultModal);
    });

    // ปุ่มขายสินค้า
    const sellBtn = resultModal.querySelector("#sellScannedBtn");
    sellBtn.addEventListener("click", function () {
      document.body.removeChild(resultModal);

      // สร้างหน้าต่างสำหรับระบุจำนวนเพื่อขาย
      const quantityModal = document.createElement("div");
      quantityModal.className = "modal";
      quantityModal.style.display = "flex";

      quantityModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>ระบุจำนวนสินค้า</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="product-info" style="text-align: center; margin-bottom: 20px;">
              <h4>${product.name}</h4>
              <p>ราคา: ฿${product.price.toLocaleString("en-US")}</p>
              <p>คงเหลือ: ${product.stock} ชิ้น</p>
            </div>
            <div class="form-group">
              <label for="saleQuantity">จำนวน</label>
              <div class="quantity-control">
                <button type="button" class="quantity-btn minus">-</button>
                <input type="number" id="saleQuantity" min="1" max="${product.stock}" value="1">
                <button type="button" class="quantity-btn plus">+</button>
              </div>
            </div>
            <div class="form-group">
              <label>ราคารวม</label>
              <p class="total-price" style="font-size: 20px; font-weight: bold; color: var(--secondary-color); text-align: center;">
                ฿${product.price.toLocaleString("en-US")}
              </p>
            </div>
            <button class="btn-submit" id="confirmSaleBtn">ยืนยันการขาย</button>
          </div>
        </div>
      `;

      document.body.appendChild(quantityModal);

      // ควบคุมจำนวน
      const quantityInput = quantityModal.querySelector("#saleQuantity");
      const minusBtn = quantityModal.querySelector(".minus");
      const plusBtn = quantityModal.querySelector(".plus");
      const totalPrice = quantityModal.querySelector(".total-price");

      function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value) || 1;
        const total = product.price * quantity;
        totalPrice.textContent = `฿${total.toLocaleString("en-US")}`;
      }

      minusBtn.addEventListener("click", function () {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          updateTotalPrice();
        }
      });

      plusBtn.addEventListener("click", function () {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < product.stock) {
          quantityInput.value = currentValue + 1;
          updateTotalPrice();
        }
      });

      quantityInput.addEventListener("input", updateTotalPrice);

      // ปิด modal
      const closeQuantityBtn = quantityModal.querySelector(".close-modal");
      closeQuantityBtn.addEventListener("click", function () {
        document.body.removeChild(quantityModal);
      });

      // ยืนยันการขาย
      const confirmSaleBtn = quantityModal.querySelector("#confirmSaleBtn");
      confirmSaleBtn.addEventListener("click", function () {
        const quantity = parseInt(quantityInput.value) || 1;

        if (quantity <= 0 || quantity > product.stock) {
          showToast("กรุณาระบุจำนวนให้ถูกต้อง", "warning");
          return;
        }

        const totalAmount = product.price * quantity;

        // อัพเดตยอดขาย
        let totalSales = parseFloat(
          localStorage.getItem("totalSales") || "125000"
        );
        totalSales += totalAmount;
        localStorage.setItem("totalSales", totalSales.toString());

        // อัพเดตสต็อค
        product.stock -= quantity;
        saveProducts();

        // อัพเดต UI
        const currentBalance = document.querySelector(".balance-amount");
        if (currentBalance) {
          currentBalance.textContent = `฿${totalSales.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }

        // อัพเดตการขายวันนี้
        const todaySales = document.querySelector(".stat-value");
        if (todaySales) {
          let salesCount = parseInt(todaySales.textContent || "0");
          salesCount += 1;
          todaySales.textContent = salesCount;
        }

        // บันทึกประวัติการขาย
        const transactions = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );
        transactions.push({
          date: new Date().toLocaleDateString(),
          product: product.name,
          quantity: quantity,
          amount: totalAmount,
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));

        // อัพเดตการแสดงผลสต็อค
        updateProductDisplay(product);

        // ปิด modal
        document.body.removeChild(quantityModal);

        // แสดงผลการขาย
        showSaleCompletedDialog(product.name, quantity, totalAmount);
      });
    });

    // ปุ่มดูรายละเอียด
    const viewBtn = resultModal.querySelector("#viewScannedBtn");
    viewBtn.addEventListener("click", function () {
      document.getElementById("modalProductName").textContent = product.name;
      document.getElementById("modalProductId").textContent = product.id;
      document.getElementById("modalProductPrice").textContent = `฿${product.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      document.getElementById("modalProductStock").textContent = product.stock;
      document.getElementById("modalProductCategory").textContent =
        product.category;

      // ปิด result modal และเปิด product modal
      document.body.removeChild(resultModal);
      modals.productModal.style.display = "flex";
    });
  }

  // ระบบพิมพ์ใบเสร็จ
  function printReceipt(product, quantity, totalAmount) {
    // สร้าง modal สำหรับแสดงตัวอย่างใบเสร็จก่อนพิมพ์
    const receiptModal = document.createElement("div");
    receiptModal.className = "modal";
    receiptModal.style.display = "flex";

    // ข้อมูลร้าน
    const storeInfo = {
      name: "เสี่ยกาน แท่นปั้ม หมากยาง",
      address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพ 10110",
      tel: "02-123-4567",
      taxId: "0-1234-56789-00-0",
    };

    // วันที่และเวลาปัจจุบัน
    const now = new Date();
    const dateStr = now.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("th-TH");

    // สร้างเลขที่ใบเสร็จ
    const receiptNo = `INV${now.getFullYear()}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, "0")}`;

    // คำนวณภาษี
    const vat = totalAmount * 0.07;
    const priceBeforeVat = totalAmount - vat;

    receiptModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>ตัวอย่างใบเสร็จรับเงิน</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="receipt-preview" style="background: white; padding: 20px; border: 1px solid #ddd; font-family: 'Courier New', monospace; max-width: 100%;">
            <div style="text-align: center; margin-bottom: 10px;">
              <h3 style="margin: 0 0 5px 0; font-size: 16px;">${storeInfo.name}</h3>
              <p style="margin: 0; font-size: 12px;">${storeInfo.address}</p>
              <p style="margin: 0; font-size: 12px;">โทร: ${storeInfo.tel} / เลขที่ผู้เสียภาษี: ${storeInfo.taxId}</p>
              <p style="margin: 5px 0; font-size: 12px;">---------------------------------------</p>
              <h4 style="margin: 5px 0; font-size: 14px;">ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ</h4>
              <p style="margin: 0; font-size: 12px;">---------------------------------------</p>
            </div>

            <div style="margin-bottom: 10px; font-size: 12px;">
              <p style="margin: 0">เลขที่: ${receiptNo}</p>
              <p style="margin: 0">วันที่: ${dateStr} ${timeStr}</p>
              <p style="margin: 0">พนักงาน: ผู้ดูแลร้าน</p>
            </div>

            <div style="margin-bottom: 10px; font-size: 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px dashed #ddd;">
                  <th style="text-align: left; padding: 5px 0;">รายการ</th>
                  <th style="text-align: right; padding: 5px 0;">ราคา</th>
                  <th style="text-align: right; padding: 5px 0;">จำนวน</th>
                  <th style="text-align: right; padding: 5px 0;">รวม</th>
                </tr>
                <tr>
                  <td style="text-align: left; padding: 5px 0;">${product.name}</td>
                  <td style="text-align: right; padding: 5px 0;">฿${product.price.toLocaleString(
                    "en-US"
                  )}</td>
                  <td style="text-align: right; padding: 5px 0;">${quantity}</td>
                  <td style="text-align: right; padding: 5px 0;">฿${totalAmount.toLocaleString(
                    "en-US"
                  )}</td>
                </tr>
              </table>
            </div>

            <div style="font-size: 12px; text-align: right;">
              <p style="margin: 0; padding: 5px 0; display: flex; justify-content: space-between;">
                <span>รวมเป็นเงิน</span>
                <span>฿${totalAmount.toLocaleString("en-US")}</span>
              </p>
              <p style="margin: 0; padding: 5px 0; display: flex; justify-content: space-between;">
                <span>ราคาก่อนภาษี</span>
                <span>฿${priceBeforeVat.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span>
              </p>
              <p style="margin: 0; padding: 5px 0; display: flex; justify-content: space-between;">
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span>฿${vat.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span>
              </p>
              <p style="margin: 10px 0; border-top: 1px dashed #ddd; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold;">
                <span>ยอดรวมทั้งสิ้น</span>
                <span>฿${totalAmount.toLocaleString("en-US")}</span>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; font-size: 12px;">
              <p style="margin: 0;">---------------------------------------</p>
              <p style="margin: 5px 0;">ขอบคุณที่ใช้บริการ</p>
              <p style="margin: 0;">สินค้าที่ซื้อไปแล้วไม่สามารถเปลี่ยนหรือคืนได้</p>
              <div style="margin-top: 10px;">
                <svg id="barcode" style="max-width: 80%; height: 30px;"></svg>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="btn-submit" style="flex: 1; background-color: #6c757d;" id="printReceiptBtn">
              <i class="fas fa-print"></i> พิมพ์ใบเสร็จ
            </button>
            <button class="btn-submit" style="flex: 1;" id="closeReceiptBtn">ปิด</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(receiptModal);

    // ปุ่มปิด
    const closeButtons = receiptModal.querySelectorAll(
      ".close-modal, #closeReceiptBtn"
    );
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        document.body.removeChild(receiptModal);
      });
    });

    // ปุ่มพิมพ์
    const printBtn = receiptModal.querySelector("#printReceiptBtn");
    printBtn.addEventListener("click", function () {
      // จำลองการพิมพ์
      showToast("กำลังส่งไปยังเครื่องพิมพ์...", "info");

      setTimeout(() => {
        showToast("พิมพ์ใบเสร็จเรียบร้อยแล้ว", "success");
        document.body.removeChild(receiptModal);
      }, 1500);
    });
  }

  // อัพเดตฟังก์ชัน showSaleCompletedDialog เพื่อเพิ่มปุ่มพิมพ์ใบเสร็จ
  function showSaleCompletedDialog(productName, quantity, totalAmount) {
    const completedModal = document.createElement("div");
    completedModal.className = "modal";
    completedModal.style.display = "flex";

    completedModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>บันทึกการขายสำเร็จ</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body" style="text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 15px;"></i>
          <h4>ขายสินค้าสำเร็จ!</h4>
          <div class="sale-details" style="margin: 15px 0; text-align: left; background: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>สินค้า:</strong> ${productName}</p>
            <p><strong>จำนวน:</strong> ${quantity} ชิ้น</p>
            <p><strong>ยอดรวม:</strong> ฿${totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</p>
          </div>
          <div class="action-buttons" style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-submit" style="background-color: #6c757d; max-width: 150px;">พิมพ์ใบเสร็จ</button>
            <button class="btn-submit" style="max-width: 150px;" id="saleCompletedOkBtn">ตกลง</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(completedModal);

    // Close button
    const closeBtn = completedModal.querySelector(".close-modal");
    closeBtn.addEventListener("click", function () {
      document.body.removeChild(completedModal);
    });

    // OK button
    const okBtn = completedModal.querySelector("#saleCompletedOkBtn");
    okBtn.addEventListener("click", function () {
      document.body.removeChild(completedModal);
    });

    // เพิ่ม event listener สำหรับปุ่มพิมพ์ใบเสร็จ
    const printReceiptBtn = completedModal.querySelector(
      'button[style*="background-color: #6c757d"]'
    );
    if (printReceiptBtn) {
      printReceiptBtn.addEventListener("click", function () {
        document.body.removeChild(completedModal);

        // หาข้อมูลสินค้า
        const product = products.find((p) => p.name === productName);
        if (product) {
          printReceipt(product, quantity, totalAmount);
        }
      });
    }
  }

  // ระบบสำรองและกู้คืนข้อมูล
  function addDataBackupRestore() {
    // เพิ่มตัวเลือกในหน้าตั้งค่า
    const settingsSection = document.querySelector(
      ".settings-section:last-child"
    );
    if (settingsSection) {
      const backupItem = document.createElement("div");
      backupItem.className = "setting-item";
      backupItem.innerHTML = `
        <span>สำรองและกู้คืนข้อมูล</span>
        <button class="btn-small" id="backupRestoreBtn">จัดการ</button>
      `;

      settingsSection.appendChild(backupItem);

      // เพิ่ม event listener สำหรับปุ่มจัดการข้อมูล
      const backupRestoreBtn = document.getElementById("backupRestoreBtn");
      if (backupRestoreBtn) {
        backupRestoreBtn.addEventListener("click", function () {
          showBackupRestoreModal();
        });
      }
    }
  }

  function showBackupRestoreModal() {
    const backupModal = document.createElement("div");
    backupModal.className = "modal";
    backupModal.style.display = "flex";

    backupModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>สำรองและกู้คืนข้อมูล</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="backup-section" style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px; color: var(--primary-color);">สำรองข้อมูล</h4>
            <p style="margin-bottom: 15px; font-size: 14px;">สำรองข้อมูลสินค้า, การตั้งค่า, และประวัติการขายของคุณ</p>
            <button class="btn-submit" id="backupDataBtn">
              <i class="fas fa-download"></i> สำรองข้อมูล
            </button>
          </div>

          <div class="restore-section" style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px; color: var(--primary-color);">กู้คืนข้อมูล</h4>
            <p style="margin-bottom: 15px; font-size: 14px;">นำเข้าข้อมูลจากไฟล์สำรองที่มีอยู่</p>
            <div class="form-group">
              <input type="file" id="restoreFileInput" accept=".json" style="display: none;">
              <button class="btn-submit" style="background-color: #007bff;" id="selectRestoreFileBtn">
                <i class="fas fa-upload"></i> เลือกไฟล์สำรอง
              </button>
            </div>
          </div>

          <div class="auto-backup-section">
            <h4 style="margin-bottom: 10px; color: var(--primary-color);">การสำรองข้อมูลอัตโนมัติ</h4>
            <div class="setting-item" style="margin-bottom: 10px;">
              <span>สำรองข้อมูลอัตโนมัติทุกวัน</span>
              <label class="switch">
                <input type="checkbox" id="autoBackupToggle">
                <span class="slider round"></span>
              </label>
            </div>
            <p style="font-size: 12px; color: #666;">
              การสำรองข้อมูลอัตโนมัติจะช่วยป้องกันการสูญหายของข้อมูลหากเกิดปัญหาขึ้น
            </p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backupModal);

    // ปุ่มปิด
    const closeBtn = backupModal.querySelector(".close-modal");
    closeBtn.addEventListener("click", function () {
      document.body.removeChild(backupModal);
    });

    // ตรวจสอบการตั้งค่าสำรองข้อมูลอัตโนมัติที่บันทึกไว้
    const autoBackupToggle = backupModal.querySelector("#autoBackupToggle");
    const autoBackupEnabled = localStorage.getItem("autoBackup") === "true";
    if (autoBackupToggle) {
      autoBackupToggle.checked = autoBackupEnabled;

      // บันทึกการตั้งค่าเมื่อเปลี่ยน
      autoBackupToggle.addEventListener("change", function () {
        localStorage.setItem("autoBackup", this.checked);

        if (this.checked) {
          showToast("เปิดใช้งานการสำรองข้อมูลอัตโนมัติแล้ว", "success");
        } else {
          showToast("ปิดการสำรองข้อมูลอัตโนมัติแล้ว", "info");
        }
      });
    }

    // ปุ่มสำรองข้อมูล
    const backupBtn = backupModal.querySelector("#backupDataBtn");
    backupBtn.addEventListener("click", function () {
      exportData();
    });

    // ปุ่มเลือกไฟล์สำรอง
    const selectFileBtn = backupModal.querySelector("#selectRestoreFileBtn");
    const fileInput = backupModal.querySelector("#restoreFileInput");

    selectFileBtn.addEventListener("click", function () {
      fileInput.click();
    });

    fileInput.addEventListener("change", function (e) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];

        // ตรวจสอบว่าเป็นไฟล์ JSON
        if (
          file.type !== "application/json" &&
          !file.name.endsWith(".json")
        ) {
          showToast("กรุณาเลือกไฟล์ JSON เท่านั้น", "error");
          return;
        }

        // อ่านไฟล์
        const reader = new FileReader();
        reader.onload = function (event) {
          try {
            const data = JSON.parse(event.target.result);

            // ตรวจสอบว่าข้อมูลถูกต้อง
            if (!data.products || !data.appVersion) {
              showToast("ไฟล์สำรองไม่ถูกต้อง", "error");
              return;
            }

            // ยืนยันการกู้คืน
            showConfirmation(
              "ยืนยันการกู้คืนข้อมูล",
              "การกู้คืนข้อมูลจะแทนที่ข้อมูลปัจจุบัน คุณต้องการดำเนินการต่อหรือไม่?",
              function () {
                importData(data);
                document.body.removeChild(backupModal);
              }
            );
          } catch (error) {
            showToast(
              "เกิดข้อผิดพลาดในการอ่านไฟล์: " + error.message,
              "error"
            );
          }
        };

        reader.readAsText(file);
      }
    });
  }

  // ส่งออกข้อมูลเป็นไฟล์ JSON
  function exportData() {
    // รวบรวมข้อมูลที่ต้องการสำรอง
    const backupData = {
      appVersion: "1.0.0",
      exportDate: new Date().toISOString(),
      products: products,
      settings: JSON.parse(localStorage.getItem("settings") || "{}"),
      categories: JSON.parse(localStorage.getItem("categories") || "[]"),
      promotions: JSON.parse(localStorage.getItem("promotions") || "[]"),
      transactions: JSON.parse(localStorage.getItem("transactions") || "[]"),
      shippingSettings: JSON.parse(
        localStorage.getItem("shippingSettings") || "[]"
      ),
      totalSales: localStorage.getItem("totalSales") || "0",
    };

    // แปลงเป็น JSON
    const jsonData = JSON.stringify(backupData, null, 2);

    // สร้าง Blob
    const blob = new Blob([jsonData], { type: "application/json" });

    // สร้าง URL
    const url = URL.createObjectURL(blob);

    // สร้างลิงก์ดาวน์โหลด
    const downloadLink = document.createElement("a");
    downloadLink.href = url;

    // ตั้งชื่อไฟล์
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    downloadLink.download = `stockapp_backup_${dateStr}.json`;

    // เพิ่มลิงก์ลงใน DOM และคลิก
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // ลบลิงก์และ URL
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      showToast("สำรองข้อมูลสำเร็จ", "success");
    }, 100);
  }

  // นำเข้าข้อมูลจากไฟล์ JSON
  function importData(data) {
    try {
      // อัพเดตข้อมูลสินค้า
      if (data.products && Array.isArray(data.products)) {
        // แทนที่ข้อมูลสินค้าทั้งหมด
        while (products.length) products.pop();
        data.products.forEach((p) => products.push(p));
        saveProducts();
      }

      // บันทึกข้อมูลอื่นๆ ลง localStorage
      if (data.settings)
        localStorage.setItem("settings", JSON.stringify(data.settings));
      if (data.categories)
        localStorage.setItem("categories", JSON.stringify(data.categories));
      if (data.promotions)
        localStorage.setItem("promotions", JSON.stringify(data.promotions));
      if (data.transactions)
        localStorage.setItem("transactions", JSON.stringify(data.transactions));
      if (data.shippingSettings)
        localStorage.setItem(
          "shippingSettings",
          JSON.stringify(data.shippingSettings)
        );
      if (data.totalSales) localStorage.setItem("totalSales", data.totalSales);

      // อัพเดต UI
      updateUIWithSavedData();
      loadCategories();
      updateCategoryCounts();
      loadPromotions();
      loadShippingSettings();

      // อัพเดตธีม
      if (data.settings && data.settings.darkTheme) {
        if (data.settings.darkTheme) {
          document.documentElement.classList.add("dark-theme");
        } else {
          document.documentElement.classList.remove("dark-theme");
        }
      }

      showToast(
        "กู้คืนข้อมูลสำเร็จ กรุณารีเฟรชหน้าเพื่อให้มั่นใจว่าข้อมูลถูกต้อง",
        "success",
        5000
      );
    } catch (error) {
      showToast(
        "เกิดข้อผิดพลาดในการกู้คืนข้อมูล: " + error.message,
        "error"
      );
      console.error("Error importing data:", error);
    }
  }

  // เพิ่มวิดเจ็ตแสดงข้อมูลสรุปบนหน้าหลัก
  function addDashboardWidgets() {
    // สร้างส่วนแสดงข้อมูลวิดเจ็ต
    const dashboardSection = document.createElement("section");
    dashboardSection.className = "dashboard-section";

    // ข้อมูลสรุป
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const today = new Date().toLocaleDateString();
    const todayTransactions = transactions.filter((t) => t.date === today);
    const todaySales = todayTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // ข้อมูลสินค้าใกล้หมด
    const lowStockCount = products.filter((p) => p.stock < 20).length;

    dashboardSection.innerHTML = `
      <div class="section-header">
        <h3 class="section-title">ข้อมูลสรุป</h3>
      </div>
      <div class="widget-container">
        <div class="dashboard-widget sales-widget">
          <div class="widget-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="widget-info">
            <span class="widget-label">ยอดขายวันนี้</span>
            <span class="widget-value">฿${todaySales.toLocaleString(
              "en-US"
            )}</span>
          </div>
        </div>

        <div class="dashboard-widget orders-widget">
          <div class="widget-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="widget-info">
            <span class="widget-label">คำสั่งซื้อวันนี้</span>
            <span class="widget-value">${todayTransactions.length}</span>
          </div>
        </div>

        <div class="dashboard-widget stock-widget ${
          lowStockCount > 0 ? "alert" : ""
        }">
          <div class="widget-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="widget-info">
            <span class="widget-label">สินค้าใกล้หมด</span>
            <span class="widget-value">${lowStockCount}</span>
          </div>
        </div>
      </div>
    `;

    // เพิ่มวิดเจ็ตเข้าไปในหน้าหลักระหว่าง quick-actions และ services-section
    const quickActions = document.querySelector(".quick-actions");
    const servicesSection = document.querySelector(".services-section");

    if (quickActions && servicesSection) {
      quickActions.parentNode.insertBefore(dashboardSection, servicesSection);
    }

    // เพิ่ม event listener สำหรับวิดเจ็ต
    const salesWidget = dashboardSection.querySelector(".sales-widget");
    const stockWidget = dashboardSection.querySelector(".stock-widget");

    if (salesWidget) {
      salesWidget.addEventListener("click", function () {
        // เปิดรายงานยอดขาย
        generateReport("sales");
      });
    }

    if (stockWidget) {
      stockWidget.addEventListener("click", function () {
        if (lowStockCount > 0) {
          // ถ้ามีสินค้าใกล้หมด ให้เปิดรายการสินค้าใกล้หมด
          document.querySelector(".notification-badge").click();
        } else {
          // ถ้าไม่มี ให้เปิดรายงานสินค้าคงเหลือ
          generateReport("inventory");
        }
      });
    }
  }

  // ระบบอัพโหลดรูปภาพสินค้า
  function addProductImageUpload() {
    // หาฟอร์มเพิ่มสินค้า
    const addProductForm = document.querySelector("#addProductForm");
    if (addProductForm) {
      // สร้าง field สำหรับอัพโหลดรูปภาพ
      const imageField = document.createElement("div");
      imageField.className = "form-group";
      imageField.innerHTML = `
        <label for="productImage">รูปภาพสินค้า (ไม่บังคับ)</label>
        <div class="image-upload-container">
          <div class="product-image-preview">
            <i class="fas fa-image"></i>
          </div>
          <button type="button" class="btn-small upload-btn">เลือกรูปภาพ</button>
          <input type="file" id="productImage" accept="image/*" style="display: none">
        </div>
      `;

      // แทรกก่อนปุ่มบันทึก
      const submitBtn = addProductForm.querySelector(".btn-submit");
      addProductForm.insertBefore(imageField, submitBtn);

      // ปุ่มเลือกรูปภาพ
      const uploadBtn = imageField.querySelector(".upload-btn");
      const fileInput = imageField.querySelector("#productImage");
      const preview = imageField.querySelector(".product-image-preview");

      uploadBtn.addEventListener("click", function () {
        fileInput.click();
      });

      // แสดงตัวอย่างรูปภาพ
      fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const reader = new FileReader();

          reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
          };

          reader.readAsDataURL(this.files[0]);
        }
      });

      // แก้ไข event listener ของฟอร์มเพื่อรวมรูปภาพ
      addProductForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // เก็บข้อมูลรูปภาพ
        let imageData = null;
        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();

          reader.onload = function (e) {
            imageData = e.target.result;

            // ทำงานต่อจากการอ่านรูปภาพ
            saveNewProduct(imageData);
          };

          reader.readAsDataURL(fileInput.files[0]);
        } else {
          // ไม่มีรูปภาพก็บันทึกต่อไป
          saveNewProduct(null);
        }
      });

      function saveNewProduct(imageData) {
        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(
          document.getElementById("productPrice").value
        );
        const stock = parseInt(document.getElementById("productStock").value);
        const category = document.getElementById("productCategory").value;

        // ตรวจสอบข้อมูล
        if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
          alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
          return;
        }

        // สร้าง ID ใหม่
        const newId =
          products.length > 0
            ? Math.max(...products.map((p) => p.id)) + 1
            : 1;

        // เพิ่มสินค้าใหม่
        const newProduct = {
          id: newId,
          name: name,
          price: price,
          stock: stock,
          category: category,
          image: imageData, // เพิ่มข้อมูลรูปภาพ
        };

        products.push(newProduct);
        saveProducts();

        // อัพเดตจำนวนสินค้า
        const productCountStat = document.querySelectorAll(".stat-value")[2];
        if (productCountStat) {
          productCountStat.textContent = products.length;
        }

        // รีเซ็ตฟอร์ม
        addProductForm.reset();
        preview.innerHTML = '<i class="fas fa-image"></i>';

        // ปิด modal
        modals.addProductModal.style.display = "none";

        // แสดงข้อความสำเร็จ
        showToast(`เพิ่มสินค้า "${name}" สำเร็จ`, "success");
      }
    }

    // แก้ไขการแสดงรูปภาพในรายละเอียดสินค้า
    function updateProductModalToShowImage() {
      // อัพเดตฟังก์ชันเปิดรายละเอียดสินค้า
      document.querySelectorAll(".transaction-item").forEach((item) => {
        item.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          const product = products.find((p) => p.id === productId);

          if (product) {
            const productImage = document.querySelector(
              "#productModal .product-image"
            );

            // ถ้ามีรูปภาพให้แสดง
            if (product.image) {
              productImage.innerHTML = `<img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
            } else {
              productImage.innerHTML =
                '<i class="fas fa-box product-placeholder"></i>';
            }

            // ...rest of the code to update product details
          }
        });
      });
    }

    // เรียกใช้ฟังก์ชันอัพเดต
    updateProductModalToShowImage();
  }

  // เรียกใช้ฟังก์ชันเพิ่มเติม
  addDataBackupRestore();
  addDashboardWidgets();
  addProductImageUpload();

  // เพิ่ม CSS สำหรับฟีเจอร์ใหม่
  const additionalCSS = document.createElement("style");
  additionalCSS.textContent = `
    /* Scanner styles */
    .scanner-modal {
      max-width: 450px;
    }

    .scanner-container {
      position: relative;
      width: 100%;
      height: 250px;
      background-color: #000;
      border-radius: 10px;
      overflow: hidden;
    }

    .scanner-viewfinder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      height: 40%;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 10px;
    }

    .scanner-laser {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--primary-color);
      animation: scanning 2s linear infinite;
    }

    @keyframes scanning {
      0% { top: 0; }
      50% { top: 100%; }
      100% { top: 0; }
    }

    .scanner-corners .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: var(--primary-color);
      border-style: solid;
      border-width: 0;
    }

    .corner.top-left {
      top: -2px;
      left: -2px;
      border-top-width: 4px;
      border-left-width: 4px;
      border-top-left-radius: 8px;
    }

    .corner.top-right {
      top: -2px;
      right: -2px;
      border-top-width: 4px;
      border-right-width: 4px;
      border-top-right-radius: 8px;
    }

    .corner.bottom-left {
      bottom: -2px;
      left: -2px;
      border-bottom-width: 4px;
      border-left-width: 4px;
      border-bottom-left-radius: 8px;
    }

    .corner.bottom-right {
      bottom: -2px;
      right: -2px;
      border-bottom-width: 4px;
      border-right-width: 4px;
      border-bottom-right-radius: 8px;
    }

    .scanner-instruction {
      position: absolute;
      bottom: 15px;
      left: 0;
      right: 0;
      text-align: center;
      color: white;
      font-size: 14px;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 5px;
    }

    .scanner-viewfinder.scanning {
      box-shadow: 0 0 0 4px rgba(205, 89, 11, 0.3);
    }

    /* Dashboard widgets */
    .dashboard-section {
      margin: 15px 15px 20px;
    }

    .widget-container {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 5px;
    }

    .dashboard-widget {
      flex: 1;
      min-width: 120px;
      background-color: var(--card-background);
      border-radius: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .dashboard-widget:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .widget-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 18px;
    }

    .sales-widget .widget-icon {
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }

    .orders-widget .widget-icon {
      background-color: rgba(0, 123, 255, 0.1);
      color: #007bff;
    }

    .stock-widget .widget-icon {
      background-color: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .stock-widget.alert .widget-icon {
      background-color: rgba(220, 53, 69, 0.1);
      color: #dc3545;
      animation: pulse 1.5s infinite;
    }

    .widget-info {
      display: flex;
      flex-direction: column;
    }

    .widget-label {
      font-size: 12px;
      color: var(--dark-gray);
      margin-bottom: 2px;
    }

    .widget-value {
      font-size: 16px;
      font-weight: bold;
      color: var(--text-color);
    }

    /* Image upload styles */
    .image-upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .product-image-preview {
      width: 100px;
      height: 100px;
      background-color: var(--light-gray);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .product-image-preview i {
      font-size: 40px;
      color: var(--dark-gray);
    }

    .upload-btn {
      padding: 8px 15px;
    }

    /* Quantity control */
    .quantity-control {
      display: flex;
      align-items: center;
      max-width: 150px;
      margin: 0 auto;
    }

    .quantity-btn {
      width: 36px;
      height: 36px;
      background: #f0f0f0;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }

    .quantity-btn:hover {
      background: #e0e0e0;
    }

    .quantity-control input {
      text-align: center;
      margin: 0 8px;
      width: 60px;
    }
  `;

  document.head.appendChild(additionalCSS);

  // Rest of the code
  updateUIWithSavedData();
});
