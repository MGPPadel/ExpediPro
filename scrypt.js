  // ---------- DATOS DE LA APLICACIÓN ----------
    let contactos = [
        {id: 1, nombre: 'Juan Pérez', telefono: '1122334455', email: 'juan.perez@email.com', dni: '30123456', domicilio: 'Av. Siempre Viva 123', notas: 'Cliente principal'},
        {id: 2, nombre: 'María García', telefono: '9988776655', email: 'maria.garcia@email.com', dni: '32987654', domicilio: 'Calle Falsa 456', notas: 'Parte demandada'},
        {id: 3, nombre: 'Carlos López', telefono: '5544332211', email: 'c.lopez@email.com', dni: '28555666', domicilio: 'Pje. Corto 789', notas: ''},
        {id: 4, nombre: 'Ana Martínez', telefono: '1234567890', email: 'a.martinez@email.com', dni: '35111222', domicilio: 'Blvd. Ancho 101', notas: 'Testigo clave'},
    ];
    let casos = [
      {id: 1, expediente: "123/25", actorId: 1, demandadoId: 2, objeto: "Cobro de pesos", fuero: "Civil", juzgado: "Juzgado 2", provincia: "CABA", abogado: "Dr. López", telefono: "123456789", movimientos: [], pruebas: []},
      {id: 2, expediente: "456/25", actorId: 3, demandadoId: 4, objeto: "Despido", fuero: "Laboral", juzgado: "Juzgado 5", provincia: "Bs As", abogado: "Dr. Pérez", telefono: "987654321", movimientos: [], pruebas: []}
    ];
    let vencimientos = [
      {id: 1, titulo: "Audiencia Testimonial", fecha: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0], casoId: 1, recordatorio: 5},
      {id: 2, titulo: "Presentar Escrito", fecha: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString().split('T')[0], casoId: 2, recordatorio: 10},
      {id: 3, titulo: "Vencimiento de Plazo", fecha: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], casoId: null, recordatorio: 1}
    ];
    let facturacion = [
        {id: 1, concepto: 'Honorarios por demanda', fecha: '2025-08-20', monto: 50000, tipo: 'Honorarios', estado: 'Pagado', casoId: 1},
        {id: 2, concepto: 'Gasto de sellado', fecha: '2025-08-21', monto: 3500, tipo: 'Gasto con Comprobante', estado: 'Pendiente', casoId: 1},
        {id: 3, concepto: 'Adelanto de gastos', fecha: '2025-08-22', monto: 15000, tipo: 'Honorarios', estado: 'Pendiente', casoId: 2},
    ];
    let tareas = [
        {id: 1, descripcion: 'Llamar a perito contador', fechaLimite: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], estado: 'Pendiente', casoId: 1},
        {id: 2, descripcion: 'Preparar alegatos', fechaLimite: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], estado: 'Pendiente', casoId: 2},
        {id: 3, descripcion: 'Renovar matrícula', fechaLimite: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], estado: 'Completada', casoId: null},
    ];

    // ---------- ESTADO DE LA UI ----------
    let currentCaseId = null;
    let currentPruebaId = null;
    let currentMovementIndex = null;
    let movementContext = 'main';
    let caseMode = "create";
    let movementMode = "create";
    let vencimientoMode = "create";
    let pruebaMode = "create";
    let facturacionMode = "create";
    let contactoMode = "create";
    let tareaMode = "create";
    let keptFiles = []; 
    let newFiles = [];
    let sortConfig = { key: 'expediente', direction: 'ascending' };
    let searchQuery = '';
    let quillEditor = null;
    let calendarDate = new Date();

    // ---------- REFERENCIAS DOM (agrupadas por funcionalidad) ----------
    const toast = document.getElementById("toast");
    // Vistas y Pestañas
    const tabDashboard = document.getElementById("tab-dashboard");
    const tabCasos = document.getElementById("tab-casos");
    const tabContactos = document.getElementById("tab-contactos");
    const tabCalendario = document.getElementById("tab-calendario");
    const tabTareas = document.getElementById("tab-tareas");
    const tabVencimientos = document.getElementById("tab-vencimientos");
    const tabFacturacion = document.getElementById("tab-facturacion");
    const dashboardView = document.getElementById("dashboard-view");
    const casosView = document.getElementById("casos-view");
    const contactosView = document.getElementById("contactos-view");
    const calendarioView = document.getElementById("calendario-view");
    const tareasView = document.getElementById("tareas-view");
    const vencimientosView = document.getElementById("vencimientos-view");
    const facturacionView = document.getElementById("facturacion-view");
    // Casos
    const searchCasosInput = document.getElementById('search-casos');
    const caseListBody = document.getElementById("case-list-body");
    const addCaseBtn = document.getElementById("addCaseBtn");
    const caseModal = document.getElementById("case-modal");
    const xCaseBtn = document.getElementById("x-case-btn");
    const cancelCaseBtn = document.getElementById("cancel-case-btn");
    const caseForm = document.getElementById("case-form");
    const caseModalTitle = document.getElementById("case-modal-title");
    const casosThead = document.querySelector('#casos-view thead');
    // Detalles de Caso
    const detailsModal = document.getElementById("details-modal");
    const closeDetailsBtn = document.getElementById("close-details-btn");
    const detailsContent = document.getElementById("details-content");
    // Movimientos
    const movementList = document.getElementById("movement-list");
    const addMovementBtn = document.getElementById("add-movement-btn");
    const movementModal = document.getElementById("movement-modal");
    const xMovementBtn = document.getElementById("x-movement-btn");
    const cancelMovementBtn = document.getElementById("cancel-movement-btn");
    const movementForm = document.getElementById("movement-form");
    const movementModalTitle = document.getElementById("movement-modal-title");
    const movArchivosInput = document.getElementById("mov-archivos");
    const filePreview = document.getElementById("file-preview");
    const viewMovementModal = document.getElementById('view-movement-modal');
    const closeViewMovementBtn = document.getElementById('close-view-movement-btn');
    const viewMovementContent = document.getElementById('view-movement-content');
    const exportDocxBtn = document.getElementById('export-docx-btn');
    const editMovFromViewBtn = document.getElementById('edit-mov-from-view-btn');
    const deleteMovFromViewBtn = document.getElementById('delete-mov-from-view-btn');
    // Pruebas
    const addPruebaBtn = document.getElementById('add-prueba-btn');
    const pruebaList = document.getElementById('prueba-list');
    const pruebaFormModal = document.getElementById('prueba-form-modal');
    const pruebaModalTitle = document.getElementById('prueba-modal-title');
    const xPruebaFormBtn = document.getElementById('x-prueba-form-btn');
    const cancelPruebaBtn = document.getElementById('cancel-prueba-btn');
    const pruebaForm = document.getElementById('prueba-form');
    const pruebaDetailModal = document.getElementById('prueba-detail-modal');
    const closePruebaDetailBtn = document.getElementById('close-prueba-detail-btn');
    const pruebaDetailTitle = document.getElementById('prueba-detail-title');
    const pruebaDetailSubtitle = document.getElementById('prueba-detail-subtitle');
    const pruebaMovementList = document.getElementById('prueba-movement-list');
    const addPruebaMovementBtn = document.getElementById('add-prueba-movement-btn');
    // Vencimientos
    const addVencimientoBtn = document.getElementById("addVencimientoBtn");
    const vencimientoListBody = document.getElementById("vencimiento-list-body");
    const vencimientoModal = document.getElementById("vencimiento-modal");
    const xVencimientoBtn = document.getElementById("x-vencimiento-btn");
    const cancelVencimientoBtn = document.getElementById("cancel-vencimiento-btn");
    const vencimientoForm = document.getElementById("vencimiento-form");
    const vencimientoModalTitle = document.getElementById("vencimiento-modal-title");
    const vencimientoCasoIdSelect = document.getElementById("vencimiento-caso-id");
    // Facturación
    const addFacturacionBtn = document.getElementById('addFacturacionBtn');
    const facturacionListBody = document.getElementById('facturacion-list-body');
    const facturacionModal = document.getElementById('facturacion-modal');
    const xFacturacionBtn = document.getElementById('x-facturacion-btn');
    const cancelFacturacionBtn = document.getElementById('cancel-facturacion-btn');
    const facturacionForm = document.getElementById('facturacion-form');
    const facturacionModalTitle = document.getElementById('facturacion-modal-title');
    const addFacturacionFromCaseBtn = document.getElementById('add-facturacion-from-case-btn');
    const caseFacturacionList = document.getElementById('case-facturacion-list');
    const generateReportBtn = document.getElementById('generate-report-btn');
    // Contactos
    const addContactoBtn = document.getElementById('addContactoBtn');
    const contactoListBody = document.getElementById('contacto-list-body');
    const contactoModal = document.getElementById('contacto-modal');
    const xContactoBtn = document.getElementById('x-contacto-btn');
    const cancelContactoBtn = document.getElementById('cancel-contacto-btn');
    const contactoForm = document.getElementById('contacto-form');
    const contactoModalTitle = document.getElementById('contacto-modal-title');
    // Calendario
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const calendarGrid = document.getElementById('calendar-grid');
    // Tareas
    const addTareaBtn = document.getElementById('addTareaBtn');
    const tareaListBody = document.getElementById('tarea-list-body');
    const tareaModal = document.getElementById('tarea-modal');
    const xTareaBtn = document.getElementById('x-tarea-btn');
    const cancelTareaBtn = document.getElementById('cancel-tarea-btn');
    const tareaForm = document.getElementById('tarea-form');
    const tareaModalTitle = document.getElementById('tarea-modal-title');
    
    // ---------- UTILIDADES ----------
    const allModals = [caseModal, detailsModal, movementModal, vencimientoModal, pruebaFormModal, pruebaDetailModal, viewMovementModal, facturacionModal, contactoModal, tareaModal];
    function anyModalOpen() { return !allModals.every(m => m.classList.contains('hidden')); }
    function lockScroll() { document.body.style.overflow = 'hidden'; }
    function unlockScroll() { document.body.style.overflow = ''; }

    function openModal(el) {
      el.classList.remove('hidden');
      const card = el.querySelector('.modal-card');
      if (card) {
        card.classList.remove('modal-exit');
        requestAnimationFrame(() => card.classList.add('modal-enter'));
      }
      lockScroll();
    }

    function closeModal(el) {
      const card = el.querySelector('.modal-card');
      if (card) {
        card.classList.remove('modal-enter');
        card.classList.add('modal-exit');
        setTimeout(() => {
          el.classList.add('hidden');
          card.classList.remove('modal-exit');
          if (!anyModalOpen()) unlockScroll();
        }, 180);
      } else {
        el.classList.add('hidden');
        if (!anyModalOpen()) unlockScroll();
      }
    }

    allModals.forEach(modal => {
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") { allModals.forEach(m => closeModal(m)); }
    });

    let toastTimeout = null;
    function showToast(msg = "Acción realizada", type = "success", ms = 2600) {
      toast.textContent = msg;
      toast.className = 'toast ' + type + ' show';
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, ms);
    }

    function clearFieldError(input) {
      if (!input) return;
      const next = input.nextElementSibling;
      if (next && next.classList.contains('input-error')) next.remove();
      input.classList.remove('border-red-400');
    }
    function showFieldError(input, msg) {
      if (!input) return;
      clearFieldError(input);
      const div = document.createElement('div');
      div.className = 'input-error';
      div.textContent = msg;
      input.classList.add('border-red-400');
      input.parentNode.insertBefore(div, input.nextSibling);
    }
    function clearAllErrors(form) {
      form.querySelectorAll('.input-error').forEach(el => el.remove());
      form.querySelectorAll('input, select, textarea').forEach(i => i.classList.remove('border-red-400'));
    }
    
    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // ---------- NAVEGACIÓN POR PESTAÑAS ----------
    function switchTab(tabName) {
        const views = { 'dashboard': dashboardView, 'casos': casosView, 'contactos': contactosView, 'calendario': calendarioView, 'tareas': tareasView, 'vencimientos': vencimientosView, 'facturacion': facturacionView };
        const tabs = { 'dashboard': tabDashboard, 'casos': tabCasos, 'contactos': tabContactos, 'calendario': tabCalendario, 'tareas': tabTareas, 'vencimientos': tabVencimientos, 'facturacion': tabFacturacion };
        
        Object.keys(views).forEach(key => {
            views[key].classList.toggle('hidden', key !== tabName);
            tabs[key].classList.toggle('active', key === tabName);
        });
        if (tabName === 'dashboard') {
            renderDashboard();
        }
        if (tabName === 'calendario') {
            renderCalendar();
        }
    }
    tabDashboard.addEventListener('click', () => switchTab('dashboard'));
    tabCasos.addEventListener('click', () => switchTab('casos'));
    tabContactos.addEventListener('click', () => switchTab('contactos'));
    tabCalendario.addEventListener('click', () => switchTab('calendario'));
    tabTareas.addEventListener('click', () => switchTab('tareas'));
    tabVencimientos.addEventListener('click', () => switchTab('vencimientos'));
    tabFacturacion.addEventListener('click', () => switchTab('facturacion'));

    // ---------- RENDERIZADO Y LÓGICA DE VISTAS ----------
    function updateCasesView() {
        let filteredCasos = [...casos];
        if (searchQuery) {
            const normalizedQuery = normalizeString(searchQuery.toLowerCase());
            filteredCasos = filteredCasos.filter(c => {
                const actor = contactos.find(con => con.id === c.actorId);
                const demandado = contactos.find(con => con.id === c.demandadoId);
                const caratula = actor && demandado ? normalizeString(`${actor.nombre} vs. ${demandado.nombre}`.toLowerCase()) : '';
                return normalizeString(c.expediente.toLowerCase()).includes(normalizedQuery) ||
                       caratula.includes(normalizedQuery) ||
                       normalizeString(c.fuero.toLowerCase()).includes(normalizedQuery) ||
                       normalizeString(c.juzgado.toLowerCase()).includes(normalizedQuery);
            });
        }
        filteredCasos.sort((a, b) => {
            let valA, valB;
            if (sortConfig.key === 'caratula') {
                const actorA = contactos.find(con => con.id === a.actorId)?.nombre || '';
                const demandadoA = contactos.find(con => con.id === a.demandadoId)?.nombre || '';
                valA = `${actorA} vs. ${demandadoA}`;
                const actorB = contactos.find(con => con.id === b.actorId)?.nombre || '';
                const demandadoB = contactos.find(con => con.id === b.demandadoId)?.nombre || '';
                valB = `${actorB} vs. ${demandadoB}`;
            } else {
                 valA = a[sortConfig.key];
                 valB = b[sortConfig.key];
            }
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        renderCases(filteredCasos);
        updateSortIcons();
    }

    function renderCases(casosToRender) {
      caseListBody.innerHTML = "";
      casosToRender.forEach(c => {
        const actor = contactos.find(con => con.id === c.actorId);
        const demandado = contactos.find(con => con.id === c.demandadoId);
        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-700 hover-row";
        tr.dataset.id = c.id;
        tr.innerHTML = `
          <td class="px-6 py-4">${c.expediente}</td>
          <td class="px-6 py-4">${actor?.nombre || '?'} vs. ${demandado?.nombre || '?'}</td>
          <td class="px-6 py-4">${c.fuero}</td>
          <td class="px-6 py-4">${c.juzgado}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex justify-end items-center space-x-2">
                <button class="view-btn bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1 rounded-md">Ver</button>
                <button class="edit-case-btn bg-gray-600 hover:bg-gray-500 text-white text-xs px-2.5 py-1 rounded-md">Editar</button>
                <button class="delete-case-btn bg-red-800 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md">Borrar</button>
            </div>
          </td>
        `;
        caseListBody.appendChild(tr);
      });
    }
    
    function updateSortIcons() {
        document.querySelectorAll('.sortable-header .sort-icon').forEach(icon => icon.textContent = '');
        const activeHeader = document.querySelector(`.sortable-header[data-sort="${sortConfig.key}"] .sort-icon`);
        if (activeHeader) {
            activeHeader.textContent = sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
    }

    function renderMovements(movementsArray, listElement) {
        listElement.innerHTML = "";
        if (!movementsArray || movementsArray.length === 0) {
            listElement.innerHTML = "<p class='text-gray-400'>Sin movimientos registrados.</p>";
            return;
        }
        movementsArray.forEach((m, index) => {
            const li = document.createElement("li");
            li.className = "bg-gray-700 p-4 rounded-lg shadow cursor-pointer";
            li.dataset.index = index;
            const filesCount = (m.archivos && m.archivos.length) ? m.archivos.length : 0;
            li.innerHTML = `
              <div class="flex justify-between items-center">
                <span class="font-semibold text-white">${m.fecha}</span>
                <div class="flex items-center gap-3">
                  <span class="px-2 py-1 text-xs rounded ${m.tipo === "sentencia" ? "bg-red-600" : m.tipo === "decreto" ? "bg-blue-600" : "bg-green-600"}">
                    ${m.tipo}
                  </span>
                  ${filesCount ? `<span class="text-xs text-gray-300">${filesCount} archivo(s)</span>` : ""}
                </div>
              </div>
              <p class="text-gray-300 mt-1">${m.descripcion}</p>
            `;
            listElement.appendChild(li);
        });
    }

    function renderVencimientos() {
        vencimientoListBody.innerHTML = "";
        vencimientos.forEach(v => {
            const casoVinculado = v.casoId ? casos.find(c => c.id === v.casoId) : null;
            const actor = casoVinculado ? contactos.find(con => con.id === casoVinculado.actorId) : null;
            const demandado = casoVinculado ? contactos.find(con => con.id === casoVinculado.demandadoId) : null;
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-700 hover-row";
            tr.dataset.id = v.id;
            tr.innerHTML = `
                <td class="px-6 py-4">${v.titulo}</td>
                <td class="px-6 py-4">${casoVinculado ? `${casoVinculado.expediente} (${actor?.nombre} vs ${demandado?.nombre})` : "—"}</td>
                <td class="px-6 py-4">${v.fecha}</td>
                <td class="px-6 py-4">${v.recordatorio} días antes</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end items-center space-x-2">
                        <button class="edit-vencimiento-btn bg-gray-600 hover:bg-gray-500 text-white text-xs px-2.5 py-1 rounded-md">Editar</button>
                        <button class="delete-vencimiento-btn bg-red-800 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md">Borrar</button>
                    </div>
                </td>
            `;
            vencimientoListBody.appendChild(tr);
        });
    }

    // ---------- LÓGICA DE CASOS (CRUD, BÚSQUEDA, ORDEN) ----------
    addCaseBtn.addEventListener("click", () => {
      caseMode = "create";
      caseForm.reset();
      document.getElementById('case-id').value = '';
      clearAllErrors(caseForm);
      caseModalTitle.textContent = "Agregar Nuevo Caso";
      document.getElementById("case-fuero-otro").classList.add("hidden");
      populateContactosSelect(document.getElementById('case-actorId'));
      populateContactosSelect(document.getElementById('case-demandadoId'));
      openModal(caseModal);
    });
    xCaseBtn.addEventListener("click", () => closeModal(caseModal));
    cancelCaseBtn.addEventListener("click", () => closeModal(caseModal));

    document.getElementById("case-fuero").addEventListener("change", (e) => {
      const other = document.getElementById("case-fuero-otro");
      e.target.value === "Otro" ? other.classList.remove("hidden") : other.classList.add("hidden");
    });

    caseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors(caseForm);
      const id = document.getElementById('case-id').value;
      const expedienteInput = document.getElementById("case-expediente");
      const expediente = expedienteInput.value.trim();
      
      let hasError = false;
      if (!document.getElementById("case-actorId").value) { showFieldError(document.getElementById("case-actorId"), "Seleccione el actor."); hasError = true; }
      if (!document.getElementById("case-demandadoId").value) { showFieldError(document.getElementById("case-demandadoId"), "Seleccione el demandado."); hasError = true; }
      if (!expediente) { showFieldError(expedienteInput, "Ingrese el número de expediente."); hasError = true; }
      if (!document.getElementById("case-fuero").value) { showFieldError(document.getElementById("case-fuero"), "Seleccione un fuero."); hasError = true; }
      if (document.getElementById("case-fuero").value === "Otro" && !document.getElementById("case-fuero-otro").value.trim()) { showFieldError(document.getElementById("case-fuero-otro"), "Especifique el fuero."); hasError = true; }
      if (!document.getElementById("case-juzgado").value.trim()) { showFieldError(document.getElementById("case-juzgado"), "Ingrese la nominación."); hasError = true; }

      if (expediente && casos.some(c => c.expediente.toLowerCase() === expediente.toLowerCase() && c.id !== Number(id))) {
        showFieldError(expedienteInput, "Ya existe un expediente con ese número.");
        hasError = true;
      }
      if (hasError) { showToast("Corrija los errores.", "warn"); return; }
      
      const fueroSel = document.getElementById("case-fuero").value;
      const fueroOtro = document.getElementById("case-fuero-otro").value.trim();
      const fuero = fueroSel === "Otro" ? fueroOtro : fueroSel;

      const casoData = {
        actorId: Number(document.getElementById("case-actorId").value),
        demandadoId: Number(document.getElementById("case-demandadoId").value),
        expediente,
        objeto: document.getElementById("case-objeto").value.trim(),
        fuero,
        juzgado: document.getElementById("case-juzgado").value.trim(),
        provincia: document.getElementById("case-provincia").value.trim(),
        abogado: document.getElementById("case-abogado").value.trim(),
        telefono: document.getElementById("case-telefono").value.trim(),
      };

      if (caseMode === 'edit') {
        const index = casos.findIndex(c => c.id === Number(id));
        if (index > -1) {
          casos[index] = { ...casos[index], ...casoData };
          showToast("Caso actualizado con éxito ✅", "success");
        }
      } else {
        const newId = casos.length ? Math.max(...casos.map(c => c.id)) + 1 : 1;
        casos.push({ id: newId, ...casoData, movimientos: [], pruebas: [] });
        showToast("Caso creado con éxito ✅", "success");
      }
      
      updateCasesView();
      renderVencimientos();
      closeModal(caseModal);
    });

    caseListBody.addEventListener("click", (e) => {
      const target = e.target;
      const caseId = Number(target.closest("tr").dataset.id);
      const caso = casos.find(c => c.id === caseId);
      if(!caso) return;
      
      if (target.classList.contains("view-btn")) {
        currentCaseId = caseId;
        const actor = contactos.find(c => c.id === caso.actorId);
        const demandado = contactos.find(c => c.id === caso.demandadoId);
        detailsContent.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div><strong>Actor:</strong><div class="mt-1">${actor?.nombre || 'N/A'}</div></div>
            <div><strong>Demandado:</strong><div class="mt-1">${demandado?.nombre || 'N/A'}</div></div>
            <div><strong>N° Expediente:</strong><div class="mt-1">${caso.expediente}</div></div>
            <div><strong>Objeto del juicio:</strong><div class="mt-1">${caso.objeto || "—"}</div></div>
            <div><strong>Fuero:</strong><div class="mt-1">${caso.fuero}</div></div>
            <div><strong>Nominación:</strong><div class="mt-1">${caso.juzgado}</div></div>
            <div><strong>Provincia/Ciudad:</strong><div class="mt-1">${caso.provincia || "—"}</div></div>
            <div><strong>Abogado otra parte:</strong><div class="mt-1">${caso.abogado || "—"}</div></div>
            <div class="md:col-span-2"><strong>Teléfono del abogado:</strong><div class="mt-1">${caso.telefono || "—"}</div></div>
          </div>
        `;
        renderMovements(caso.movimientos, movementList);
        renderPruebas(caseId);
        renderFacturacionForCaso(caseId);
        openModal(detailsModal);
      } else if (target.classList.contains("edit-case-btn")) {
          caseMode = 'edit';
          caseForm.reset();
          clearAllErrors(caseForm);
          caseModalTitle.textContent = "Editar Caso";
          
          populateContactosSelect(document.getElementById('case-actorId'), caso.actorId);
          populateContactosSelect(document.getElementById('case-demandadoId'), caso.demandadoId);
          
          document.getElementById('case-id').value = caso.id;
          document.getElementById('case-expediente').value = caso.expediente;
          document.getElementById('case-objeto').value = caso.objeto;
          document.getElementById('case-fuero').value = caso.fuero;
          document.getElementById('case-juzgado').value = caso.juzgado;
          document.getElementById('case-provincia').value = caso.provincia;
          document.getElementById('case-abogado').value = caso.abogado;
          document.getElementById('case-telefono').value = caso.telefono;
          
          openModal(caseModal);
      } else if (target.classList.contains("delete-case-btn")) {
          if (confirm('¿Está seguro de que desea eliminar este caso? Se borrarán todos sus movimientos y pruebas.')) {
              casos = casos.filter(c => c.id !== caseId);
              vencimientos.forEach(v => { if (v.casoId === caseId) v.casoId = null; });
              facturacion.forEach(f => { if (f.casoId === caseId) f.casoId = null; });
              updateCasesView();
              renderVencimientos();
              renderFacturacion();
              showToast('Caso eliminado 🗑️', 'success');
          }
      }
    });
    closeDetailsBtn.addEventListener("click", () => closeModal(detailsModal));
    
    searchCasosInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateCasesView();
    });

    casosThead.addEventListener('click', (e) => {
        const header = e.target.closest('.sortable-header');
        if (!header) return;
        const sortKey = header.dataset.sort;
        if (sortConfig.key === sortKey) {
            sortConfig.direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        } else {
            sortConfig.key = sortKey;
            sortConfig.direction = 'ascending';
        }
        updateCasesView();
    });

    // ---------- LÓGICA DE MOVIMIENTOS (General) ----------
    function initializeQuillEditor(data) {
        const editorContainer = document.getElementById('mov-detalle-editor');
        editorContainer.innerHTML = '';
        quillEditor = new Quill(editorContainer, {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                ]
            },
            theme: 'snow'
        });
        quillEditor.root.innerHTML = data.detalle || '';
    }

    function openMovementModalForContext(mode, context, data = {}, index = null) {
        movementMode = mode;
        movementContext = context;
        currentMovementIndex = index;
        movementForm.reset();
        clearAllErrors(movementForm);
        
        document.getElementById("mov-fecha").value = data.fecha || new Date().toISOString().slice(0, 10);
        document.getElementById("mov-tipo").value = data.tipo || "";
        document.getElementById("mov-descripcion").value = data.descripcion || "";
        
        initializeQuillEditor(data);
        
        keptFiles = data.archivos ? [...data.archivos] : [];
        newFiles = [];
        renderFilePreview();
        
        const titleAction = mode === 'edit' ? 'Editar' : 'Agregar';
        const titleContext = context === 'prueba' ? 'en Cuaderno de Prueba' : 'en Expediente Principal';
        movementModalTitle.textContent = `${titleAction} Movimiento ${titleContext}`;
        
        openModal(movementModal);
    }

    addMovementBtn.addEventListener('click', () => openMovementModalForContext('create', 'main'));
    addPruebaMovementBtn.addEventListener('click', () => openMovementModalForContext('create', 'prueba'));

    movementForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors(movementForm);
      let hasErr = false;
      if (!document.getElementById("mov-fecha").value) { showFieldError(document.getElementById("mov-fecha"), "Ingrese la fecha."); hasErr = true; }
      if (!document.getElementById("mov-tipo").value) { showFieldError(document.getElementById("mov-tipo"), "Seleccione el tipo."); hasErr = true; }
      if (!document.getElementById("mov-descripcion").value.trim()) { showFieldError(document.getElementById("mov-descripcion"), "Ingrese una descripción."); hasErr = true; }
      if (hasErr) { showToast("Corrija los errores.", "warn"); return; }
      
      const archivosFinal = [...keptFiles, ...newFiles.map(nf => ({ id: nf.id, nombre: nf.nombre, url: nf.url }))];
      const entry = {
        fecha: document.getElementById("mov-fecha").value,
        tipo: document.getElementById("mov-tipo").value,
        descripcion: document.getElementById("mov-descripcion").value.trim(),
        detalle: quillEditor.root.innerHTML,
        archivos: archivosFinal,
      };

      const caso = casos.find(c => c.id === currentCaseId);
      if (!caso) return;
      
      let targetMovements;
      if (movementContext === 'prueba') {
          const prueba = caso.pruebas.find(p => p.id === currentPruebaId);
          targetMovements = prueba.movimientos;
      } else {
          targetMovements = caso.movimientos;
      }

      if (movementMode === "edit" && currentMovementIndex !== null) {
        targetMovements[currentMovementIndex] = entry;
        showToast("Movimiento actualizado ✅", "success");
      } else {
        targetMovements.push(entry);
        showToast("Movimiento agregado ✅", "success");
      }

      if (movementContext === 'prueba') {
          renderMovements(targetMovements, pruebaMovementList);
      } else {
          renderMovements(targetMovements, movementList);
      }
      closeModal(movementModal);
    });
    
    xMovementBtn.addEventListener("click", () => closeModal(movementModal));
    cancelMovementBtn.addEventListener("click", () => closeModal(movementModal));

    movArchivosInput.addEventListener("change", (e) => {
      Array.from(e.target.files || []).forEach(f => {
        const id = 'nf_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
        newFiles.push({ id, nombre: f.name, url: URL.createObjectURL(f), file: f });
      });
      renderFilePreview();
      movArchivosInput.value = "";
    });

    function renderFilePreview() {
      filePreview.innerHTML = "";
      [...keptFiles, ...newFiles].forEach((f, idx) => {
        const isKept = idx < keptFiles.length;
        const div = document.createElement('div');
        div.className = 'file-pill';
        div.innerHTML = `<a href="${f.url}" target="_blank" class="file-link">${f.nombre}</a> <button data-idx="${idx}">✖</button>`;
        div.querySelector('button').addEventListener('click', () => {
          if (isKept) {
            if (confirm('¿Quitar este archivo guardado del movimiento?')) keptFiles.splice(idx, 1);
          } else {
            newFiles.splice(idx - keptFiles.length, 1);
          }
          renderFilePreview();
        });
        filePreview.appendChild(div);
      });
      if (keptFiles.length === 0 && newFiles.length === 0) {
        filePreview.innerHTML = "<p class='text-gray-400 text-sm'>No hay archivos seleccionados.</p>";
      }
    }

    function openViewMovementModal(context, index) {
        movementContext = context;
        currentMovementIndex = index;
        
        const caso = casos.find(c => c.id === currentCaseId);
        if (!caso) return;

        let movement;
        if (context === 'prueba') {
            const prueba = caso.pruebas.find(p => p.id === currentPruebaId);
            movement = prueba.movimientos[index];
        } else {
            movement = caso.movimientos[index];
        }

        if (!movement) return;

        let fileBlock = "";
        if (movement.archivos && movement.archivos.length > 0) {
            fileBlock = `<div><strong class="block mb-2">Archivos Adjuntos:</strong><div class="flex flex-wrap gap-2">${movement.archivos.map(f => `<a href="${f.url}" target="_blank" class="file-link bg-gray-700 px-2 py-1 rounded">${f.nombre}</a>`).join('')}</div></div>`;
        }

        viewMovementContent.innerHTML = `
            <p><strong>Fecha:</strong> ${movement.fecha}</p>
            <p><strong>Tipo:</strong> ${movement.tipo}</p>
            <p><strong>Descripción:</strong> ${movement.descripcion}</p>
            <div class="mt-4 pt-4 border-t border-gray-600">
                <p class="mb-2"><strong>Detalle / Cuerpo del Escrito:</strong></p>
                <div class="formatted-content bg-gray-900/50 p-3 rounded-lg border border-gray-700">${movement.detalle || "—"}</div>
            </div>
            <div class="mt-4">${fileBlock}</div>
        `;
        openModal(viewMovementModal);
    }

    movementList.addEventListener('click', e => {
        const li = e.target.closest('li[data-index]');
        if (li) openViewMovementModal('main', Number(li.dataset.index));
    });
    pruebaMovementList.addEventListener('click', e => {
        const li = e.target.closest('li[data-index]');
        if (li) openViewMovementModal('prueba', Number(li.dataset.index));
    });

    closeViewMovementBtn.addEventListener('click', () => closeModal(viewMovementModal));

    editMovFromViewBtn.addEventListener('click', () => {
        const caso = casos.find(c => c.id === currentCaseId);
        let movement;
        if (movementContext === 'prueba') {
            const prueba = caso.pruebas.find(p => p.id === currentPruebaId);
            movement = prueba.movimientos[currentMovementIndex];
        } else {
            movement = caso.movimientos[currentMovementIndex];
        }
        closeModal(viewMovementModal);
        openMovementModalForContext('edit', movementContext, movement, currentMovementIndex);
    });

    deleteMovFromViewBtn.addEventListener('click', () => {
        if (!confirm('¿Está seguro de que desea eliminar este movimiento?')) return;
        
        const caso = casos.find(c => c.id === currentCaseId);
        let targetMovements;
        let listElement;

        if (movementContext === 'prueba') {
            const prueba = caso.pruebas.find(p => p.id === currentPruebaId);
            targetMovements = prueba.movimientos;
            listElement = pruebaMovementList;
        } else {
            targetMovements = caso.movimientos;
            listElement = movementList;
        }

        targetMovements.splice(currentMovementIndex, 1);
        renderMovements(targetMovements, listElement);
        closeModal(viewMovementModal);
        showToast('Movimiento eliminado 🗑️', 'success');
    });

    exportDocxBtn.addEventListener('click', async () => {
        const caso = casos.find(c => c.id === currentCaseId);
        let movement;
        if (movementContext === 'prueba') {
            const prueba = caso.pruebas.find(p => p.id === currentPruebaId);
            movement = prueba.movimientos[currentMovementIndex];
        } else {
            movement = caso.movimientos[currentMovementIndex];
        }

        const content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${movement.detalle}</body></html>`;
        
        try {
            const fileBuffer = await htmlToDocx.asBlob(content);
            const fileName = `Escrito_${caso.expediente.replace('/', '-')}_${movement.fecha}.docx`;
            
            const url = URL.createObjectURL(fileBuffer);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showToast('Exportado a .docx con éxito ✅', 'success');
        } catch (error) {
            console.error('Error al exportar:', error);
            showToast('Error al exportar el documento', 'error');
        }
    });

    // ---------- LÓGICA DE PRUEBAS ----------
    function renderPruebas(caseId) {
        const caso = casos.find(c => c.id === caseId);
        pruebaList.innerHTML = '';
        if (!caso || !caso.pruebas || caso.pruebas.length === 0) {
            pruebaList.innerHTML = `<p class="text-gray-400">No hay cuadernos de prueba registrados.</p>`;
            return;
        }
        caso.pruebas.forEach(p => {
            const div = document.createElement('div');
            div.className = 'bg-gray-700 p-3 rounded-lg flex justify-between items-center';
            div.dataset.id = p.id;
            div.innerHTML = `
                <div>
                    <p class="font-semibold text-white">${p.titulo}</p>
                    <p class="text-sm text-gray-400">${p.tipo}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="manage-prueba-btn bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1 rounded-md">Gestionar</button>
                    <button class="edit-prueba-btn bg-gray-600 hover:bg-gray-500 text-white text-xs px-2.5 py-1 rounded-md">Editar</button>
                    <button class="delete-prueba-btn bg-red-800 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md">Borrar</button>
                </div>
            `;
            pruebaList.appendChild(div);
        });
    }

    addPruebaBtn.addEventListener('click', () => {
        pruebaMode = 'create';
        pruebaForm.reset();
        clearAllErrors(pruebaForm);
        pruebaModalTitle.textContent = 'Agregar Cuaderno de Prueba';
        currentPruebaId = null;
        openModal(pruebaFormModal);
    });

    xPruebaFormBtn.addEventListener('click', () => closeModal(pruebaFormModal));
    cancelPruebaBtn.addEventListener('click', () => closeModal(pruebaFormModal));

    pruebaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors(pruebaForm);
        const tipoInput = document.getElementById('prueba-tipo');
        const tituloInput = document.getElementById('prueba-titulo');
        let hasError = false;
        if (!tipoInput.value) { showFieldError(tipoInput, 'Seleccione un tipo.'); hasError = true; }
        if (!tituloInput.value.trim()) { showFieldError(tituloInput, 'Ingrese un título.'); hasError = true; }
        if (hasError) return;

        const caso = casos.find(c => c.id === currentCaseId);
        if (!caso) return;
        
        const pruebaData = {
            tipo: tipoInput.value,
            titulo: tituloInput.value.trim(),
        };

        if (pruebaMode === 'edit') {
            const prueba = caso.pruebas.find(p => p.id === currentPruebaId);
            if (prueba) {
                prueba.tipo = pruebaData.tipo;
                prueba.titulo = pruebaData.titulo;
                showToast('Cuaderno de prueba actualizado ✅', 'success');
            }
        } else {
            const newPrueba = {
                id: Date.now(),
                ...pruebaData,
                movimientos: []
            };
            caso.pruebas.push(newPrueba);
            showToast('Cuaderno de prueba agregado ✅', 'success');
        }
        renderPruebas(currentCaseId);
        closeModal(pruebaFormModal);
    });

    pruebaList.addEventListener('click', e => {
        const target = e.target;
        const pruebaDiv = target.closest('div[data-id]');
        if (!pruebaDiv) return;
        const pruebaId = Number(pruebaDiv.dataset.id);
        const caso = casos.find(c => c.id === currentCaseId);
        const prueba = caso.pruebas.find(p => p.id === pruebaId);
        if (!prueba) return;

        currentPruebaId = pruebaId;

        if (target.classList.contains('manage-prueba-btn')) {
            pruebaDetailTitle.textContent = prueba.titulo;
            pruebaDetailSubtitle.textContent = `Cuaderno de Prueba ${prueba.tipo}`;
            renderMovements(prueba.movimientos, pruebaMovementList);
            openModal(pruebaDetailModal);
        } else if (target.classList.contains('edit-prueba-btn')) {
            pruebaMode = 'edit';
            pruebaForm.reset();
            clearAllErrors(pruebaForm);
            pruebaModalTitle.textContent = 'Editar Cuaderno de Prueba';
            document.getElementById('prueba-tipo').value = prueba.tipo;
            document.getElementById('prueba-titulo').value = prueba.titulo;
            openModal(pruebaFormModal);
        } else if (target.classList.contains('delete-prueba-btn')) {
            if (confirm('¿Eliminar este cuaderno de prueba y todos sus movimientos?')) {
                caso.pruebas = caso.pruebas.filter(p => p.id !== pruebaId);
                renderPruebas(currentCaseId);
                showToast('Cuaderno de prueba eliminado 🗑️', 'success');
            }
        }
    });
    
    closePruebaDetailBtn.addEventListener('click', () => closeModal(pruebaDetailModal));

    // ---------- LÓGICA DE VENCIMIENTOS ----------
    function populateCasosSelect(selectElement, selectedId = null) {
        selectElement.innerHTML = '<option value="">Ninguno</option>';
        casos.forEach(c => {
            const actor = contactos.find(con => con.id === c.actorId);
            const demandado = contactos.find(con => con.id === c.demandadoId);
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.expediente} (${actor?.nombre} vs ${demandado?.nombre})`;
            if (selectedId && c.id === selectedId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    addVencimientoBtn.addEventListener("click", () => {
        vencimientoMode = "create";
        vencimientoForm.reset();
        document.getElementById('vencimiento-id').value = '';
        clearAllErrors(vencimientoForm);
        vencimientoModalTitle.textContent = "Agregar Vencimiento";
        populateCasosSelect(vencimientoCasoIdSelect);
        openModal(vencimientoModal);
        setTimeout(() => document.getElementById("vencimiento-titulo").focus(), 200);
    });

    xVencimientoBtn.addEventListener("click", () => closeModal(vencimientoModal));
    cancelVencimientoBtn.addEventListener("click", () => closeModal(vencimientoModal));

    vencimientoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearAllErrors(vencimientoForm);
        let hasError = false;
        if (!document.getElementById("vencimiento-titulo").value.trim()) { showFieldError(document.getElementById("vencimiento-titulo"), "Ingrese un título."); hasError = true; }
        if (!document.getElementById("vencimiento-fecha").value) { showFieldError(document.getElementById("vencimiento-fecha"), "Ingrese una fecha."); hasError = true; }
        if (!document.getElementById("vencimiento-recordatorio").value) { showFieldError(document.getElementById("vencimiento-recordatorio"), "Seleccione un recordatorio."); hasError = true; }
        if (hasError) { showToast("Corrija los errores.", "warn"); return; }
        
        const id = document.getElementById('vencimiento-id').value;
        const vencimientoData = {
            titulo: document.getElementById("vencimiento-titulo").value.trim(),
            fecha: document.getElementById("vencimiento-fecha").value,
            casoId: document.getElementById("vencimiento-caso-id").value ? Number(document.getElementById("vencimiento-caso-id").value) : null,
            recordatorio: Number(document.getElementById("vencimiento-recordatorio").value),
        };

        if (vencimientoMode === 'edit') {
            const index = vencimientos.findIndex(v => v.id === Number(id));
            if (index > -1) {
                vencimientos[index] = { id: Number(id), ...vencimientoData };
                showToast("Vencimiento actualizado ✅", "success");
            }
        } else {
            const newId = vencimientos.length ? Math.max(...vencimientos.map(v => v.id)) + 1 : 1;
            vencimientos.push({ id: newId, ...vencimientoData });
            showToast("Vencimiento agregado ✅", "success");
        }
        renderVencimientos();
        closeModal(vencimientoModal);
    });

    vencimientoListBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = Number(target.closest('tr').dataset.id);

        if (target.classList.contains('edit-vencimiento-btn')) {
            const vencimiento = vencimientos.find(v => v.id === id);
            if (!vencimiento) return;
            vencimientoMode = 'edit';
            vencimientoForm.reset();
            clearAllErrors(vencimientoForm);
            vencimientoModalTitle.textContent = "Editar Vencimiento";

            document.getElementById('vencimiento-id').value = vencimiento.id;
            document.getElementById('vencimiento-titulo').value = vencimiento.titulo;
            document.getElementById('vencimiento-fecha').value = vencimiento.fecha;
            document.getElementById('vencimiento-recordatorio').value = vencimiento.recordatorio;
            populateCasosSelect(vencimientoCasoIdSelect, vencimiento.casoId);
            openModal(vencimientoModal);
        }

        if (target.classList.contains('delete-vencimiento-btn')) {
            if (confirm('¿Está seguro de que desea eliminar este vencimiento?')) {
                vencimientos = vencimientos.filter(v => v.id !== id);
                renderVencimientos();
                showToast('Vencimiento eliminado 🗑️', 'success');
            }
        }
    });

    // ---------- LÓGICA DE FACTURACIÓN ----------
    const formatCurrency = (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

    function renderFacturacion() {
        facturacionListBody.innerHTML = '';
        let totalFacturado = 0, totalCobrado = 0;

        facturacion.forEach(item => {
            const caso = item.casoId ? casos.find(c => c.id === item.casoId) : null;
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-700 hover-row";
            tr.dataset.id = item.id;
            const estadoClass = item.estado === 'Pagado' ? 'text-green-400' : 'text-yellow-400';
            tr.innerHTML = `
                <td class="px-6 py-4">${item.concepto}</td>
                <td class="px-6 py-4">${caso ? caso.expediente : 'Sin vincular'}</td>
                <td class="px-6 py-4">${item.fecha}</td>
                <td class="px-6 py-4">${formatCurrency(item.monto)}</td>
                <td class="px-6 py-4 font-semibold ${estadoClass}">${item.estado}</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end items-center space-x-2">
                        <button class="edit-facturacion-btn bg-gray-600 hover:bg-gray-500 text-white text-xs px-2.5 py-1 rounded-md">Editar</button>
                        <button class="delete-facturacion-btn bg-red-800 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md">Borrar</button>
                    </div>
                </td>
            `;
            facturacionListBody.appendChild(tr);

            totalFacturado += item.monto;
            if (item.estado === 'Pagado') {
                totalCobrado += item.monto;
            }
        });
        document.getElementById('total-facturado').textContent = formatCurrency(totalFacturado);
        document.getElementById('total-cobrado').textContent = formatCurrency(totalCobrado);
        document.getElementById('total-pendiente').textContent = formatCurrency(totalFacturado - totalCobrado);
    }

    function renderFacturacionForCaso(caseId) {
        const items = facturacion.filter(f => f.casoId === caseId);
        caseFacturacionList.innerHTML = '';
        if (items.length === 0) {
            caseFacturacionList.innerHTML = '<p class="text-gray-400">No hay items de facturación para este caso.</p>';
            return;
        }
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'bg-gray-700 p-3 rounded-lg flex justify-between items-center text-sm';
            const estadoClass = item.estado === 'Pagado' ? 'text-green-400' : 'text-yellow-400';
            div.innerHTML = `
                <div>
                    <p class="font-semibold text-white">${item.concepto} <span class="text-xs text-gray-400">(${item.fecha})</span></p>
                    <p class="${estadoClass}">${item.tipo} - ${formatCurrency(item.monto)}</p>
                </div>
            `;
            caseFacturacionList.appendChild(div);
        });
    }

    addFacturacionBtn.addEventListener('click', () => openFacturacionModal('create'));
    addFacturacionFromCaseBtn.addEventListener('click', () => openFacturacionModal('create', { casoId: currentCaseId }));

    function openFacturacionModal(mode, data = {}) {
        facturacionMode = mode;
        facturacionForm.reset();
        clearAllErrors(facturacionForm);
        facturacionModalTitle.textContent = mode === 'edit' ? 'Editar Item' : 'Agregar Item';
        
        document.getElementById('facturacion-id').value = data.id || '';
        document.getElementById('facturacion-concepto').value = data.concepto || '';
        document.getElementById('facturacion-fecha').value = data.fecha || new Date().toISOString().slice(0, 10);
        document.getElementById('facturacion-monto').value = data.monto || '';
        document.getElementById('facturacion-tipo').value = data.tipo || 'Honorarios';
        document.getElementById('facturacion-estado').value = data.estado || 'Pendiente';
        
        const selectorDiv = document.getElementById('facturacion-caso-selector-div');
        if (data.casoId) {
            selectorDiv.classList.add('hidden');
        } else {
            selectorDiv.classList.remove('hidden');
            populateCasosSelect(document.getElementById('facturacion-caso-id'), data.casoId);
        }

        openModal(facturacionModal);
    }

    xFacturacionBtn.addEventListener('click', () => closeModal(facturacionModal));
    cancelFacturacionBtn.addEventListener('click', () => closeModal(facturacionModal));

    facturacionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors(facturacionForm);
        let hasError = false;
        if (!document.getElementById('facturacion-concepto').value.trim()) { showFieldError(document.getElementById('facturacion-concepto'), 'Ingrese un concepto.'); hasError = true; }
        if (!document.getElementById('facturacion-fecha').value) { showFieldError(document.getElementById('facturacion-fecha'), 'Ingrese una fecha.'); hasError = true; }
        if (!document.getElementById('facturacion-monto').value) { showFieldError(document.getElementById('facturacion-monto'), 'Ingrese un monto.'); hasError = true; }
        if (hasError) return;

        const id = document.getElementById('facturacion-id').value;
        const selectorDiv = document.getElementById('facturacion-caso-selector-div');
        
        const itemData = {
            concepto: document.getElementById('facturacion-concepto').value.trim(),
            fecha: document.getElementById('facturacion-fecha').value,
            monto: parseFloat(document.getElementById('facturacion-monto').value),
            tipo: document.getElementById('facturacion-tipo').value,
            estado: document.getElementById('facturacion-estado').value,
            casoId: selectorDiv.classList.contains('hidden') ? currentCaseId : (document.getElementById('facturacion-caso-id').value ? Number(document.getElementById('facturacion-caso-id').value) : null)
        };

        if (facturacionMode === 'edit') {
            const index = facturacion.findIndex(f => f.id === Number(id));
            if (index > -1) {
                facturacion[index] = { id: Number(id), ...itemData };
                showToast('Item actualizado ✅');
            }
        } else {
            const newId = facturacion.length ? Math.max(...facturacion.map(f => f.id)) + 1 : 1;
            facturacion.push({ id: newId, ...itemData });
            showToast('Item agregado ✅');
        }
        renderFacturacion();
        if (anyModalOpen() && currentCaseId) {
            renderFacturacionForCaso(currentCaseId);
        }
        closeModal(facturacionModal);
    });

    facturacionListBody.addEventListener('click', e => {
        const target = e.target;
        const id = Number(target.closest('tr').dataset.id);
        if (!id) return;
        const item = facturacion.find(f => f.id === id);
        if (!item) return;

        if (target.classList.contains('edit-facturacion-btn')) {
            openFacturacionModal('edit', item);
        } else if (target.classList.contains('delete-facturacion-btn')) {
            if (confirm('¿Eliminar este item de facturación?')) {
                facturacion = facturacion.filter(f => f.id !== id);
                renderFacturacion();
                showToast('Item eliminado 🗑️');
            }
        }
    });
    
    generateReportBtn.addEventListener('click', async () => {
        const caso = casos.find(c => c.id === currentCaseId);
        if (!caso) return;
        const items = facturacion.filter(f => f.casoId === currentCaseId);
        
        let total = 0;
        const rows = items.map(item => {
            total += item.monto;
            return `<tr><td style="border: 1px solid #ddd; padding: 8px;">${item.fecha}</td><td style="border: 1px solid #ddd; padding: 8px;">${item.concepto} (${item.tipo})</td><td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(item.monto)}</td></tr>`;
        }).join('');

        const htmlContent = `
            <h1>Informe de Gastos y Honorarios</h1>
            <p><strong>Expediente:</strong> ${caso.expediente}</p>
            <p><strong>Carátula:</strong> ${contactos.find(c=>c.id===caso.actorId)?.nombre} vs. ${contactos.find(c=>c.id===caso.demandadoId)?.nombre}</p>
            <hr>
            <table style="width: 100%; border-collapse: collapse;">
                <thead><tr><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Concepto</th><th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Monto</th></tr></thead>
                <tbody>${rows}</tbody>
                <tfoot><tr><td colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">TOTAL</td><td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(total)}</td></tr></tfoot>
            </table>
        `;
        
        const fileBuffer = await htmlToDocx.asBlob(`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`);
        const fileName = `Informe_Facturacion_${caso.expediente.replace('/', '-')}.docx`;
        const url = URL.createObjectURL(fileBuffer);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('Informe generado ✅', 'success');
    });

    // ---------- LÓGICA DE CONTACTOS ----------
    function renderContactos() {
        contactoListBody.innerHTML = '';
        contactos.forEach(c => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-700 hover-row";
            tr.dataset.id = c.id;
            tr.innerHTML = `
                <td class="px-6 py-4">${c.nombre}</td>
                <td class="px-6 py-4">${c.telefono || '—'}</td>
                <td class="px-6 py-4">${c.email || '—'}</td>
                <td class="px-6 py-4">${c.dni || '—'}</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end items-center space-x-2">
                        <button class="edit-contacto-btn bg-gray-600 hover:bg-gray-500 text-white text-xs px-2.5 py-1 rounded-md">Editar</button>
                        <button class="delete-contacto-btn bg-red-800 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md">Borrar</button>
                    </div>
                </td>
            `;
            contactoListBody.appendChild(tr);
        });
    }

    addContactoBtn.addEventListener('click', () => {
        contactoMode = 'create';
        contactoForm.reset();
        clearAllErrors(contactoForm);
        contactoModalTitle.textContent = 'Agregar Contacto';
        document.getElementById('contacto-id').value = '';
        openModal(contactoModal);
    });

    xContactoBtn.addEventListener('click', () => closeModal(contactoModal));
    cancelContactoBtn.addEventListener('click', () => closeModal(contactoModal));

    contactoForm.addEventListener('submit', e => {
        e.preventDefault();
        clearAllErrors(contactoForm);
        const nombreInput = document.getElementById('contacto-nombre');
        if (!nombreInput.value.trim()) {
            showFieldError(nombreInput, 'El nombre es obligatorio.');
            return;
        }

        const id = document.getElementById('contacto-id').value;
        const contactoData = {
            nombre: nombreInput.value.trim(),
            telefono: document.getElementById('contacto-telefono').value.trim(),
            email: document.getElementById('contacto-email').value.trim(),
            dni: document.getElementById('contacto-dni').value.trim(),
            domicilio: document.getElementById('contacto-domicilio').value.trim(),
            notas: document.getElementById('contacto-notas').value.trim(),
        };

        if (contactoMode === 'edit') {
            const index = contactos.findIndex(c => c.id === Number(id));
            if (index > -1) {
                contactos[index] = { id: Number(id), ...contactoData };
                showToast('Contacto actualizado ✅');
            }
        } else {
            const newId = contactos.length ? Math.max(...contactos.map(c => c.id)) + 1 : 1;
            contactos.push({ id: newId, ...contactoData });
            showToast('Contacto agregado ✅');
        }
        renderContactos();
        updateCasesView(); // Actualizar carátulas
        closeModal(contactoModal);
    });

    contactoListBody.addEventListener('click', e => {
        const target = e.target;
        const id = Number(target.closest('tr').dataset.id);
        if (!id) return;
        const contacto = contactos.find(c => c.id === id);
        if (!contacto) return;

        if (target.classList.contains('edit-contacto-btn')) {
            contactoMode = 'edit';
            contactoForm.reset();
            clearAllErrors(contactoForm);
            contactoModalTitle.textContent = 'Editar Contacto';
            document.getElementById('contacto-id').value = contacto.id;
            document.getElementById('contacto-nombre').value = contacto.nombre;
            document.getElementById('contacto-telefono').value = contacto.telefono;
            document.getElementById('contacto-email').value = contacto.email;
            document.getElementById('contacto-dni').value = contacto.dni;
            document.getElementById('contacto-domicilio').value = contacto.domicilio;
            document.getElementById('contacto-notas').value = contacto.notas;
            openModal(contactoModal);
        } else if (target.classList.contains('delete-contacto-btn')) {
            if (confirm('¿Eliminar este contacto? No se podrá vincular a nuevos casos.')) {
                contactos = contactos.filter(c => c.id !== id);
                renderContactos();
                updateCasesView(); // Para mostrar que el contacto ya no existe
                showToast('Contacto eliminado 🗑️');
            }
        }
    });

    function populateContactosSelect(selectElement, selectedId = null) {
        selectElement.innerHTML = '<option value="">Seleccionar contacto...</option>';
        contactos.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.nombre} (DNI: ${c.dni || 'N/A'})`;
            if (selectedId && c.id === selectedId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }


    // ---------- SISTEMA DE RECORDATORIOS ----------
    function checkForUpcomingDeadlines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        vencimientos.forEach(v => {
            const fechaVencimiento = new Date(v.fecha + 'T00:00:00');
            const diffTime = fechaVencimiento.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays <= v.recordatorio) {
                const caso = v.casoId ? casos.find(c => c.id === v.casoId) : null;
                const casoInfo = caso ? ` (${caso.expediente})` : '';
                const msg = `⚠️ Vencimiento próximo: ${v.titulo}${casoInfo} en ${diffDays} día(s).`;
                showToast(msg, 'warn', 5000);
            }
        });
    }
    
    // ---------- LÓGICA DEL DASHBOARD ----------
    function renderDashboard() {
        // Vencimientos
        const dashboardVencimientos = document.getElementById('dashboard-vencimientos');
        dashboardVencimientos.innerHTML = '';
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingVencimientos = vencimientos.filter(v => {
            const vDate = new Date(v.fecha + 'T00:00:00');
            return vDate >= today && vDate <= nextWeek;
        }).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

        if (upcomingVencimientos.length > 0) {
            upcomingVencimientos.forEach(v => {
                const caso = v.casoId ? casos.find(c => c.id === v.casoId) : null;
                const div = document.createElement('div');
                div.className = 'bg-gray-800 p-3 rounded-lg text-sm';
                div.innerHTML = `
                    <p class="font-semibold text-white">${v.titulo}</p>
                    <p class="text-gray-400">Fecha: ${v.fecha}${caso ? ` - Caso: ${caso.expediente}` : ''}</p>
                `;
                dashboardVencimientos.appendChild(div);
            });
        } else {
            dashboardVencimientos.innerHTML = '<p class="text-gray-400">No hay vencimientos en los próximos 7 días.</p>';
        }

        // Movimientos
        const dashboardMovimientos = document.getElementById('dashboard-movimientos');
        dashboardMovimientos.innerHTML = '';
        const allMovements = [];
        casos.forEach(c => {
            c.movimientos.forEach(m => allMovements.push({ ...m, casoId: c.id, context: 'main' }));
            c.pruebas.forEach(p => {
                p.movimientos.forEach(m => allMovements.push({ ...m, casoId: c.id, context: 'prueba', pruebaId: p.id }));
            });
        });
        const recentMovements = allMovements.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

        if (recentMovements.length > 0) {
            recentMovements.forEach(m => {
                const caso = casos.find(c => c.id === m.casoId);
                const div = document.createElement('div');
                div.className = 'bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700';
                div.dataset.casoId = m.casoId;
                div.innerHTML = `
                    <p class="font-semibold text-white">${m.descripcion}</p>
                    <p class="text-gray-400">Fecha: ${m.fecha} - Caso: ${caso.expediente}</p>
                `;
                div.addEventListener('click', () => {
                    switchTab('casos');
                    const viewBtn = document.querySelector(`#case-list-body tr[data-id="${m.casoId}"] .view-btn`);
                    if (viewBtn) viewBtn.click();
                });
                dashboardMovimientos.appendChild(div);
            });
        } else {
            dashboardMovimientos.innerHTML = '<p class="text-gray-400">No hay movimientos recientes.</p>';
        }
        
        // Tareas Pendientes
        const dashboardTareas = document.getElementById('dashboard-tareas');
        dashboardTareas.innerHTML = '';
        const pendingTareas = tareas
            .filter(t => t.estado === 'Pendiente')
            .sort((a,b) => new Date(a.fechaLimite) - new Date(b.fechaLimite))
            .slice(0, 5);

        if (pendingTareas.length > 0) {
            pendingTareas.forEach(t => {
                const caso = t.casoId ? casos.find(c => c.id === t.casoId) : null;
                const div = document.createElement('div');
                div.className = 'bg-gray-800 p-3 rounded-lg text-sm';
                div.innerHTML = `
                    <p class="font-semibold text-white">${t.descripcion}</p>
                    <p class="text-gray-400">Límite: ${t.fechaLimite || 'Sin fecha'}${caso ? ` - Caso: ${caso.expediente}` : ''}</p>
                `;
                dashboardTareas.appendChild(div);
            });
        } else {
            dashboardTareas.innerHTML = '<p class="text-gray-400">No hay tareas pendientes.</p>';
        }
    }
    
    // ---------- LÓGICA DEL CALENDARIO ----------
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const month = calendarDate.getMonth();
        const year = calendarDate.getFullYear();
        calendarMonthYear.textContent = `${new Date(year, month).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.innerHTML += `<div class="calendar-day other-month"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = vencimientos.filter(v => v.fecha === dateStr);
            
            let tooltipContent = '';
            if (events.length > 0) {
                tooltipContent = events.map(e => `<div class="calendar-tooltip-item" data-caso-id="${e.casoId || ''}">• ${e.titulo}</div>`).join('');
            }

            dayDiv.innerHTML = `
                <div class="calendar-day-header">${day}</div>
                ${events.length > 0 ? '<span class="calendar-event-dot"></span>' : ''}
                ${tooltipContent ? `<div class="calendar-tooltip">${tooltipContent}</div>` : ''}
            `;
            calendarGrid.appendChild(dayDiv);
        }
    }
    prevMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });
    nextMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });
    calendarGrid.addEventListener('click', e => {
        const target = e.target.closest('.calendar-tooltip-item');
        if (target && target.dataset.casoId) {
            const casoId = Number(target.dataset.casoId);
            switchTab('casos');
            const viewBtn = document.querySelector(`#case-list-body tr[data-id="${casoId}"] .view-btn`);
            if (viewBtn) {
                viewBtn.click();
            }
        }
    });

    // ---------- LÓGICA DE TAREAS ----------
    function renderTareas() {
        tareaListBody.innerHTML = '';
        tareas.sort((a,b) => (a.estado === 'Completada' ? 1 : -1) || new Date(a.fechaLimite) - new Date(b.fechaLimite));
        
        tareas.forEach(t => {
            const caso = t.casoId ? casos.find(c => c.id === t.casoId) : null;
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-700 hover-row";
            tr.dataset.id = t.id;
            const isCompleted = t.estado === 'Completada';
            tr.innerHTML = `
                <td class="px-6 py-4"><input type="checkbox" class="toggle-task-status w-5 h-5" ${isCompleted ? 'checked' : ''}></td>
                <td class="px-6 py-4 ${isCompleted ? 'task-completed' : ''}">${t.descripcion}</td>
                <td class="px-6 py-4">${caso ? caso.expediente : '—'}</td>
                <td class="px-6 py-4">${t.fechaLimite || '—'}</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end items-center space-x-2">
                        <button class="edit-tarea-btn bg-gray-600 hover:bg-gray-500 text-white text-xs px-2.5 py-1 rounded-md">Editar</button>
                        <button class="delete-tarea-btn bg-red-800 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md">Borrar</button>
                    </div>
                </td>
            `;
            tareaListBody.appendChild(tr);
        });
    }

    addTareaBtn.addEventListener('click', () => {
        tareaMode = 'create';
        tareaForm.reset();
        clearAllErrors(tareaForm);
        tareaModalTitle.textContent = 'Agregar Tarea';
        document.getElementById('tarea-id').value = '';
        populateCasosSelect(document.getElementById('tarea-caso-id'));
        openModal(tareaModal);
    });

    xTareaBtn.addEventListener('click', () => closeModal(tareaModal));
    cancelTareaBtn.addEventListener('click', () => closeModal(tareaModal));

    tareaForm.addEventListener('submit', e => {
        e.preventDefault();
        clearAllErrors(tareaForm);
        const descInput = document.getElementById('tarea-descripcion');
        if (!descInput.value.trim()) {
            showFieldError(descInput, 'La descripción es obligatoria.');
            return;
        }

        const id = document.getElementById('tarea-id').value;
        const tareaData = {
            descripcion: descInput.value.trim(),
            fechaLimite: document.getElementById('tarea-fecha').value || null,
            estado: document.getElementById('tarea-estado').value,
            casoId: document.getElementById('tarea-caso-id').value ? Number(document.getElementById('tarea-caso-id').value) : null,
        };

        if (tareaMode === 'edit') {
            const index = tareas.findIndex(t => t.id === Number(id));
            if (index > -1) {
                tareas[index] = { id: Number(id), ...tareaData };
                showToast('Tarea actualizada ✅');
            }
        } else {
            const newId = tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1;
            tareas.push({ id: newId, ...tareaData });
            showToast('Tarea agregada ✅');
        }
        renderTareas();
        closeModal(tareaModal);
    });

    tareaListBody.addEventListener('click', e => {
        const target = e.target;
        const id = Number(target.closest('tr').dataset.id);
        if (!id) return;
        const tarea = tareas.find(t => t.id === id);
        if (!tarea) return;

        if (target.classList.contains('toggle-task-status')) {
            tarea.estado = target.checked ? 'Completada' : 'Pendiente';
            renderTareas();
        } else if (target.classList.contains('edit-tarea-btn')) {
            tareaMode = 'edit';
            tareaForm.reset();
            clearAllErrors(tareaForm);
            tareaModalTitle.textContent = 'Editar Tarea';
            document.getElementById('tarea-id').value = tarea.id;
            document.getElementById('tarea-descripcion').value = tarea.descripcion;
            document.getElementById('tarea-fecha').value = tarea.fechaLimite;
            document.getElementById('tarea-estado').value = tarea.estado;
            populateCasosSelect(document.getElementById('tarea-caso-id'), tarea.casoId);
            openModal(tareaModal);
        } else if (target.classList.contains('delete-tarea-btn')) {
            if (confirm('¿Eliminar esta tarea?')) {
                tareas = tareas.filter(t => t.id !== id);
                renderTareas();
                showToast('Tarea eliminada 🗑️');
            }
        }
    });

    // ---------- INICIALIZACIÓN ----------
    function initialize() {
        switchTab('dashboard');
        updateCasesView();
        renderContactos();
        renderVencimientos();
        renderFacturacion();
        renderTareas();
        checkForUpcomingDeadlines();
    }
    
    initialize();

  </script>
</body>
</html>
