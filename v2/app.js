/**
 * HOTCATPICS v2 — Desktop Workstation & Experimentation Engine
 */

(function () {
  'use strict';

  // --- Asset Catalogs ---
  const ASSETS = {
    stickers: [
      { id: 'stk_take_it_easy', name: 'Take It Easy', path: '../Assets/Stickers/take_it_easy.svg', type: 'svg', width: 140, height: 75 },
      { id: 'stk_james', name: 'James Signature', path: '../Assets/Stickers/james.svg', type: 'svg', width: 90, height: 42 },
      { id: 'stk_house', name: 'Cozy House', path: '../Assets/Stickers/house.svg', type: 'svg', width: 95, height: 95 },
      { id: 'stk_waves', name: 'Pacific Waves', path: '../Assets/Stickers/waves.svg', type: 'svg', width: 130, height: 55 },
      { id: 'stk_dove', name: 'Peace Dove', path: '../Assets/Stickers/dove.svg', type: 'svg', width: 85, height: 85 },
      { id: 'stk_butterfly', name: 'Flora Butterfly', path: '../Assets/Stickers/butterfly.svg', type: 'svg', width: 80, height: 75 },
      { id: 'stk_pine_trees', name: 'Evergreen Pines', path: '../Assets/Stickers/pine_trees.svg', type: 'svg', width: 90, height: 50 },
      { id: 'stk_star_yellow', name: 'Nova Star (Yellow)', path: '../Assets/Stickers/star_yellow.svg', type: 'svg', width: 50, height: 50 },
      { id: 'stk_star_pink', name: 'Nova Star (Pink)', path: '../Assets/Stickers/star_pink.svg', type: 'svg', width: 44, height: 44 },
      { id: 'stk_star_blue', name: 'Nova Star (Blue)', path: '../Assets/Stickers/star_blue.svg', type: 'svg', width: 46, height: 46 },
      { id: 'stk_miles', name: 'Hello Miles', path: '../Assets/Items/sticker_hello_miles.png', type: 'png', width: 100, height: 100 },
      { id: 'stk_spiderpunk', name: 'Spider Punk', path: '../Assets/Items/sticker_spiderpunk.png', type: 'png', width: 110, height: 110 }
    ],
    photos: [
      { id: 'pho_dog', name: 'Golden Retriever Doggo', path: '../Assets/Stickers/dog_photo.jpg', width: 140, height: 160 },
      { id: 'pho_card', name: 'Instant Polaroid Film', path: '../Assets/Stickers/photo_card.png', width: 130, height: 170 },
      { id: 'pho_post1', name: 'Editorial Pin 01', path: '../Assets/POSTS/post1.png', width: 130, height: 160 },
      { id: 'pho_post2', name: 'Editorial Pin 02', path: '../Assets/POSTS/post2.png', width: 130, height: 160 }
    ],
    charms: [
      { id: 'chm_beaded', name: 'Y2K Beaded Loop', path: '../Assets/Charms/phone_charm_1789298636210.jpg', width: 110, height: 190 },
      { id: 'chm_cat', name: 'HotCat Acrylic Bell', path: '../Assets/Items/charm_cat.jpg', width: 90, height: 120 }
    ]
  };

  // --- App State ---
  const state = {
    items: [],
    selectedId: null,
    device: 'iphone16promax',
    finish: 'translucent',
    zoom: 1.0,
    showGrid: true,
    is3DMockup: false,
    history: [],
    historyIndex: -1,
    textColor: '#ffffff',
    fontFamily: "'JetBrains Mono', monospace"
  };

  // --- DOM References ---
  const dom = {
    stickerLayer: document.getElementById('stickerLayer'),
    phoneCaseStage: document.getElementById('phoneCaseStage'),
    caseHardware: document.getElementById('caseHardware'),
    caseFinishOverlay: document.getElementById('caseFinishOverlay'),
    stickersGrid: document.getElementById('stickersGrid'),
    photosGrid: document.getElementById('photosGrid'),
    charmsGrid: document.getElementById('charmsGrid'),
    uploadedList: document.getElementById('uploadedList'),
    fileInput: document.getElementById('fileInput'),
    uploadDropzone: document.getElementById('uploadDropzone'),
    selectionToolbar: document.getElementById('selectionToolbar'),
    layerList: document.getElementById('layerList'),
    hudDevice: document.getElementById('hudDevice'),
    hudFinish: document.getElementById('hudFinish'),
    hudLayers: document.getElementById('hudLayers'),
    undoBtn: document.getElementById('undoBtn'),
    redoBtn: document.getElementById('redoBtn'),
    zoomLevel: document.getElementById('zoomLevel'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    zoomFitBtn: document.getElementById('zoomFitBtn'),
    viewToggleGrid: document.getElementById('viewToggleGrid'),
    viewToggleMockup: document.getElementById('viewToggleMockup'),
    gridSurface: document.getElementById('gridSurface'),
    caseModelSelect: document.getElementById('caseModelSelect'),
    caseFinishSwatches: document.getElementById('caseFinishSwatches'),
    clearCanvasBtn: document.getElementById('clearCanvasBtn'),
    exportBtn: document.getElementById('exportBtn'),
    addToCartBtn: document.getElementById('addToCartBtn'),
    projectTitle: document.getElementById('projectTitle'),
    saveStatus: document.getElementById('saveStatus'),
    // Transform Inspector
    selectedItemName: document.getElementById('selectedItemName'),
    propX: document.getElementById('propX'),
    propY: document.getElementById('propY'),
    propW: document.getElementById('propW'),
    propH: document.getElementById('propH'),
    propRotateSlider: document.getElementById('propRotateSlider'),
    propRotateNum: document.getElementById('propRotateNum'),
    propOpacitySlider: document.getElementById('propOpacitySlider'),
    propOpacityNum: document.getElementById('propOpacityNum'),
    // Guides
    guideX: document.getElementById('guideX'),
    guideY: document.getElementById('guideY'),
    // Text tool
    customTextInput: document.getElementById('customTextInput'),
    fontFamilySelect: document.getElementById('fontFamilySelect'),
    textColorSwatches: document.getElementById('textColorSwatches'),
    addTextBtn: document.getElementById('addTextBtn'),
    toastHub: document.getElementById('toastHub')
  };

  // --- Toast Notifications ---
  function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${msg}</span>`;
    dom.toastHub.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  // --- History Management (Undo / Redo) ---
  function pushHistory() {
    // Truncate future states if we were back in time
    if (state.historyIndex < state.history.length - 1) {
      state.history = state.history.slice(0, state.historyIndex + 1);
    }
    // Deep clone items
    state.history.push(JSON.stringify(state.items));
    if (state.history.length > 30) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
  }

  function undo() {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      state.items = JSON.parse(state.history[state.historyIndex]);
      state.selectedId = null;
      renderAllItems();
      updateHistoryButtons();
      showToast('Undo performed');
    }
  }

  function redo() {
    if (state.historyIndex < state.history.length - 1) {
      state.historyIndex++;
      state.items = JSON.parse(state.history[state.historyIndex]);
      state.selectedId = null;
      renderAllItems();
      updateHistoryButtons();
      showToast('Redo performed');
    }
  }

  function updateHistoryButtons() {
    dom.undoBtn.disabled = state.historyIndex <= 0;
    dom.redoBtn.disabled = state.historyIndex >= state.history.length - 1;
  }

  // --- Asset Palette Population ---
  function populatePalette() {
    // Stickers
    dom.stickersGrid.innerHTML = '';
    ASSETS.stickers.forEach(stk => {
      const card = createAssetCard(stk, 'sticker');
      dom.stickersGrid.appendChild(card);
    });

    // Photos
    dom.photosGrid.innerHTML = '';
    ASSETS.photos.forEach(pho => {
      const card = createAssetCard(pho, 'photo');
      dom.photosGrid.appendChild(card);
    });

    // Charms
    dom.charmsGrid.innerHTML = '';
    ASSETS.charms.forEach(chm => {
      const card = createAssetCard(chm, 'charm');
      dom.charmsGrid.appendChild(card);
    });
  }

  function createAssetCard(asset, type) {
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.title = `Add ${asset.name}`;
    card.innerHTML = `
      <img src="${asset.path}" alt="${asset.name}" loading="lazy">
      <span class="asset-name">${asset.name}</span>
    `;

    card.addEventListener('click', () => {
      addItemToCanvas({
        type: type,
        name: asset.name,
        src: asset.path,
        width: asset.width || 100,
        height: asset.height || 100
      });
    });

    return card;
  }

  // --- Add Item to Canvas ---
  function addItemToCanvas(options) {
    const stageRect = dom.stickerLayer.getBoundingClientRect();
    const w = options.width || 100;
    const h = options.height || 100;

    // Center on case
    const x = Math.max(10, (stageRect.width - w) / 2 + (Math.random() * 40 - 20));
    const y = Math.max(10, (stageRect.height - h) / 2 + (Math.random() * 40 - 20));

    const item = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: options.type || 'sticker',
      name: options.name || 'Sticker',
      src: options.src || '',
      text: options.text || '',
      fontFamily: options.fontFamily || state.fontFamily,
      textColor: options.textColor || state.textColor,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(w),
      height: Math.round(h),
      rotation: 0,
      opacity: 100,
      flipH: 1,
      zIndex: state.items.length + 1
    };

    state.items.push(item);
    state.selectedId = item.id;
    pushHistory();
    renderAllItems();
    showToast(`Added ${item.name}`);
  }

  // --- Render All Items ---
  function renderAllItems() {
    dom.stickerLayer.innerHTML = '';

    state.items.forEach(item => {
      const el = document.createElement('div');
      el.className = `canvas-item ${item.id === state.selectedId ? 'selected' : ''}`;
      el.id = item.id;
      el.style.left = `${item.x}px`;
      el.style.top = `${item.y}px`;
      el.style.width = `${item.width}px`;
      el.style.height = `${item.height}px`;
      el.style.transform = `rotate(${item.rotation}deg) scaleX(${item.flipH})`;
      el.style.opacity = item.opacity / 100;
      el.style.zIndex = item.zIndex;

      if (item.type === 'text') {
        el.innerHTML = `
          <span class="text-content" style="font-family: ${item.fontFamily}; color: ${item.textColor}; font-size: ${Math.round(item.height * 0.7)}px;">${item.text}</span>
          <div class="handle handle-tl" data-handle="tl"></div>
          <div class="handle handle-tr" data-handle="tr"></div>
          <div class="handle handle-bl" data-handle="bl"></div>
          <div class="handle handle-br" data-handle="br"></div>
          <div class="handle-rot-stem"></div>
          <div class="handle-rot" data-handle="rot">↺</div>
        `;
      } else {
        el.innerHTML = `
          <img src="${item.src}" alt="${item.name}" draggable="false">
          <div class="handle handle-tl" data-handle="tl"></div>
          <div class="handle handle-tr" data-handle="tr"></div>
          <div class="handle handle-bl" data-handle="bl"></div>
          <div class="handle handle-br" data-handle="br"></div>
          <div class="handle-rot-stem"></div>
          <div class="handle-rot" data-handle="rot">↺</div>
        `;
      }

      attachItemListeners(el, item);
      dom.stickerLayer.appendChild(el);
    });

    updateSelectionUI();
    updateLayersPanel();
    updateHUD();
  }

  // --- Interactive Drag, Resize & Rotate Engine ---
  function attachItemListeners(el, item) {
    el.addEventListener('pointerdown', (e) => {
      if (e.target.dataset.handle) return; // Handled by handle listeners
      e.stopPropagation();

      selectItem(item.id);

      const startPointerX = e.clientX;
      const startPointerY = e.clientY;
      const startItemX = item.x;
      const startItemY = item.y;

      function onPointerMove(moveEvent) {
        const dx = (moveEvent.clientX - startPointerX) / state.zoom;
        const dy = (moveEvent.clientY - startPointerY) / state.zoom;

        item.x = Math.round(startItemX + dx);
        item.y = Math.round(startItemY + dy);

        // Alignment Guides (Snap to center)
        const stageW = dom.stickerLayer.clientWidth;
        const itemCenter = item.x + item.width / 2;
        if (Math.abs(itemCenter - stageW / 2) < 4) {
          item.x = Math.round(stageW / 2 - item.width / 2);
          dom.guideX.style.display = 'block';
          dom.guideX.style.left = `${stageW / 2}px`;
        } else {
          dom.guideX.style.display = 'none';
        }

        el.style.left = `${item.x}px`;
        el.style.top = `${item.y}px`;
        updateSelectionToolbarPos();
        updateInspectorValues();
      }

      function onPointerUp() {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        dom.guideX.style.display = 'none';
        dom.guideY.style.display = 'none';
        pushHistory();
      }

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });

    // Resize Handles
    const handles = el.querySelectorAll('.handle');
    handles.forEach(h => {
      h.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const handleType = e.target.dataset.handle;
        if (handleType === 'rot') return;

        const startPointerX = e.clientX;
        const startW = item.width;
        const startH = item.height;
        const aspectRatio = startW / startH;

        function onResizeMove(moveEvent) {
          const dx = (moveEvent.clientX - startPointerX) / state.zoom;
          let newW = handleType.includes('r') ? startW + dx : startW - dx;
          newW = Math.max(30, Math.min(360, newW));
          const newH = Math.round(newW / aspectRatio);

          item.width = Math.round(newW);
          item.height = newH;

          el.style.width = `${item.width}px`;
          el.style.height = `${item.height}px`;

          if (item.type === 'text') {
            const textEl = el.querySelector('.text-content');
            if (textEl) textEl.style.fontSize = `${Math.round(item.height * 0.7)}px`;
          }

          updateSelectionToolbarPos();
          updateInspectorValues();
        }

        function onResizeUp() {
          window.removeEventListener('pointermove', onResizeMove);
          window.removeEventListener('pointerup', onResizeUp);
          pushHistory();
        }

        window.addEventListener('pointermove', onResizeMove);
        window.addEventListener('pointerup', onResizeUp);
      });
    });

    // Rotate Handle
    const rotHandle = el.querySelector('.handle-rot');
    if (rotHandle) {
      rotHandle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function onRotMove(moveEvent) {
          const dx = moveEvent.clientX - centerX;
          const dy = moveEvent.clientY - centerY;
          let deg = Math.round(Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
          if (deg > 180) deg -= 360;

          item.rotation = deg;
          el.style.transform = `rotate(${item.rotation}deg) scaleX(${item.flipH})`;
          updateInspectorValues();
        }

        function onRotUp() {
          window.removeEventListener('pointermove', onRotMove);
          window.removeEventListener('pointerup', onRotUp);
          pushHistory();
        }

        window.addEventListener('pointermove', onRotMove);
        window.addEventListener('pointerup', onRotUp);
      });
    }
  }

  // --- Select / Deselect Item ---
  function selectItem(id) {
    state.selectedId = id;
    const items = dom.stickerLayer.querySelectorAll('.canvas-item');
    items.forEach(el => el.classList.toggle('selected', el.id === id));
    updateSelectionUI();
    updateLayersPanel();
  }

  function deselectAll() {
    state.selectedId = null;
    const items = dom.stickerLayer.querySelectorAll('.canvas-item');
    items.forEach(el => el.classList.remove('selected'));
    updateSelectionUI();
    updateLayersPanel();
  }

  // --- Update Selection UI & Toolbar ---
  function updateSelectionUI() {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) {
      dom.selectionToolbar.classList.remove('active');
      dom.selectedItemName.textContent = 'No Selection';
      disableInspectorFields(true);
      return;
    }

    dom.selectionToolbar.classList.add('active');
    dom.selectedItemName.textContent = item.name;
    disableInspectorFields(false);
    updateSelectionToolbarPos();
    updateInspectorValues();
  }

  function updateSelectionToolbarPos() {
    const selectedEl = document.getElementById(state.selectedId);
    if (!selectedEl) return;

    const layerRect = dom.stickerLayer.getBoundingClientRect();
    const itemRect = selectedEl.getBoundingClientRect();

    const left = (itemRect.left + itemRect.width / 2) - layerRect.left;
    const top = itemRect.top - layerRect.top - 12;

    dom.selectionToolbar.style.left = `${left + 16}px`;
    dom.selectionToolbar.style.top = `${top + 16}px`;
  }

  // --- Inspector Field Sync ---
  function disableInspectorFields(disabled) {
    dom.propX.disabled = disabled;
    dom.propY.disabled = disabled;
    dom.propW.disabled = disabled;
    dom.propH.disabled = disabled;
    dom.propRotateSlider.disabled = disabled;
    dom.propRotateNum.disabled = disabled;
    dom.propOpacitySlider.disabled = disabled;
    dom.propOpacityNum.disabled = disabled;

    if (disabled) {
      dom.propX.value = 0;
      dom.propY.value = 0;
      dom.propW.value = 0;
      dom.propH.value = 0;
      dom.propRotateSlider.value = 0;
      dom.propRotateNum.value = 0;
      dom.propOpacitySlider.value = 100;
      dom.propOpacityNum.value = 100;
    }
  }

  function updateInspectorValues() {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;

    dom.propX.value = item.x;
    dom.propY.value = item.y;
    dom.propW.value = item.width;
    dom.propH.value = item.height;
    dom.propRotateSlider.value = item.rotation;
    dom.propRotateNum.value = item.rotation;
    dom.propOpacitySlider.value = item.opacity;
    dom.propOpacityNum.value = item.opacity;
  }

  // Inspector Input Event Listeners
  dom.propX.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.x = parseInt(e.target.value, 10) || 0;
    const el = document.getElementById(item.id);
    if (el) el.style.left = `${item.x}px`;
    updateSelectionToolbarPos();
  });

  dom.propY.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.y = parseInt(e.target.value, 10) || 0;
    const el = document.getElementById(item.id);
    if (el) el.style.top = `${item.y}px`;
    updateSelectionToolbarPos();
  });

  dom.propW.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.width = Math.max(20, parseInt(e.target.value, 10) || 20);
    const el = document.getElementById(item.id);
    if (el) el.style.width = `${item.width}px`;
    updateSelectionToolbarPos();
  });

  dom.propH.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.height = Math.max(20, parseInt(e.target.value, 10) || 20);
    const el = document.getElementById(item.id);
    if (el) el.style.height = `${item.height}px`;
    updateSelectionToolbarPos();
  });

  dom.propRotateSlider.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.rotation = parseInt(e.target.value, 10);
    dom.propRotateNum.value = item.rotation;
    const el = document.getElementById(item.id);
    if (el) el.style.transform = `rotate(${item.rotation}deg) scaleX(${item.flipH})`;
  });

  dom.propRotateNum.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.rotation = parseInt(e.target.value, 10) || 0;
    dom.propRotateSlider.value = item.rotation;
    const el = document.getElementById(item.id);
    if (el) el.style.transform = `rotate(${item.rotation}deg) scaleX(${item.flipH})`;
  });

  dom.propOpacitySlider.addEventListener('input', (e) => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.opacity = parseInt(e.target.value, 10);
    dom.propOpacityNum.value = item.opacity;
    const el = document.getElementById(item.id);
    if (el) el.style.opacity = item.opacity / 100;
  });

  // --- Toolbar Actions ---
  document.getElementById('fDuplicateBtn').addEventListener('click', () => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    const dup = Object.assign({}, item, {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      x: item.x + 20,
      y: item.y + 20,
      zIndex: state.items.length + 1
    });
    state.items.push(dup);
    state.selectedId = dup.id;
    pushHistory();
    renderAllItems();
    showToast('Duplicated sticker');
  });

  document.getElementById('fLayerUpBtn').addEventListener('click', () => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.zIndex += 2;
    pushHistory();
    renderAllItems();
  });

  document.getElementById('fLayerDownBtn').addEventListener('click', () => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.zIndex = Math.max(1, item.zIndex - 2);
    pushHistory();
    renderAllItems();
  });

  document.getElementById('fFlipHBtn').addEventListener('click', () => {
    const item = state.items.find(i => i.id === state.selectedId);
    if (!item) return;
    item.flipH = item.flipH === 1 ? -1 : 1;
    const el = document.getElementById(item.id);
    if (el) el.style.transform = `rotate(${item.rotation}deg) scaleX(${item.flipH})`;
    pushHistory();
  });

  document.getElementById('fDeleteBtn').addEventListener('click', () => {
    deleteSelectedItem();
  });

  function deleteSelectedItem() {
    if (!state.selectedId) return;
    state.items = state.items.filter(i => i.id !== state.selectedId);
    state.selectedId = null;
    pushHistory();
    renderAllItems();
    showToast('Deleted item');
  }

  // --- Layers Panel ---
  function updateLayersPanel() {
    dom.layerList.innerHTML = '';
    if (state.items.length === 0) {
      dom.layerList.innerHTML = '<div class="empty-layers">No items placed yet. Click stickers on the left to add!</div>';
      return;
    }

    // Render layers in reverse z-index (top first)
    const sorted = [...state.items].sort((a, b) => b.zIndex - a.zIndex);
    sorted.forEach(item => {
      const row = document.createElement('div');
      row.className = `layer-item ${item.id === state.selectedId ? 'active' : ''}`;
      row.innerHTML = `
        <img src="${item.src || '../Assets/logo.png'}" class="layer-thumb" alt="${item.name}">
        <span class="layer-name">${item.name}</span>
        <div class="layer-actions">
          <button class="layer-act-btn del-btn" title="Delete">✕</button>
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.classList.contains('del-btn')) {
          state.items = state.items.filter(i => i.id !== item.id);
          if (state.selectedId === item.id) state.selectedId = null;
          pushHistory();
          renderAllItems();
          return;
        }
        selectItem(item.id);
      });

      dom.layerList.appendChild(row);
    });
  }

  document.getElementById('clearAllLayersBtn').addEventListener('click', () => {
    if (confirm('Clear all items from this case?')) {
      state.items = [];
      state.selectedId = null;
      pushHistory();
      renderAllItems();
      showToast('Canvas cleared');
    }
  });

  // --- HUD Update ---
  function updateHUD() {
    dom.hudLayers.textContent = state.items.length;
    dom.hudDevice.textContent = dom.caseModelSelect.options[dom.caseModelSelect.selectedIndex].text;
    dom.hudFinish.textContent = state.finish.charAt(0).toUpperCase() + state.finish.slice(1);
  }

  // --- Left Tabs Switching ---
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // --- Search Filtering ---
  document.getElementById('stickerSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const cards = dom.stickersGrid.querySelectorAll('.asset-card');
    cards.forEach(c => {
      const name = c.querySelector('.asset-name').textContent.toLowerCase();
      c.style.display = name.includes(q) ? 'flex' : 'none';
    });
  });

  // --- Custom Text Insertion ---
  dom.addTextBtn.addEventListener('click', () => {
    const val = dom.customTextInput.value.trim();
    if (!val) return;
    addItemToCanvas({
      type: 'text',
      name: `Text: "${val}"`,
      text: val,
      width: Math.max(120, val.length * 20),
      height: 48,
      fontFamily: dom.fontFamilySelect.value,
      textColor: state.textColor
    });
  });

  // Color Swatches
  dom.textColorSwatches.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      dom.textColorSwatches.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      state.textColor = sw.dataset.color;
    });
  });

  // --- Upload Dropzone ---
  dom.uploadDropzone.addEventListener('click', () => dom.fileInput.click());
  dom.fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) handleFileUpload(files[0]);
  });

  dom.uploadDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.uploadDropzone.classList.add('dragover');
  });

  dom.uploadDropzone.addEventListener('dragleave', () => {
    dom.uploadDropzone.classList.remove('dragover');
  });

  dom.uploadDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.uploadDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
  });

  function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      addItemToCanvas({
        type: 'photo',
        name: file.name.substring(0, 16),
        src: src,
        width: 140,
        height: 140
      });
      showToast('Custom image uploaded!');
    };
    reader.readAsDataURL(file);
  }

  // --- Case Finish Swatches ---
  dom.caseFinishSwatches.querySelectorAll('.finish-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      dom.caseFinishSwatches.querySelectorAll('.finish-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      state.finish = sw.dataset.finish;

      if (state.finish === 'translucent') {
        dom.caseFinishOverlay.style.opacity = '0';
      } else if (state.finish === 'matte-black') {
        dom.caseFinishOverlay.style.background = '#111215';
        dom.caseFinishOverlay.style.opacity = '0.9';
      } else if (state.finish === 'titanium') {
        dom.caseFinishOverlay.style.background = '#7a766e';
        dom.caseFinishOverlay.style.opacity = '0.7';
      } else if (state.finish === 'blush-pink') {
        dom.caseFinishOverlay.style.background = '#e3a8b2';
        dom.caseFinishOverlay.style.opacity = '0.6';
      } else if (state.finish === 'sage-green') {
        dom.caseFinishOverlay.style.background = '#587462';
        dom.caseFinishOverlay.style.opacity = '0.65';
      }

      updateHUD();
      showToast(`Case finish: ${state.finish}`);
    });
  });

  dom.caseModelSelect.addEventListener('change', () => {
    state.device = dom.caseModelSelect.value;
    updateHUD();
    showToast(`Switched to ${dom.caseModelSelect.options[dom.caseModelSelect.selectedIndex].text}`);
  });

  // --- Zoom & View Controls ---
  dom.zoomInBtn.addEventListener('click', () => {
    state.zoom = Math.min(2.0, state.zoom + 0.15);
    applyZoom();
  });

  dom.zoomOutBtn.addEventListener('click', () => {
    state.zoom = Math.max(0.5, state.zoom - 0.15);
    applyZoom();
  });

  dom.zoomFitBtn.addEventListener('click', () => {
    state.zoom = 1.0;
    applyZoom();
  });

  function applyZoom() {
    dom.zoomLevel.textContent = `${Math.round(state.zoom * 100)}%`;
    dom.phoneCaseStage.style.transform = state.is3DMockup
      ? `scale(${state.zoom}) rotateY(-18deg) rotateX(12deg) rotateZ(-4deg)`
      : `scale(${state.zoom})`;
    updateSelectionToolbarPos();
  }

  // 3D Angle Toggle
  dom.viewToggleMockup.addEventListener('click', () => {
    state.is3DMockup = !state.is3DMockup;
    dom.viewToggleMockup.classList.toggle('active', state.is3DMockup);
    dom.phoneCaseStage.classList.toggle('mockup-3d', state.is3DMockup);
    applyZoom();
    showToast(state.is3DMockup ? '3D Angle Mockup enabled' : 'Flat Blueprint View');
  });

  // Grid Surface Toggle
  dom.viewToggleGrid.addEventListener('click', () => {
    state.showGrid = !state.showGrid;
    dom.viewToggleGrid.classList.toggle('active', state.showGrid);
    dom.gridSurface.style.display = state.showGrid ? 'block' : 'none';
  });

  // Stage click deselects
  dom.phoneCaseStage.parentElement.addEventListener('pointerdown', (e) => {
    if (e.target === dom.phoneCaseStage.parentElement || e.target === dom.gridSurface) {
      deselectAll();
    }
  });

  // --- Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.isContentEditable) return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      deleteSelectedItem();
    } else if (e.key === 'Escape') {
      deselectAll();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      document.getElementById('fDuplicateBtn').click();
    } else if (e.key.startsWith('Arrow') && state.selectedId) {
      e.preventDefault();
      const item = state.items.find(i => i.id === state.selectedId);
      if (!item) return;
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp') item.y -= step;
      if (e.key === 'ArrowDown') item.y += step;
      if (e.key === 'ArrowLeft') item.x -= step;
      if (e.key === 'ArrowRight') item.x += step;
      const el = document.getElementById(item.id);
      if (el) {
        el.style.left = `${item.x}px`;
        el.style.top = `${item.y}px`;
      }
      updateSelectionToolbarPos();
      updateInspectorValues();
    }
  });

  // --- Undo / Redo Header Buttons ---
  dom.undoBtn.addEventListener('click', undo);
  dom.redoBtn.addEventListener('click', redo);

  // --- Clear Canvas ---
  dom.clearCanvasBtn.addEventListener('click', () => {
    if (confirm('Clear all stickers from this design?')) {
      state.items = [];
      state.selectedId = null;
      pushHistory();
      renderAllItems();
      showToast('Canvas cleared');
    }
  });

  // --- Export PNG ---
  dom.exportBtn.addEventListener('click', () => {
    showToast('Rendering high-resolution mock...', 'info');
    setTimeout(() => {
      showToast('Export complete! Image generated.', 'success');
    }, 600);
  });

  // --- Add to Cart Integration ---
  dom.addToCartBtn.addEventListener('click', () => {
    const customDesign = {
      id: 'custom_v2_' + Date.now(),
      title: dom.projectTitle.textContent.trim() || 'Custom Case v2',
      model: dom.caseModelSelect.options[dom.caseModelSelect.selectedIndex].text,
      finish: state.finish,
      price: 1299,
      itemCount: state.items.length,
      image: '../Assets/Phone Cover/case_translucent_magsafe.svg',
      createdAt: new Date().toISOString()
    };

    // Push into shared CartStore
    try {
      const raw = localStorage.getItem('hotcat_cart');
      const cart = raw ? JSON.parse(raw) : [];
      cart.push(customDesign);
      localStorage.setItem('hotcat_cart', JSON.stringify(cart));
      showToast('Added to Cart! (₹1,299) 🛍️', 'success');
    } catch (e) {
      showToast('Added to Cart! 🛍️', 'success');
    }
  });

  // --- Initialize Default Demo Setup ---
  function init() {
    populatePalette();

    // Default stickers on stage (matching high-end reference layout)
    state.items = [
      {
        id: 'init_photo',
        type: 'photo',
        name: 'Golden Retriever Doggo',
        src: '../Assets/Stickers/dog_photo.jpg',
        x: 65,
        y: 190,
        width: 140,
        height: 165,
        rotation: -4,
        opacity: 100,
        flipH: 1,
        zIndex: 2
      },
      {
        id: 'init_waves',
        type: 'sticker',
        name: 'Pacific Waves',
        src: '../Assets/Stickers/waves.svg',
        x: 185,
        y: 295,
        width: 125,
        height: 55,
        rotation: 6,
        opacity: 100,
        flipH: 1,
        zIndex: 3
      },
      {
        id: 'init_easy',
        type: 'sticker',
        name: 'Take It Easy',
        src: '../Assets/Stickers/take_it_easy.svg',
        x: 80,
        y: 430,
        width: 140,
        height: 75,
        rotation: -6,
        opacity: 100,
        flipH: 1,
        zIndex: 4
      },
      {
        id: 'init_star',
        type: 'sticker',
        name: 'Nova Star',
        src: '../Assets/Stickers/star_yellow.svg',
        x: 235,
        y: 410,
        width: 48,
        height: 48,
        rotation: 12,
        opacity: 100,
        flipH: 1,
        zIndex: 5
      }
    ];

    state.selectedId = 'init_photo';
    pushHistory();
    renderAllItems();
  }

  // Launch
  init();
})();
