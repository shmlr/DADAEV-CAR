(() => {
  'use strict';
  const WHATSAPP_NUMBER = String(window.DADAEV_CONFIG?.whatsappNumber || '').replace(/\D/g, '');
  const WHATSAPP_CATALOG = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : '';
  const STORAGE_KEY = 'dadaev-car-requests-v1';
  // Частично восстановленный поисковый каталог: 16 из 18 карточек, НЕ подтверждённый актуальный автопарк.
  // Фотографии, цены и характеристики из архива недоступны: никакие изображения не привязываем к конкретным машинам.
  const CARS = [
    { id: "lc200", name: "TOYOTA LAND CRUISER 200", shortName: "Toyota Land Cruiser 200 (Restyling 2)", category: "Премиум", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "lexus570", name: "LEXUS 570", shortName: "Lexus 570", category: "Премиум", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "bmwx7", name: "BMW X7", shortName: "BMW X7", category: "Премиум", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "creta", name: "HYUNDAI CRETA", shortName: "Hyundai Creta", category: "Внедорожники", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "camry70se", name: "TOYOTA CAMRY 70 (SE)", shortName: "Toyota Camry 70 (SE)", category: "Бизнес", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "kiak5", name: "KIA K5", shortName: "Kia K5", category: "Бизнес", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "camry70", name: "TOYOTA CAMRY 70", shortName: "Toyota Camry 70", category: "Бизнес", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "camry55", name: "TOYOTA CAMRY 55", shortName: "Toyota Camry 55", category: "Бизнес", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "camry75", name: "TOYOTA CAMRY 75", shortName: "Toyota Camry 75", category: "Бизнес", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "octavia", name: "SKODA OCTAVIA", shortName: "Skoda Octavia", category: "Седаны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "pologt", name: "VOLKSWAGEN POLO GT", shortName: "Volkswagen Polo GT", category: "Седаны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "solaris2", name: "HYUNDAI SOLARIS II", shortName: "Hyundai Solaris II", category: "Седаны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "polo", name: "VOLKSWAGEN POLO", shortName: "Volkswagen Polo", category: "Седаны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "rio", name: "KIA RIO", shortName: "Kia Rio", category: "Седаны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "solaris", name: "HYUNDAI SOLARIS", shortName: "Hyundai Solaris", category: "Седаны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' },
    { id: "starex", name: "HYUNDAI GRAND STAREX", shortName: "Hyundai Grand Starex", category: "Минивэны", image: 'assets/car-placeholder.svg', year: 'Уточняется', mileage: 'Уточняется', engine: 'Уточняется', drivetrain: 'Уточняется' }
  ];
  const $ = id => document.getElementById(id);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const state = { carIndex: 0, mode: 'daily', pickup: null, return: null, modalField: null, calendarDate: new Date(), candidate: null, latest: null };
  const today = () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); };
  const atMidnight = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const parseDate = text => {
    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(text).trim());
    if (!m) return null;
    const day = Number(m[1]), month = Number(m[2]), year = Number(m[3]);
    if (year < 2000 || year > 2100) return null;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  };
  const dateFmt = date => date ? `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}` : 'Выбрать дату';
  const daysBetween = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
  const maskDate = value => { const digits = value.replace(/\D/g, '').slice(0, 8); return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.'); };
  const showToast = message => { const node = $('toast'); node.textContent = message; node.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => node.classList.remove('show'), 3700); };
  const safeText = value => String(value ?? '');
  const currentCar = () => CARS[state.carIndex];
  const getSaved = () => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(saved) ? saved.slice(0, 100) : []; } catch { return []; } };
  const saveRecord = record => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...getSaved()].slice(0, 100))); return true; } catch { return false; } };

  function show(screen) {
    $$('.screen').forEach(node => node.classList.toggle('active', node.dataset.screen === screen));
    const active = $(`app`).querySelector(`.screen[data-screen="${screen}"]`);
    if (active) { const scroll = active.querySelector('.inner-scroll,.catalog-content'); if (scroll) scroll.scrollTop = 0; }
    if (screen === 'history') renderHistory();
  }

  function renderCar() {
    const car = currentCar();
    $('carTitle').textContent = car.name;
    $('carNumber').textContent = `${String(state.carIndex + 1).padStart(2, '0')} / ${String(CARS.length).padStart(2, '0')}`;
    $('carImage').src = car.image; $('carImage').alt = `Фотография ${car.shortName} пока не получена`;
    $('carCategory').textContent = car.category;
    $('carSpecs').replaceChildren();
    [['Категория', car.category], ['Год', car.year], ['Двигатель', car.engine], ['КПП', 'Уточняется']].forEach(([title, value]) => {
      const card = document.createElement('div'); card.className = 'glass-panel';
      const label = document.createElement('span'); label.className = 'muted'; label.textContent = title;
      const bold = document.createElement('strong'); bold.textContent = value;
      card.append(label, bold); $('carSpecs').append(card);
    });
    $('priceLabel').textContent = 'Стоимость';
    $('carPrice').textContent = 'По запросу';
    const dots = $('slideDots'); dots.replaceChildren();
    CARS.forEach((entry, index) => {
      const button = document.createElement('button'); button.type = 'button';
      button.className = index === state.carIndex ? 'active' : '';
      button.setAttribute('aria-label', `Показать ${entry.shortName}`);
      button.setAttribute('aria-current', index === state.carIndex ? 'true' : 'false');
      button.addEventListener('click', () => selectCar(index));
      dots.append(button);
    });
    renderDates();
  }
  function selectCar(index) { state.carIndex = (index + CARS.length) % CARS.length; renderCar(); }
  function renderDates() {
    $('pickupDisplay').textContent = dateFmt(state.pickup);
    $('returnDisplay').textContent = dateFmt(state.return);
    if (state.pickup && state.return) {
      const days = daysBetween(state.pickup, state.return);
      $('rentalEstimate').textContent = `${days} ${pluralDays(days)} · Стоимость и наличие подтвердит менеджер`;
    } else $('rentalEstimate').textContent = 'Выберите даты · Тариф и наличие уточняются';
    $$('.mode-tab').forEach(button => { const active = button.dataset.mode === state.mode; button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active)); });
  }
  function pluralDays(n) { return n % 10 === 1 && n % 100 !== 11 ? 'день' : n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? 'дня' : 'дней'; }

  function openCalendar(field) {
    state.modalField = field;
    state.candidate = state[field] ? new Date(state[field]) : (field === 'return' && state.pickup ? new Date(state.pickup.getTime() + 86400000) : today());
    state.calendarDate = new Date(state.candidate.getFullYear(), state.candidate.getMonth(), 1);
    $('calendarTitle').textContent = field === 'pickup' ? 'Дата получения' : 'Дата возврата';
    $('manualDate').value = state[field] ? dateFmt(state[field]) : '';
    $('calendarError').hidden = true;
    renderCalendar();
    $('dateModal').classList.add('open'); $('dateModal').setAttribute('aria-hidden', 'false');
  }
  function closeCalendar() { $('dateModal').classList.remove('open'); $('dateModal').setAttribute('aria-hidden', 'true'); state.modalField = null; }
  function minAllowedDate() {
    if (state.modalField === 'return' && state.pickup) return new Date(state.pickup.getFullYear(), state.pickup.getMonth(), state.pickup.getDate() + 1);
    return today();
  }
  function renderCalendar() {
    $('calendarMonthName').textContent = new Intl.DateTimeFormat('ru-RU', {month: 'long', year: 'numeric'}).format(state.calendarDate);
    const first = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7;
    const root = $('calendarDays'); root.replaceChildren();
    const min = minAllowedDate();
    for (let index = 0; index < 42; index++) {
      const date = new Date(first.getFullYear(), first.getMonth(), index - startOffset + 1);
      const button = document.createElement('button'); button.type = 'button'; button.textContent = String(date.getDate());
      if (date.getMonth() !== first.getMonth()) button.classList.add('other-month');
      if (date.getTime() === today().getTime()) button.classList.add('today');
      if (state.candidate && atMidnight(date).getTime() === atMidnight(state.candidate).getTime()) button.classList.add('chosen');
      button.disabled = date < min;
      button.setAttribute('aria-label', dateFmt(date));
      button.addEventListener('click', () => { state.candidate = date; $('manualDate').value = dateFmt(date); $('calendarError').hidden = true; renderCalendar(); });
      root.append(button);
    }
    $('calendarPrev').disabled = new Date(first.getFullYear(), first.getMonth() + 1, 0) < min;
  }
  function confirmCalendar() {
    const text = $('manualDate').value.trim();
    const selected = text ? parseDate(text) : state.candidate;
    const error = $('calendarError');
    if (!selected) { error.textContent = 'Введите корректную дату, например 30.12.2022.'; error.hidden = false; return; }
    if (selected < minAllowedDate()) { error.textContent = state.modalField === 'return' ? 'Возврат должен быть позже даты получения.' : 'Нельзя выбрать прошедшую дату.'; error.hidden = false; return; }
    const field = state.modalField;
    state[field] = selected;
    if (field === 'pickup' && state.return && state.return <= selected) state.return = null;
    closeCalendar(); renderDates();
    if (field === 'pickup' && !state.return) showToast('Теперь выберите дату возврата');
  }

  function setError(node, message) { node.textContent = message; node.hidden = !message; }
  function validateForm() {
    const first = $('firstName').value.trim(); const last = $('lastName').value.trim();
    const phone = $('phoneNumber').value.trim();
    const phoneDigits = phone.replace(/\D/g, '');
    if (first.length < 2 || last.length < 2) return 'Укажите имя и фамилию.';
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return 'Введите действительный контактный телефон.';
    const expiry = $('licenseExpiry').value.trim();
    if (expiry && !parseDate(expiry)) return 'Дата водительского удостоверения должна быть в формате ДД.ММ.ГГГГ.';
    if (!$('agreeProcessing').checked || !$('agreeTerms').checked) return 'Подтвердите оба условия перед продолжением.';
    return '';
  }
  function summaryLine(label, value, extraClass = '') {
    const line = document.createElement('div'); line.className = `summary-line ${extraClass}`.trim();
    const span = document.createElement('span'); span.textContent = safeText(label);
    const strong = document.createElement('strong'); strong.textContent = safeText(value);
    line.append(span, strong); return line;
  }
  function makeRequest() {
    return {
      id: `DC-${Date.now().toString(36).toUpperCase()}`,
      car: currentCar().shortName,
      pickup: dateFmt(state.pickup),
      return: dateFmt(state.return),
      mode: state.mode === 'daily' ? 'Посуточно' : 'Понедельно',
      name: `${$('lastName').value.trim()} ${$('firstName').value.trim()}`,
      phone: $('phoneNumber').value.trim(),
      createdAt: new Date().toISOString(),
      status: 'Черновик сохранён на устройстве'
    };
  }
  function renderReview(request) {
    $('reviewImage').src = currentCar().image; $('reviewImage').alt = `Фотография ${request.car} пока не получена`;
    $('reviewCarTitle').textContent = request.car;
    const details = $('reviewDetails'); details.replaceChildren();
    const heading = document.createElement('h3'); heading.textContent = request.car; details.append(heading);
    [['Получение', request.pickup], ['Возврат', request.return], ['Срок', `${daysBetween(state.pickup, state.return)} ${pluralDays(daysBetween(state.pickup, state.return))}`], ['Тариф', request.mode], ['Стоимость', 'По запросу'], ['Водитель', request.name], ['Телефон', request.phone]].forEach(row => details.append(summaryLine(...row)));
  }
  function whatsappMessage(request) {
    // Never transmit driver's license number/series/expiry in a URL.
    return [
      'Здравствуйте! Заявка на аренду автомобиля DADAEV CAR.',
      `Номер: ${request.id}`,
      `Автомобиль: ${request.car}`,
      `Получение: ${request.pickup}`,
      `Возврат: ${request.return}`,
      `Режим: ${request.mode}`,
      `Имя: ${request.name}`,
      `Телефон: ${request.phone}`,
      'Подскажите, пожалуйста, наличие и стоимость. Бронирование требуется подтвердить.'
    ].join('\n');
  }
  function whatsappUrl(request) { return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage(request))}` : ''; }
  async function copyRequest(request) {
    const value = whatsappMessage(request);
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else {
        const area = document.createElement('textarea'); area.value = value;
        area.style.position = 'fixed'; area.style.top = '-10000px';
        document.body.append(area); area.focus(); area.select();
        const success = document.execCommand('copy'); area.remove();
        if (!success) throw new Error('copy unavailable');
      }
      showToast('Текст заявки скопирован');
    } catch {
      showToast('Копирование недоступно. Откройте заявку на устройстве с доступом к буферу обмена.');
    }
  }
  function renderSuccess(request) {
    $('successTitle').textContent = 'Заявка подготовлена';
    $('successText').textContent = WHATSAPP_NUMBER
      ? 'Сообщение подготовлено для WhatsApp. Нажмите «Отправить» в чате: сохранение заявки в браузере не является отправкой менеджеру.'
      : 'Заявка сохранена только на этом устройстве. Скопируйте её текст и передайте менеджеру. Автоматическая отправка пока не подключена.';
    const root = $('successSummary');
    const rows = [summaryLine('Номер заявки', request.id), summaryLine('Автомобиль', request.car), summaryLine('Период', `${request.pickup} — ${request.return}`)];
    if (WHATSAPP_NUMBER) rows.push(summaryLine('WhatsApp', `+${WHATSAPP_NUMBER}`));
    root.replaceChildren(...rows);
    $('whatsappRetry').hidden = !WHATSAPP_NUMBER;
    if (WHATSAPP_NUMBER) $('whatsappRetry').href = whatsappUrl(request);
  }
  function renderHistory() {
    const root = $('historyList'); root.replaceChildren();
    const records = getSaved();
    if (!records.length) {
      const empty = document.createElement('div'); empty.className = 'history-empty';
      empty.textContent = 'Пока нет локально сохранённых заявок. Выберите автомобиль и заполните форму.';
      root.append(empty);
    } else {
      records.forEach(request => {
        const card = document.createElement('article'); card.className = 'history-card';
        const id = document.createElement('span'); id.className = 'history-date'; id.textContent = request.id || 'Заявка';
        const title = document.createElement('h3'); title.textContent = request.car;
        const chip = document.createElement('span'); chip.className = 'state-chip'; chip.textContent = 'Сохранено на этом устройстве · отправка не подтверждена';
        const action = document.createElement(WHATSAPP_NUMBER ? 'a' : 'button');
        action.className = 'secondary-button whatsapp-history-link';
        if (WHATSAPP_NUMBER) { action.target = '_blank'; action.rel = 'noopener noreferrer'; action.href = whatsappUrl(request); action.textContent = 'Открыть заявку в WhatsApp'; }
        else { action.type = 'button'; action.textContent = 'Скопировать заявку'; action.addEventListener('click', () => copyRequest(request)); }
        card.append(id, title, summaryLine('Даты', `${request.pickup} — ${request.return}`), summaryLine('Водитель', request.name), chip, action); root.append(card);
      });
    }
    $('downloadJSON').hidden = !records.length;
    $('downloadCSV').hidden = !records.length;
  }
  function downloadFile(filename, content, type) {
    const object = URL.createObjectURL(new Blob([content], {type}));
    const link = document.createElement('a'); link.href = object; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(object), 1000);
  }
  function csvEscape(value) { let str = String(value ?? ''); if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`; return `"${str.replace(/"/g, '""')}"`; }
  function downloadSaved(kind) {
    const records = getSaved(); if (!records.length) return showToast('Пока нет сохранённых заявок');
    if (kind === 'json') { downloadFile('DADAEV-CAR-заявки.json', JSON.stringify(records, null, 2), 'application/json;charset=utf-8'); return; }
    const columns = ['id','car','pickup','return','mode','name','phone','createdAt','status'];
    const csv = '\uFEFF' + [columns.join(';'), ...records.map(row => columns.map(key => csvEscape(row[key])).join(';'))].join('\r\n');
    downloadFile('DADAEV-CAR-заявки.csv', csv, 'text/csv;charset=utf-8');
  }

  $('startButton').addEventListener('click', () => show('catalog'));
  $('prevCar').addEventListener('click', () => selectCar(state.carIndex - 1));
  $('nextCar').addEventListener('click', () => selectCar(state.carIndex + 1));
  let touchStart = null;
  $('carVisual').addEventListener('touchstart', e => { touchStart = e.touches[0] ? {x:e.touches[0].clientX, y:e.touches[0].clientY} : null; }, {passive:true});
  $('carVisual').addEventListener('touchend', e => { if (!touchStart || !e.changedTouches[0]) return; const dx = e.changedTouches[0].clientX - touchStart.x; const dy = e.changedTouches[0].clientY - touchStart.y; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) selectCar(state.carIndex + (dx < 0 ? 1 : -1)); touchStart = null; }, {passive:true});
  document.addEventListener('keydown', e => { if (document.querySelector('.screen[data-screen="catalog"]').classList.contains('active') && !document.querySelector('.modal-backdrop.open') && ['ArrowLeft','ArrowRight'].includes(e.key)) { selectCar(state.carIndex + (e.key === 'ArrowRight' ? 1 : -1)); } else if (e.key === 'Escape' && $('dateModal').classList.contains('open')) closeCalendar(); });
  $$('.mode-tab').forEach(button => button.addEventListener('click', () => { state.mode = button.dataset.mode; renderDates(); }));
  $$('[data-date-open]').forEach(button => button.addEventListener('click', () => openCalendar(button.dataset.dateOpen)));
  $('closeCalendar').addEventListener('click', closeCalendar);
  $('dateModal').addEventListener('click', e => { if (e.target === $('dateModal')) closeCalendar(); });
  $('calendarPrev').addEventListener('click', () => { state.calendarDate.setMonth(state.calendarDate.getMonth() - 1); renderCalendar(); });
  $('calendarNext').addEventListener('click', () => { state.calendarDate.setMonth(state.calendarDate.getMonth() + 1); renderCalendar(); });
  $('manualDate').addEventListener('input', event => { event.target.value = maskDate(event.target.value); if (event.target.value.length === 10) { const parsed = parseDate(event.target.value); if (parsed) { state.candidate = parsed; state.calendarDate = new Date(parsed.getFullYear(), parsed.getMonth(), 1); renderCalendar(); } } });
  $('licenseExpiry').addEventListener('input', e => { e.target.value = maskDate(e.target.value); });
  $('confirmCalendar').addEventListener('click', confirmCalendar);
  $('bookButton').addEventListener('click', () => { if (!state.pickup || !state.return || state.return <= state.pickup) return showToast('Сначала выберите даты получения и возврата.'); show('form'); });
  $$('[data-back]').forEach(button => button.addEventListener('click', () => show(button.dataset.back)));
  $('driverForm').addEventListener('submit', e => {
    e.preventDefault(); const error = validateForm(); setError($('formError'), error); if (error) return;
    state.latest = makeRequest(); renderReview(state.latest); show('review');
  });
  $('submitBooking').addEventListener('click', () => {
    if (!state.latest) return showToast('Сначала заполните форму заявки');
    const request = state.latest;
    const saved = saveRecord(request);
    renderSuccess(request); show('success');
    if (!saved) showToast('Браузер запретил локальное сохранение, но заявка готова к отправке');
    // Open only after user action, and only if a verified WhatsApp number is configured.
    if (WHATSAPP_NUMBER) {
      const a = document.createElement('a'); a.href = whatsappUrl(request); a.target = '_blank'; a.rel = 'noopener noreferrer';
      document.body.append(a); a.click(); a.remove();
    }
  });
  $('copyRequest').addEventListener('click', () => { if (state.latest) copyRequest(state.latest); });
  $('openHistoryTop').addEventListener('click', () => show('history'));
  $$('.nav-item').forEach(button => button.addEventListener('click', () => show(button.dataset.nav)));
  $('openHistoryAfterSuccess').addEventListener('click', () => show('history'));
  $('backToCatalog').addEventListener('click', () => show('catalog'));
  $('historyGoCatalog').addEventListener('click', () => show('catalog'));
  $('downloadJSON').addEventListener('click', () => downloadSaved('json'));
  $('downloadCSV').addEventListener('click', () => downloadSaved('csv'));
  if (WHATSAPP_NUMBER) {
    $('whatsappCatalog').href = WHATSAPP_CATALOG;
    $('whatsappCatalogSplash').href = WHATSAPP_CATALOG;
    document.querySelector('.header-wa').href = WHATSAPP_CATALOG;
    $('startInfo').textContent = 'Выберите автомобиль и отправьте запрос в WhatsApp';
    $('formNotice').textContent = 'После подтверждения откроется WhatsApp с подготовленным текстом. Нажмите «Отправить» в чате. История сохраняется только на этом устройстве; данные водительского удостоверения не передаются и не сохраняются.';
    $('reviewActionText').textContent = 'Перейти в WhatsApp';
  } else {
    $('whatsappCatalog').hidden = true;
    $('whatsappCatalogSplash').hidden = true;
    document.querySelector('.header-wa').hidden = true;
    $('startInfo').textContent = 'Выберите автомобиль и подготовьте заявку';
    $('formNotice').textContent = 'Заявка будет сохранена только в этом браузере. Вы сможете скопировать её текст и передать менеджеру. Данные водительского удостоверения не передаются и не сохраняются.';
    $('reviewActionText').textContent = 'Сохранить заявку';
  }
  renderCar();
})();
