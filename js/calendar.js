/* calendar.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CHILEAN HOLIDAYS 2026 ---
    const holidays2026 = [
        '2026-01-01', // Año Nuevo
        '2026-04-03', // Viernes Santo
        '2026-04-04', // Sábado Santo
        '2026-05-01', // Día del Trabajo
        '2026-05-21', // Glorias Navales
        '2026-06-21', // Pueblos Indígenas
        '2026-06-29', // San Pedro y San Pablo
        '2026-07-16', // Virgen del Carmen
        '2026-08-15', // Asunción de la Virgen
        '2026-09-18', // Independencia Nacional
        '2026-09-19', // Glorias del Ejército
        '2026-10-12', // Encuentro de Dos Mundos
        '2026-10-31', // Iglesias Evangélicas
        '2026-11-01', // Todos los Santos
        '2026-12-08', // Inmaculada Concepción
        '2026-12-25'  // Navidad
    ];

    // Current Date according to metadata: 2026-07-15
    const today = new Date('2026-07-15T12:00:00');
    let currentMonth = today.getMonth(); // 6 (July)
    let currentYear = today.getFullYear(); // 2026
    
    let selectedDateStr = '';
    let selectedSlot = null;

    const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    // DOM Elements
    const calendarTitle = document.getElementById('calendar-title');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const selectedDateLabel = document.getElementById('selected-date-label');
    const slotsGrid = document.getElementById('slots-grid');
    const priceDisplay = document.getElementById('price-display');
    const priceValue = document.getElementById('price-value');
    const bookingFormWrapper = document.getElementById('booking-form-wrapper');
    const bookingForm = document.getElementById('booking-form');
    const successSection = document.getElementById('success-section');
    const transferAmountLabel = document.getElementById('transfer-amount-label');
    const whatsappBtn = document.getElementById('whatsapp-confirm-btn');

    // Initialize Calendar
    renderCalendar();

    // Event Listeners for Nav Buttons
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            // Prevent going to months before July 2026 (since current date is July 15, 2026)
            if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
                return;
            }
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // Helper functions
    function isHoliday(dateStr) {
        return holidays2026.includes(dateStr);
    }

    function isWeekend(dayIndex) {
        return dayIndex === 0 || dayIndex === 6; // Sunday = 0, Saturday = 6
    }

    function formatDateKey(year, month, day) {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    }

    function renderCalendar() {
        if (!calendarDaysGrid) return;
        
        calendarDaysGrid.innerHTML = '';
        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // First day of the month
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        // Adjust Sunday = 0 to make Monday = 0 in grid layout
        // In Chile, the week starts on Monday.
        // Sunday (getDay = 0) becomes index 6. Others shift left by 1.
        let adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        // Number of days in current month
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Previous month filler slots
        for (let i = 0; i < adjustedFirstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            calendarDaysGrid.appendChild(emptyCell);
        }

        // Render days
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.textContent = day;

            const cellDateStr = formatDateKey(currentYear, currentMonth, day);
            const cellDate = new Date(currentYear, currentMonth, day);
            const dayOfWeek = cellDate.getDay();

            // 1. Check if past date
            // Note: date objects compared by setting hours to 0
            const checkDate = new Date(currentYear, currentMonth, day, 0, 0, 0);
            const checkToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            
            if (checkDate < checkToday) {
                dayCell.classList.add('past');
            } else {
                // 2. Check if today
                if (checkDate.getTime() === checkToday.getTime()) {
                    dayCell.classList.add('today');
                }

                // 3. Check if holiday
                if (isHoliday(cellDateStr)) {
                    dayCell.classList.add('holiday');
                    dayCell.title = 'Feriado en Chile';
                }
                // 4. Check if weekend
                else if (isWeekend(dayOfWeek)) {
                    dayCell.classList.add('weekend');
                }

                // 5. Check if selected
                if (selectedDateStr === cellDateStr) {
                    dayCell.classList.add('selected');
                }

                // Click event
                dayCell.addEventListener('click', () => {
                    // Remove selected class from previous
                    document.querySelectorAll('.calendar-day-cell.selected').forEach(c => c.classList.remove('selected'));
                    dayCell.classList.add('selected');
                    selectedDateStr = cellDateStr;
                    
                    // Format human readable selected date
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    selectedDateLabel.textContent = cellDate.toLocaleDateString('es-CL', options);
                    
                    // Render hourly slots
                    renderSlots(cellDateStr, dayOfWeek);
                });
            }

            calendarDaysGrid.appendChild(dayCell);
        }
    }

    function renderSlots(dateStr, dayOfWeek) {
        if (!slotsGrid) return;
        slotsGrid.innerHTML = '';
        selectedSlot = null;
        priceDisplay.style.display = 'none';
        bookingFormWrapper.classList.add('hidden');
        if (successSection) successSection.classList.add('hidden');

        // Check if holiday
        const dayIsHoliday = isHoliday(dateStr);
        const dayIsWeekend = isWeekend(dayOfWeek);
        
        let availableSlots = [];

        if (dayIsWeekend || dayIsHoliday) {
            // Día inhábil: All day available 06:30 - 23:30 (hourly slots)
            availableSlots = [
                { time: '06:30 - 07:30', price: 50000 },
                { time: '07:30 - 08:30', price: 50000 },
                { time: '08:30 - 09:30', price: 50000 },
                { time: '09:30 - 10:30', price: 50000 },
                { time: '10:30 - 11:30', price: 50000 },
                { time: '11:30 - 12:30', price: 50000 },
                { time: '12:30 - 13:30', price: 50000 },
                { time: '13:30 - 14:30', price: 50000 },
                { time: '14:30 - 15:30', price: 50000 },
                { time: '15:30 - 16:30', price: 50000 },
                { time: '16:30 - 17:30', price: 50000 },
                { time: '17:30 - 18:30', price: 50000 },
                { time: '18:30 - 19:30', price: 50000 },
                { time: '19:30 - 20:30', price: 50000 },
                { time: '20:30 - 21:30', price: 50000 },
                { time: '21:30 - 22:30', price: 50000 },
                { time: '22:30 - 23:30', price: 50000 }
            ];
        } else {
            // Día hábil:
            // 06:30 - 08:30: $50.000
            // 08:30 - 17:30: Bloqueado (Not in list, or listed as blocked)
            // 17:30 - 19:30: $40.000
            // 19:30 - 23:30: $50.000
            availableSlots = [
                { time: '06:30 - 07:30', price: 50000 },
                { time: '07:30 - 08:30', price: 50000 },
                { time: '08:30 - 17:30', price: 0, isOfficeHours: true }, // Blocked
                { time: '17:30 - 18:30', price: 40000 },
                { time: '18:30 - 19:30', price: 40000 },
                { time: '19:30 - 20:30', price: 50000 },
                { time: '20:30 - 21:30', price: 50000 },
                { time: '21:30 - 22:30', price: 50000 },
                { time: '22:30 - 23:30', price: 50000 }
            ];
        }

        availableSlots.forEach(slot => {
            const slotBtn = document.createElement('button');
            slotBtn.className = 'slot-btn';
            slotBtn.type = 'button';
            
            // Format time slot
            slotBtn.textContent = slot.time;
            
            // Unique storage key for blocking check
            const storageKey = `booked_slot_${dateStr}_${slot.time.replace(/\s/g, '')}`;
            const isBooked = localStorage.getItem(storageKey);

            if (slot.isOfficeHours) {
                // Blocked standard office hours in weekdays
                slotBtn.classList.add('blocked');
                slotBtn.title = 'Horario laboral bloqueado';
                slotBtn.disabled = true;
            } else if (isBooked) {
                // Blocked because it's already booked
                slotBtn.classList.add('blocked');
                slotBtn.title = 'Horario ya reservado';
                slotBtn.disabled = true;
            } else {
                // Available slot
                slotBtn.addEventListener('click', () => {
                    document.querySelectorAll('.slot-btn.selected').forEach(b => b.classList.remove('selected'));
                    slotBtn.classList.add('selected');
                    selectedSlot = slot;
                    
                    // Show price display
                    priceDisplay.style.display = 'flex';
                    priceValue.textContent = `$${slot.price.toLocaleString('es-CL')}`;
                    
                    // Show Form
                    bookingFormWrapper.classList.remove('hidden');
                });
            }

            slotsGrid.appendChild(slotBtn);
        });
    }

    // Handle Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!selectedDateStr || !selectedSlot) {
                alert('Por favor selecciona una fecha y horario antes de continuar.');
                return;
            }

            const name = document.getElementById('book-name').value.trim();
            const rut = document.getElementById('book-rut').value.trim();
            const email = document.getElementById('book-email').value.trim();
            const phone = document.getElementById('book-phone').value.trim();
            const details = document.getElementById('book-details').value.trim();

            if (!name || !rut || !email || !phone) {
                alert('Por favor, rellene todos los campos obligatorios (*).');
                return;
            }

            // Save slot booking in localStorage (simulating DB block)
            const storageKey = `booked_slot_${selectedDateStr}_${selectedSlot.time.replace(/\s/g, '')}`;
            localStorage.setItem(storageKey, 'true');

            // Format amount
            const formattedPrice = `$${selectedSlot.price.toLocaleString('es-CL')}`;

            // Show bank transfer card
            bookingFormWrapper.classList.add('hidden');
            if (successSection) {
                successSection.classList.remove('hidden');
                transferAmountLabel.textContent = formattedPrice;
                successSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Send booking data via FormSubmit in background (Backup email)
            const backupFormData = {
                nombre: name,
                rut: rut,
                email: email,
                telefono: phone,
                fecha: selectedDateStr,
                horario: selectedSlot.time,
                valor: formattedPrice,
                caso: details,
                _subject: `Nueva Reserva Sumario Administrativo - ${name}`,
            };

            fetch('https://formsubmit.co/ajax/joseluisperez@estudiojuridicopewen.cl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(backupFormData)
            })
            .catch(err => console.error('Error sending backup email:', err));

            // Configure WhatsApp Confirmation Button
            const waPhone = '56989841833';
            const waMessage = `Hola Abogado José Luis Pérez Bañares, acabo de agendar una hora de urgencia para sumario administrativo.\n\nDetalles del Agendamiento:\n- Fecha: ${selectedDateStr}\n- Horario: ${selectedSlot.time}\n- Valor: ${formattedPrice}\n\nMis Datos:\n- Nombre: ${name}\n- RUT: ${rut}\n- Correo: ${email}\n- WhatsApp/Teléfono: ${phone}\n\nAdjuntaré el comprobante de transferencia electrónica a su cuenta corriente Scotiabank.`;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
            
            if (whatsappBtn) {
                whatsappBtn.href = waUrl;
            }

            // Update calendar layout (to show this slot as blocked immediately if the view refreshes)
            renderCalendar();
        });
    }
});
