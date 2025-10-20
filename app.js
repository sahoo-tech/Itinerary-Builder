// Vigovia Itinerary Builder - Main Application JavaScript

class ItineraryBuilder {
    constructor() {
        this.data = {
            trip_overview: {},
            days: [],
            flights: [],
            flight_notes: [],
            hotels: [],
            payment_plan: {
                installments: []
            },
            visa_details: {},
            important_notes: [],
            scope_of_service: [],
            inclusion_summary: [],
            activities: [],
            terms: ''
        };
        
        this.currentSection = 'trip-overview';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.loadSection('trip-overview');
    }

    bindEvents() {
        // Navigation events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.loadSection(section);
            });
        });

        // Action button events
        document.getElementById('load-example').addEventListener('click', () => this.loadExampleData());
        document.getElementById('save-draft').addEventListener('click', () => this.saveDraft());
        document.getElementById('load-draft').addEventListener('click', () => this.loadDraft());
        document.getElementById('preview-itinerary').addEventListener('click', () => this.previewItinerary());
        document.getElementById('generate-pdf').addEventListener('click', () => this.generatePDF());

        // Form events
        this.bindFormEvents();
        
        // Dynamic content events
        this.bindDynamicEvents();
        
        // Modal events
        this.bindModalEvents();
    }

    bindFormEvents() {
        // Trip overview form changes
        const overviewInputs = [
            'customer-name', 'trip-title', 'duration-days', 'duration-nights', 
            'travelers', 'departure-from', 'departure-date', 'arrival-date', 'destination'
        ];
        
        overviewInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateTripOverview());
            }
        });
        
        // Visa details form changes
        const visaInputs = ['visa-type', 'visa-validity', 'visa-processing'];
        visaInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateVisaDetails());
            }
        });
    }

    bindDynamicEvents() {
        // Add buttons
        document.getElementById('add-day').addEventListener('click', () => this.addDay());
        document.getElementById('add-flight').addEventListener('click', () => this.addFlight());
        document.getElementById('add-flight-note').addEventListener('click', () => this.addFlightNote());
        document.getElementById('add-hotel').addEventListener('click', () => this.addHotel());
        document.getElementById('add-installment').addEventListener('click', () => this.addInstallment());
        document.getElementById('add-note').addEventListener('click', () => this.addImportantNote());
        document.getElementById('add-service').addEventListener('click', () => this.addService());
        document.getElementById('add-inclusion').addEventListener('click', () => this.addInclusion());
        document.getElementById('add-activity').addEventListener('click', () => this.addActivity());
    }

    bindModalEvents() {
        const modal = document.getElementById('preview-modal');
        const closeBtn = modal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    loadSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        
        this.currentSection = sectionId;
        this.updateProgress();
    }
    
    updateVisaDetails() {
        this.data.visa_details = {
            visa_type: document.getElementById('visa-type').value,
            validity: document.getElementById('visa-validity').value,
            processing_date: document.getElementById('visa-processing').value
        };
    }

    updateProgress() {
        const sections = [
            'trip-overview', 'day-activities', 'flights', 'hotels', 'payment', 'visa',
            'notes', 'services', 'inclusions', 'activities', 'terms'
        ];
        
        const currentIndex = sections.indexOf(this.currentSection);
        const progress = ((currentIndex + 1) / sections.length) * 100;
        
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    updateTripOverview() {
        this.data.trip_overview = {
            customer_name: document.getElementById('customer-name').value,
            trip_title: document.getElementById('trip-title').value,
            duration_days: parseInt(document.getElementById('duration-days').value) || 0,
            duration_nights: parseInt(document.getElementById('duration-nights').value) || 0,
            travelers: parseInt(document.getElementById('travelers').value) || 0,
            departure_from: document.getElementById('departure-from').value,
            departure_date: document.getElementById('departure-date').value,
            arrival_date: document.getElementById('arrival-date').value,
            destination: document.getElementById('destination').value
        };
    }

    addDay() {
        const dayNumber = this.data.days.length + 1;
        const day = {
            day_number: dayNumber,
            date: '',
            title: `Day ${dayNumber}`,
            morning: [''],
            afternoon: [''],
            evening: ['']
        };
        
        this.data.days.push(day);
        this.renderDay(day, this.data.days.length - 1);
    }

    renderDay(day, index) {
        const container = document.getElementById('days-container');
        const dayCard = document.createElement('div');
        dayCard.className = 'dynamic-card day-card';
        dayCard.innerHTML = `
            <div class="card-header">
                <div style="display: flex; align-items: center;">
                    <div class="day-number">${day.day_number}</div>
                    <div class="card-title">Day ${day.day_number}</div>
                </div>
                <button class="remove-btn" onclick="itineraryBuilder.removeDay(${index})">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="text" class="form-control" value="${day.date}" 
                           onchange="itineraryBuilder.updateDay(${index}, 'date', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Day Title</label>
                    <input type="text" class="form-control" value="${day.title}" 
                           onchange="itineraryBuilder.updateDay(${index}, 'title', this.value)">
                </div>
            </div>
            
            <div class="activity-group">
                <h4><i class="fas fa-sun"></i> Morning Activities</h4>
                <div class="activity-list" id="morning-${index}">
                    ${day.morning.map((activity, actIndex) => `
                        <div class="activity-item">
                            <input type="text" class="form-control" value="${activity}" 
                                   onchange="itineraryBuilder.updateActivity(${index}, 'morning', ${actIndex}, this.value)">
                            <button class="remove-activity" onclick="removeDayActivity(${index}, 'morning', ${actIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-activity" onclick="itineraryBuilder.addActivity(${index}, 'morning')">
                    <i class="fas fa-plus"></i> Add Morning Activity
                </button>
            </div>
            
            <div class="activity-group">
                <h4><i class="fas fa-sun"></i> Afternoon Activities</h4>
                <div class="activity-list" id="afternoon-${index}">
                    ${day.afternoon.map((activity, actIndex) => `
                        <div class="activity-item">
                            <input type="text" class="form-control" value="${activity}" 
                                   onchange="itineraryBuilder.updateActivity(${index}, 'afternoon', ${actIndex}, this.value)">
                            <button class="remove-activity" onclick="removeDayActivity(${index}, 'afternoon', ${actIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-activity" onclick="itineraryBuilder.addActivity(${index}, 'afternoon')">
                    <i class="fas fa-plus"></i> Add Afternoon Activity
                </button>
            </div>
            
            <div class="activity-group">
                <h4><i class="fas fa-moon"></i> Evening Activities</h4>
                <div class="activity-list" id="evening-${index}">
                    ${day.evening.map((activity, actIndex) => `
                        <div class="activity-item">
                            <input type="text" class="form-control" value="${activity}" 
                                   onchange="itineraryBuilder.updateActivity(${index}, 'evening', ${actIndex}, this.value)">
                            <button class="remove-activity" onclick="removeDayActivity(${index}, 'evening', ${actIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-activity" onclick="itineraryBuilder.addActivity(${index}, 'evening')">
                    <i class="fas fa-plus"></i> Add Evening Activity
                </button>
            </div>
        `;
        
        container.appendChild(dayCard);
    }

    updateDay(index, field, value) {
        if (this.data.days[index]) {
            this.data.days[index][field] = value;
        }
    }

    updateActivity(dayIndex, period, actIndex, value) {
        if (this.data.days[dayIndex] && this.data.days[dayIndex][period]) {
            this.data.days[dayIndex][period][actIndex] = value;
        }
    }

    addActivityToDay(dayIndex, period) {
        if (this.data.days[dayIndex] && this.data.days[dayIndex][period]) {
            this.data.days[dayIndex][period].push('');
            this.rerenderDay(dayIndex);
        }
    }

    removeActivity(dayIndex, period, actIndex) {
        if (this.data.days[dayIndex] && this.data.days[dayIndex][period] && this.data.days[dayIndex][period].length > 1) {
            this.data.days[dayIndex][period].splice(actIndex, 1);
            this.rerenderDay(dayIndex);
        }
    }

    removeDay(index) {
        this.data.days.splice(index, 1);
        this.renderAllDays();
    }

    rerenderDay(index) {
        const container = document.getElementById('days-container');
        const dayCards = container.children;
        if (dayCards[index]) {
            container.removeChild(dayCards[index]);
            this.renderDay(this.data.days[index], index);
        }
    }

    renderAllDays() {
        const container = document.getElementById('days-container');
        container.innerHTML = '';
        this.data.days.forEach((day, index) => {
            day.day_number = index + 1;
            this.renderDay(day, index);
        });
    }

    addFlight() {
        const flight = {
            date: '',
            flight_number: '',
            airline: '',
            route: ''
        };
        
        this.data.flights.push(flight);
        this.renderFlight(flight, this.data.flights.length - 1);
    }

    renderFlight(flight, index) {
        const container = document.getElementById('flights-container');
        const flightCard = document.createElement('div');
        flightCard.className = 'dynamic-card';
        flightCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Flight ${index + 1}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeFlight(${index})">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="text" class="form-control" value="${flight.date}" 
                           onchange="itineraryBuilder.updateFlight(${index}, 'date', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Flight Number</label>
                    <input type="text" class="form-control" value="${flight.flight_number}" 
                           onchange="itineraryBuilder.updateFlight(${index}, 'flight_number', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Airline</label>
                    <input type="text" class="form-control" value="${flight.airline}" 
                           onchange="itineraryBuilder.updateFlight(${index}, 'airline', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Route</label>
                    <input type="text" class="form-control" value="${flight.route}" 
                           onchange="itineraryBuilder.updateFlight(${index}, 'route', this.value)" 
                           placeholder="From City (CODE) To City (CODE)">
                </div>
            </div>
        `;
        
        container.appendChild(flightCard);
    }

    updateFlight(index, field, value) {
        if (this.data.flights[index]) {
            this.data.flights[index][field] = value;
        }
    }

    removeFlight(index) {
        this.data.flights.splice(index, 1);
        this.renderAllFlights();
    }

    renderAllFlights() {
        const container = document.getElementById('flights-container');
        container.innerHTML = '';
        this.data.flights.forEach((flight, index) => {
            this.renderFlight(flight, index);
        });
    }

    addFlightNote() {
        this.data.flight_notes.push('');
        this.renderFlightNote('', this.data.flight_notes.length - 1);
    }

    renderFlightNote(note, index) {
        const container = document.getElementById('flight-notes-container');
        const noteDiv = document.createElement('div');
        noteDiv.className = 'activity-item';
        noteDiv.innerHTML = `
            <input type="text" class="form-control" value="${note}" 
                   onchange="itineraryBuilder.updateFlightNote(${index}, this.value)" 
                   placeholder="Enter flight note...">
            <button class="remove-activity" onclick="itineraryBuilder.removeFlightNote(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(noteDiv);
    }

    updateFlightNote(index, value) {
        if (this.data.flight_notes[index] !== undefined) {
            this.data.flight_notes[index] = value;
        }
    }

    removeFlightNote(index) {
        this.data.flight_notes.splice(index, 1);
        this.renderAllFlightNotes();
    }

    renderAllFlightNotes() {
        const container = document.getElementById('flight-notes-container');
        container.innerHTML = '';
        this.data.flight_notes.forEach((note, index) => {
            this.renderFlightNote(note, index);
        });
    }

    addHotel() {
        const hotel = {
            city: '',
            check_in: '',
            check_out: '',
            nights: 0,
            hotel_name: ''
        };
        
        this.data.hotels.push(hotel);
        this.renderHotel(hotel, this.data.hotels.length - 1);
    }

    renderHotel(hotel, index) {
        const container = document.getElementById('hotels-container');
        const hotelCard = document.createElement('div');
        hotelCard.className = 'dynamic-card';
        hotelCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Hotel ${index + 1}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeHotel(${index})">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control" value="${hotel.city}" 
                           onchange="itineraryBuilder.updateHotel(${index}, 'city', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Check-in Date</label>
                    <input type="date" class="form-control" value="${hotel.check_in}" 
                           onchange="itineraryBuilder.updateHotel(${index}, 'check_in', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Check-out Date</label>
                    <input type="date" class="form-control" value="${hotel.check_out}" 
                           onchange="itineraryBuilder.updateHotel(${index}, 'check_out', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Number of Nights</label>
                    <input type="number" class="form-control" value="${hotel.nights}" min="1" 
                           onchange="itineraryBuilder.updateHotel(${index}, 'nights', parseInt(this.value))">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label class="form-label">Hotel Name</label>
                    <textarea class="form-control" rows="2" 
                              onchange="itineraryBuilder.updateHotel(${index}, 'hotel_name', this.value)">${hotel.hotel_name}</textarea>
                </div>
            </div>
        `;
        
        container.appendChild(hotelCard);
    }

    updateHotel(index, field, value) {
        if (this.data.hotels[index]) {
            this.data.hotels[index][field] = value;
        }
    }

    removeHotel(index) {
        this.data.hotels.splice(index, 1);
        this.renderAllHotels();
    }

    renderAllHotels() {
        const container = document.getElementById('hotels-container');
        container.innerHTML = '';
        this.data.hotels.forEach((hotel, index) => {
            this.renderHotel(hotel, index);
        });
    }

    addInstallment() {
        const installment = {
            number: this.data.payment_plan.installments.length + 1,
            amount: '',
            due_date: ''
        };
        
        this.data.payment_plan.installments.push(installment);
        this.renderInstallment(installment, this.data.payment_plan.installments.length - 1);
    }

    renderInstallment(installment, index) {
        const container = document.getElementById('installments-container');
        const installmentCard = document.createElement('div');
        installmentCard.className = 'dynamic-card';
        installmentCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Installment ${installment.number}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeInstallment(${index})">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-control" value="${installment.amount}" 
                           onchange="itineraryBuilder.updateInstallment(${index}, 'amount', this.value)" 
                           placeholder="₹3,50,000">
                </div>
                <div class="form-group">
                    <label class="form-label">Due Date</label>
                    <input type="text" class="form-control" value="${installment.due_date}" 
                           onchange="itineraryBuilder.updateInstallment(${index}, 'due_date', this.value)" 
                           placeholder="Initial Payment">
                </div>
            </div>
        `;
        
        container.appendChild(installmentCard);
    }

    updateInstallment(index, field, value) {
        if (this.data.payment_plan.installments[index]) {
            this.data.payment_plan.installments[index][field] = value;
        }
    }

    removeInstallment(index) {
        this.data.payment_plan.installments.splice(index, 1);
        this.renderAllInstallments();
    }

    renderAllInstallments() {
        const container = document.getElementById('installments-container');
        container.innerHTML = '';
        this.data.payment_plan.installments.forEach((installment, index) => {
            installment.number = index + 1;
            this.renderInstallment(installment, index);
        });
    }

    // Similar methods for other dynamic content (notes, services, inclusions, activities)
    addImportantNote() {
        const note = { point: '', details: '' };
        this.data.important_notes.push(note);
        this.renderImportantNote(note, this.data.important_notes.length - 1);
    }

    renderImportantNote(note, index) {
        const container = document.getElementById('notes-container');
        const noteCard = document.createElement('div');
        noteCard.className = 'dynamic-card';
        noteCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Important Note ${index + 1}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeImportantNote(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Point</label>
                <input type="text" class="form-control" value="${note.point}" 
                       onchange="itineraryBuilder.updateImportantNote(${index}, 'point', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Details</label>
                <textarea class="form-control" rows="3" 
                          onchange="itineraryBuilder.updateImportantNote(${index}, 'details', this.value)">${note.details}</textarea>
            </div>
        `;
        
        container.appendChild(noteCard);
    }

    updateImportantNote(index, field, value) {
        if (this.data.important_notes[index]) {
            this.data.important_notes[index][field] = value;
        }
    }

    removeImportantNote(index) {
        this.data.important_notes.splice(index, 1);
        this.renderAllImportantNotes();
    }

    renderAllImportantNotes() {
        const container = document.getElementById('notes-container');
        container.innerHTML = '';
        this.data.important_notes.forEach((note, index) => {
            this.renderImportantNote(note, index);
        });
    }

    addService() {
        const service = { service: '', details: '' };
        this.data.scope_of_service.push(service);
        this.renderService(service, this.data.scope_of_service.length - 1);
    }

    renderService(service, index) {
        const container = document.getElementById('services-container');
        const serviceCard = document.createElement('div');
        serviceCard.className = 'dynamic-card';
        serviceCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Service ${index + 1}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeService(${index})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Service</label>
                <input type="text" class="form-control" value="${service.service}" 
                       onchange="itineraryBuilder.updateService(${index}, 'service', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Details</label>
                <textarea class="form-control" rows="2" 
                          onchange="itineraryBuilder.updateService(${index}, 'details', this.value)">${service.details}</textarea>
            </div>
        `;
        
        container.appendChild(serviceCard);
    }

    updateService(index, field, value) {
        if (this.data.scope_of_service[index]) {
            this.data.scope_of_service[index][field] = value;
        }
    }

    removeService(index) {
        this.data.scope_of_service.splice(index, 1);
        this.renderAllServices();
    }

    renderAllServices() {
        const container = document.getElementById('services-container');
        container.innerHTML = '';
        this.data.scope_of_service.forEach((service, index) => {
            this.renderService(service, index);
        });
    }

    addInclusion() {
        const inclusion = { category: '', count: 0, details: '', status: '' };
        this.data.inclusion_summary.push(inclusion);
        this.renderInclusion(inclusion, this.data.inclusion_summary.length - 1);
    }

    renderInclusion(inclusion, index) {
        const container = document.getElementById('inclusions-container');
        const inclusionCard = document.createElement('div');
        inclusionCard.className = 'dynamic-card';
        inclusionCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Inclusion ${index + 1}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeInclusion(${index})">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" class="form-control" value="${inclusion.category}" 
                           onchange="itineraryBuilder.updateInclusion(${index}, 'category', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-control" value="${inclusion.count}" 
                           onchange="itineraryBuilder.updateInclusion(${index}, 'count', parseInt(this.value))">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label class="form-label">Details</label>
                    <textarea class="form-control" rows="2" 
                              onchange="itineraryBuilder.updateInclusion(${index}, 'details', this.value)">${inclusion.details}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <input type="text" class="form-control" value="${inclusion.status}" 
                           onchange="itineraryBuilder.updateInclusion(${index}, 'status', this.value)">
                </div>
            </div>
        `;
        
        container.appendChild(inclusionCard);
    }

    updateInclusion(index, field, value) {
        if (this.data.inclusion_summary[index]) {
            this.data.inclusion_summary[index][field] = value;
        }
    }

    removeInclusion(index) {
        this.data.inclusion_summary.splice(index, 1);
        this.renderAllInclusions();
    }

    renderAllInclusions() {
        const container = document.getElementById('inclusions-container');
        container.innerHTML = '';
        this.data.inclusion_summary.forEach((inclusion, index) => {
            this.renderInclusion(inclusion, index);
        });
    }

    addActivity() {
        const activity = { city: '', activity: '', type: '', time_required: '' };
        this.data.activities.push(activity);
        this.renderActivity(activity, this.data.activities.length - 1);
    }

    renderActivity(activity, index) {
        const container = document.getElementById('activities-container');
        const activityCard = document.createElement('div');
        activityCard.className = 'dynamic-card';
        activityCard.innerHTML = `
            <div class="card-header">
                <div class="card-title">Activity ${index + 1}</div>
                <button class="remove-btn" onclick="itineraryBuilder.removeActivity(${index})">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control" value="${activity.city}" 
                           onchange="itineraryBuilder.updateActivityItem(${index}, 'city', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Activity Name</label>
                    <input type="text" class="form-control" value="${activity.activity}" 
                           onchange="itineraryBuilder.updateActivityItem(${index}, 'activity', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <input type="text" class="form-control" value="${activity.type}" 
                           onchange="itineraryBuilder.updateActivityItem(${index}, 'type', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Time Required</label>
                    <input type="text" class="form-control" value="${activity.time_required}" 
                           onchange="itineraryBuilder.updateActivityItem(${index}, 'time_required', this.value)">
                </div>
            </div>
        `;
        
        container.appendChild(activityCard);
    }

    updateActivityItem(index, field, value) {
        if (this.data.activities[index]) {
            this.data.activities[index][field] = value;
        }
    }

    removeActivityItem(index) {
        this.data.activities.splice(index, 1);
        this.renderAllActivities();
    }

    renderAllActivities() {
        const container = document.getElementById('activities-container');
        container.innerHTML = '';
        this.data.activities.forEach((activity, index) => {
            this.renderActivity(activity, index);
        });
    }

    loadExampleData() {
        // Load the example Singapore itinerary data
        const exampleData = {
            trip_overview: {
                customer_name: "Rahul",
                trip_title: "Singapore Itinerary",
                duration_days: 4,
                duration_nights: 3,
                travelers: 4,
                departure_from: "Mumbai",
                departure_date: "2025-10-31",
                arrival_date: "2025-11-01",
                destination: "Singapore"
            },
            days: [
                {
                    day_number: 1,
                    date: "27th November",
                    title: "Arrive in Genting And Relax",
                    morning: ["Arrive In Singapore. Transfer From Airport To Hotel"],
                    afternoon: [
                        "Check Into Your Hotel",
                        "Visit Marina Bay Sands Sky Park (2-3 Hours)",
                        "Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge"
                    ],
                    evening: ["Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)"]
                },
                {
                    day_number: 2,
                    date: "28th November",
                    title: "Singapore City Excursion",
                    morning: ["Breakfast at hotel", "Visit Merlion Park"],
                    afternoon: [
                        "Explore Chinatown",
                        "Visit Singapore Botanic Gardens",
                        "Shopping at Orchard Road"
                    ],
                    evening: ["Night Safari at Singapore Zoo"]
                },
                {
                    day_number: 3,
                    date: "29th November",
                    title: "Gardens By The Bay + Marina Bay",
                    morning: ["Universal Studios Singapore"],
                    afternoon: [
                        "Continue at Universal Studios",
                        "Lunch at Sentosa Island"
                    ],
                    evening: ["Return to hotel", "Free time for shopping"]
                }
            ],
            flights: [
                {
                    date: "Thu 31 Oct 25",
                    flight_number: "AX-123",
                    airline: "Air India",
                    route: "From Mumbai (BOM) To Singapore (SIN)"
                },
                {
                    date: "Sun 03 Nov 25",
                    flight_number: "AX-124",
                    airline: "Air India",
                    route: "From Singapore (SIN) To Mumbai (BOM)"
                }
            ],
            flight_notes: [
                "All Flights Are Refundable And Can Be Rebooked With Stinter",
                "Breakfast Included For All Hotel Stays",
                "All Hotels Will Be As And Above Category",
                "A Premium occupancy of 2 people/room is allowed in most hotels"
            ],
            hotels: [
                {
                    city: "Singapore",
                    check_in: "2025-11-01",
                    check_out: "2025-11-03",
                    nights: 3,
                    hotel_name: "Super Townhouse Oak\nVasant Formerly Blue Diamond"
                }
            ],
            payment_plan: {
                total_amount: "₹ 9,00,000",
                gst_note: "For 4 Pax (Inclusive Of GST)",
                tcs_status: "Not Collected",
                installments: [
                    { number: 1, amount: "₹3,50,000", due_date: "Initial Payment" },
                    { number: 2, amount: "₹4,00,000", due_date: "Post Visa Approval" },
                    { number: 3, amount: "Remaining", due_date: "20 Days Before Departure" }
                ]
            },
            visa_details: {
                visa_type: "Tourist Visa",
                validity: "30 Days",
                processing_date: "7-10 Business Days"
            },
            important_notes: [
                {
                    point: "Airlines Standard Policy",
                    details: "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."
                },
                {
                    point: "Flight/Hotel Cancellation",
                    details: "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."
                },
                {
                    point: "Trip Insurance",
                    details: "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."
                }
            ],
            scope_of_service: [
                {
                    service: "Flight Tickets And Hotel Vouchers",
                    details: "Delivered 3 Days Post Full Payment"
                },
                {
                    service: "Web Check-In",
                    details: "Boarding Pass (before) Via Email/WhatsApp"
                },
                {
                    service: "Support",
                    details: "Chat Support — Response Time: 4 Hours"
                }
            ],
            inclusion_summary: [
                {
                    category: "Flight",
                    count: 2,
                    details: "All Flights Mentioned",
                    status: "Awaiting Confirmation"
                },
                {
                    category: "Hotel",
                    count: 1,
                    details: "Super Townhouse Oak Vasant Formerly Blue Diamond",
                    status: "Included"
                }
            ],
            activities: [
                {
                    city: "Singapore",
                    activity: "Marina Bay Sands Sky Park",
                    type: "Nature/Sightseeing",
                    time_required: "2-3 Hours"
                }
            ],
            terms: "All bookings are subject to availability. Cancellation policies apply as per hotel and airline terms."
        };

        this.data = exampleData;
        this.populateFormWithData();
        this.showNotification('Example data loaded successfully!', 'success');
    }

    populateFormWithData() {
        // Populate trip overview
        Object.keys(this.data.trip_overview).forEach(key => {
            const element = document.getElementById(key.replace('_', '-'));
            if (element) {
                element.value = this.data.trip_overview[key];
            }
        });

        // Update payment plan fields
        if (this.data.payment_plan) {
            const totalAmount = document.getElementById('total-amount');
            const gstNote = document.getElementById('gst-note');
            const tcsStatus = document.getElementById('tcs-status');
            
            if (totalAmount) totalAmount.value = this.data.payment_plan.total_amount || '';
            if (gstNote) gstNote.value = this.data.payment_plan.gst_note || '';
            if (tcsStatus) tcsStatus.value = this.data.payment_plan.tcs_status || '';
        }

        // Update terms
        const termsElement = document.getElementById('terms-content');
        if (termsElement) {
            termsElement.value = this.data.terms || '';
        }
        
        // Update visa details
        if (this.data.visa_details) {
            const visaType = document.getElementById('visa-type');
            const visaValidity = document.getElementById('visa-validity');
            const visaProcessing = document.getElementById('visa-processing');
            
            if (visaType) visaType.value = this.data.visa_details.visa_type || '';
            if (visaValidity) visaValidity.value = this.data.visa_details.validity || '';
            if (visaProcessing) visaProcessing.value = this.data.visa_details.processing_date || '';
        }

        // Render all dynamic content
        this.renderAllDays();
        this.renderAllFlights();
        this.renderAllFlightNotes();
        this.renderAllHotels();
        this.renderAllInstallments();
        this.renderAllImportantNotes();
        this.renderAllServices();
        this.renderAllInclusions();
        this.renderAllActivities();
    }



    loadDraft() {
        const fileInput = document.getElementById('file-input');
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.data = data;
                        this.populateFormWithData();
                        this.showNotification('Draft loaded successfully!', 'success');
                    } catch (error) {
                        this.showNotification('Error loading draft file!', 'error');
                    }
                };
                reader.readAsText(file);
            } else {
                this.showNotification('Please select a valid JSON file!', 'error');
            }
        };
        fileInput.click();
    }

    updatePaymentPlan() {
        this.data.payment_plan.total_amount = document.getElementById('total-amount').value;
        this.data.payment_plan.gst_note = document.getElementById('gst-note').value;
        this.data.payment_plan.tcs_status = document.getElementById('tcs-status').value;
    }

    updateTerms() {
        this.data.terms = document.getElementById('terms-content').value;
    }

    previewItinerary() {
        this.updateAllData();
        const previewContent = this.generatePreviewHTML();
        document.getElementById('preview-content').innerHTML = previewContent;
        document.getElementById('preview-modal').classList.add('active');
    }

    updateAllData() {
        this.updateTripOverview();
        this.updatePaymentPlan();
        this.updateVisaDetails();
        this.updateTerms();
    }
    
    saveDraft() {
        this.updateAllData();
        
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vigovia-itinerary-draft-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Draft saved successfully!', 'success');
    }

    generatePreviewHTML() {
        const { trip_overview, days, flights, hotels, payment_plan, visa_details, important_notes, scope_of_service, inclusion_summary, activities, flight_notes } = this.data;
        
        return `
            <div class="pdf-preview">
                <!-- PAGE 1: Trip Introduction + First Day(s) with Footer -->
                <div class="pdf-page">
                    <div class="pdf-page-content">
                    <!-- Vigovia Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; color: #5B3A8C; font-size: 24px; font-weight: bold;">
                            <i class="fas fa-plane"></i>
                            <span>vigovia</span>
                        </div>
                        <div style="color: #5B3A8C; font-size: 14px; font-weight: bold; letter-spacing: 2px;">PLAN.PACK.GO!</div>
                    </div>
                    
                    <!-- Trip Overview Card -->
                    <div style="background: linear-gradient(135deg, #4A90E2, #5B3A8C); color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">Hi, ${trip_overview.customer_name || 'Customer'}!</div>
                        <div style="font-size: 18px; margin-bottom: 8px;">${trip_overview.trip_title || 'Trip Title'}</div>
                        <div style="font-size: 14px; margin-bottom: 15px;">${trip_overview.duration_days || 0} Days ${trip_overview.duration_nights || 0} Nights</div>
                        
                        <!-- Traveler Icons -->
                        <div style="position: absolute; top: 20px; right: 20px; display: flex; align-items: center; gap: 5px;">
                            <div style="display: flex; gap: 3px;">
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.3);"></div>
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.3);"></div>
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.3);"></div>
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.3);"></div>
                            </div>
                            <div style="background: white; color: #5B3A8C; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">${trip_overview.travelers || 0}</div>
                        </div>
                        
                        <!-- Trip Details Box -->
                        <div style="background: white; color: #333; padding: 12px; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                            <div><strong>Departure From:</strong> ${trip_overview.departure_from || 'N/A'}</div>
                            <div><strong>Departure:</strong> ${trip_overview.departure_date || 'N/A'}</div>
                            <div><strong>Arrival:</strong> ${trip_overview.arrival_date || 'N/A'}</div>
                            <div><strong>Destination:</strong> ${trip_overview.destination || 'N/A'}</div>
                            <div style="grid-column: 1 / -1;"><strong>No. Of Travellers:</strong> ${trip_overview.travelers || 0}</div>
                        </div>
                    </div>
                    
                    <!-- Pack First 2-3 Days on Same Page -->
                    ${days.slice(0, 3).map(day => this.generateDayCardHTML(day)).join('')}
                    </div>
                    ${this.generateFooterHTML()}
                </div>
                
                <!-- PAGES 2-N: Remaining Days + Other Content with Smart Packing -->
                ${days.length > 3 ? `
                    <div class="pdf-page">
                        <div class="pdf-page-content">
                            ${days.slice(3).map(day => this.generateDayCardHTML(day)).join('')}
                        </div>
                        ${this.generateFooterHTML()}
                    </div>
                ` : ''}
                
                <!-- PAGE: Flight Summary + Hotel Bookings + Important Notes (Packed) -->
                <div class="pdf-page">
                    <div class="pdf-page-content">
                        ${flights.length > 0 ? `
                            <div class="section-title">Flight <span class="accent">Summary</span></div>
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Flight Details</th>
                                        <th>Route</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${flights.map(flight => `
                                        <tr>
                                            <td>${flight.date}</td>
                                            <td>Fly ${flight.airline} (${flight.flight_number})</td>
                                            <td>${flight.route}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            
                            ${flight_notes && flight_notes.length > 0 ? `
                                <div style="margin: 15px 0;">
                                    ${flight_notes.map((note, index) => `
                                        <div style="margin-bottom: 6px; font-size: 12px;">
                                            <strong>${index + 1}.</strong> ${note}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        ` : ''}
                        
                        ${hotels.length > 0 ? `
                            <div class="section-title">Hotel <span class="accent">Bookings</span></div>
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>City</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Nights</th>
                                        <th>Hotel Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${hotels.map(hotel => `
                                        <tr>
                                            <td>${hotel.city}</td>
                                            <td>${hotel.check_in}</td>
                                            <td>${hotel.check_out}</td>
                                            <td>${hotel.nights}</td>
                                            <td>${hotel.hotel_name}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                    </div>
                    ${this.generateFooterHTML()}
                </div>
                

                
                <!-- PAGE: Important Notes + Scope of Service (Packed) -->
                <div class="pdf-page">
                    <div class="pdf-page-content">
                        ${important_notes && important_notes.length > 0 ? `
                            <div class="section-title">Important <span class="accent">Notes</span></div>
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>Point</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${important_notes.map(note => `
                                        <tr>
                                            <td>${note.point}</td>
                                            <td>${note.details}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                        
                        ${scope_of_service && scope_of_service.length > 0 ? `
                            <div class="section-title">Scope Of <span class="accent">Service</span></div>
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${scope_of_service.map(service => `
                                        <tr>
                                            <td>${service.service}</td>
                                            <td>${service.details}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                    </div>
                    ${this.generateFooterHTML()}
                </div>
                

                
                <!-- PAGE: Inclusion Summary + Activity Table (Packed) -->
                <div class="pdf-page">
                    <div class="pdf-page-content">
                        ${inclusion_summary && inclusion_summary.length > 0 ? `
                            <div class="section-title">Inclusion <span class="accent">Summary</span></div>
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Count</th>
                                        <th>Details</th>
                                        <th>Status / Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${inclusion_summary.map(inclusion => `
                                        <tr>
                                            <td>${inclusion.category}</td>
                                            <td>${inclusion.count || ''}</td>
                                            <td>${inclusion.details}</td>
                                            <td>${inclusion.status || ''}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                        
                        ${activities && activities.length > 0 ? `
                            <div class="section-title">Activity <span class="accent">Table</span></div>
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>City</th>
                                        <th>Activity</th>
                                        <th>Type</th>
                                        <th>Time Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${activities.map(activity => `
                                        <tr>
                                            <td>${activity.city}</td>
                                            <td>${activity.activity}</td>
                                            <td>${activity.type}</td>
                                            <td>${activity.time_required}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                    </div>
                    ${this.generateFooterHTML()}
                </div>
                

                
                <!-- PAGE: Terms + Payment Plan (Packed) -->
                <div class="pdf-page">
                    <div class="pdf-page-content">
                        <div class="section-title">Terms and <span class="accent">Conditions</span></div>
                        <div style="padding: 15px; border: 1px solid #E0E0E0; border-radius: 8px; background: white; margin: 15px 0;">
                            <a href="#" style="color: #4A90E2; text-decoration: underline; font-size: 12px;">${this.data.terms || 'View all terms and conditions'}</a>
                        </div>
                        
                        <div class="section-title">Payment <span class="accent">Plan</span></div>
                        <div style="background: #F8F9FA; border: 1px solid #E0E0E0; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 14px; font-weight: bold; text-align: center;">
                            ${payment_plan.total_amount || '₹ 9,00,000'} ${payment_plan.gst_note || 'For 3 Pax (Inclusive Of GST)'}
                        </div>
                        <div style="text-align: center; font-size: 12px; margin-bottom: 15px;"><strong>TCS:</strong> ${payment_plan.tcs_status || 'Not Collected'}</div>
                        
                        ${payment_plan.installments && payment_plan.installments.length > 0 ? `
                            <table class="pdf-table">
                                <thead>
                                    <tr>
                                        <th>Installment</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${payment_plan.installments.map(inst => `
                                        <tr>
                                            <td>Installment ${inst.number}</td>
                                            <td>${inst.amount}</td>
                                            <td>${inst.due_date}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                    </div>
                    ${this.generateFooterHTML()}
                </div>
                

                
                <!-- FINAL PAGE: Visa Details + Book Now (Packed) -->
                <div class="pdf-page">
                    <div class="pdf-page-content">
                        <div class="section-title">Visa <span class="accent">Details</span></div>
                        <div style="background: white; border: 1px solid #E0E0E0; border-radius: 8px; padding: 15px; margin: 15px 0; display: flex; justify-content: space-around; align-items: center;">
                            <div style="text-align: center; font-size: 12px;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Type:</div>
                                <div style="color: #666;">${visa_details?.visa_type || '123456'}</div>
                            </div>
                            <div style="text-align: center; font-size: 12px;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Validity:</div>
                                <div style="color: #666;">${visa_details?.validity || '123456'}</div>
                            </div>
                            <div style="text-align: center; font-size: 12px;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Processing Date:</div>
                                <div style="color: #666;">${visa_details?.processing_date || '123456'}</div>
                            </div>
                        </div>
                        
                        <!-- Book Now Section -->
                        <div style="text-align: center; margin: 40px 0;">
                            <div style="font-size: 28px; font-weight: bold; color: #5B3A8C; margin-bottom: 15px; letter-spacing: 2px;">PLAN.PACK.GO!</div>
                            <button style="background: #5B3A8C; color: white; border: none; padding: 12px 30px; border-radius: 20px; font-size: 14px; font-weight: bold; cursor: pointer;">Book Now</button>
                        </div>
                    </div>
                    ${this.generateFooterHTML()}
                </div>
                

            </div>
        `;
    }
    
    generateDayCardHTML(day) {
        return `
            <div class="pdf-day-card" style="margin: 15px 0;">
                <div class="pdf-day-sidebar">Day ${day.day_number}</div>
                <div class="pdf-day-main">
                    <div class="pdf-day-image">Image</div>
                    <div class="pdf-day-content">
                        <div class="pdf-day-title">${day.title}</div>
                        <div class="pdf-day-date">${day.date}</div>
                        
                        ${day.morning && day.morning.filter(a => a.trim()).length > 0 ? `
                            <div class="pdf-activity-section">
                                <h4><i class="fas fa-sun"></i> Morning</h4>
                                <ul class="pdf-activity-list">
                                    ${day.morning.filter(a => a.trim()).map(activity => `<li>${activity}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${day.afternoon && day.afternoon.filter(a => a.trim()).length > 0 ? `
                            <div class="pdf-activity-section">
                                <h4><i class="fas fa-sun"></i> Afternoon</h4>
                                <ul class="pdf-activity-list">
                                    ${day.afternoon.filter(a => a.trim()).map(activity => `<li>${activity}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${day.evening && day.evening.filter(a => a.trim()).length > 0 ? `
                            <div class="pdf-activity-section">
                                <h4><i class="fas fa-moon"></i> Evening</h4>
                                <ul class="pdf-activity-list">
                                    ${day.evening.filter(a => a.trim()).map(activity => `<li>${activity}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    generateFooterHTML() {
        return `
            <div class="page-footer">
                <div class="footer-left">
                    <div class="footer-logo">vigovia</div>
                    <div class="footer-tagline">PLAN.PACK.GO!</div>
                    <div class="footer-info">
                        Phone: +91-9504061112 | Email: Utkarshjj@Vigovia.Com<br>
                        CIN: U79119KA2024PTC191890<br>
                        H3-109 Crimebar Hills, Links Business Park, Karnataka, India
                    </div>
                </div>
                <div class="footer-right">vigovia ✈</div>
            </div>
        `;
    }

    generateCompanyFooter() {
        return `
            <div style="background: #f8f8f8; padding: 20px; text-align: left; border-top: 1px solid #E0E0E0; margin-top: 30px; font-size: 12px; display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: #5B3A8C; font-size: 16px; margin-bottom: 5px;">Vigovia Tech Pvt. Ltd</div>
                    <div style="line-height: 1.5;">
                        <strong>Registered Office:</strong> H3-109 Crimebar Hills, Links Business Park, Karnataka, India<br>
                        <strong>Phone:</strong> +91-9504061112<br>
                        <strong>Email ID:</strong> Utkarshjj@Vigovia.Com<br>
                        <strong>CIN:</strong> U79119KA2024PTC191890
                    </div>
                </div>
                <div style="color: #5B3A8C; font-size: 20px; font-weight: bold;">
                    vigovia
                </div>
            </div>
        `;
    }

    async generatePDF() {
        if (!this.validateData()) {
            this.showNotification('Please fill in all required fields before generating PDF!', 'error');
            return;
        }

        this.showLoading();

        try {
            this.updateAllData();

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Create temporary element
            const tempElement = document.createElement('div');
            tempElement.innerHTML = this.generatePreviewHTML();
            tempElement.style.position = 'absolute';
            tempElement.style.left = '-9999px';
            tempElement.style.width = '595px';
            tempElement.style.backgroundColor = 'white';
            tempElement.style.fontFamily = 'Arial, Helvetica, sans-serif';
            document.body.appendChild(tempElement);

            // Page dimensions
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10;
            const footerHeight = 35; // Increased for detailed footer
            const maxContentHeight = pageHeight - (2 * margin) - footerHeight;
            const contentWidth = pageWidth - (2 * margin);

            let currentY = margin;
            let pageNumber = 1;

            // Footer function - matches the provided footer image
            const addFooter = () => {
                const footerStartY = pageHeight - footerHeight;

                // Left section - Company details
                pdf.setFontSize(8);
                pdf.setTextColor(80, 80, 80);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Vigovia Tech Pvt. Ltd', margin, footerStartY + 5);

                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(7);
                pdf.text('Registered Office: Hd-109 Cinnabar-Hills,', margin, footerStartY + 9);
                pdf.text('Links Business Park, Karnataka, India.', margin, footerStartY + 12);

                // Middle section - Contact details
                pdf.setFontSize(7);
                pdf.text('Phone: +91-9504061112', margin + 70, footerStartY + 5);
                pdf.text('Email ID: Utkarshjj@Vigovia.Com', margin + 70, footerStartY + 9);
                pdf.text('CIN: U79110KA2024PTC191590', margin + 70, footerStartY + 12);

                // Right section - Brand and page number
                pdf.setFontSize(10);
                pdf.setTextColor(91, 58, 140);
                pdf.setFont('helvetica', 'bold');
                pdf.text('vigovia', pageWidth - margin - 40, footerStartY + 7);

                pdf.setFontSize(8);
                pdf.setTextColor(80, 80, 80);
                pdf.setFont('helvetica', 'normal');
                pdf.text('PLAN.PACK.GO', pageWidth - margin - 40, footerStartY + 12);

                // Page number
                pdf.setFontSize(7);
                pdf.text(`Page ${pageNumber}`, pageWidth - margin - 15, footerStartY + 16);

                // Separator line above footer
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.2);
                pdf.line(margin, footerStartY, pageWidth - margin, footerStartY);
            };

            // Get all page elements
            const pageElements = tempElement.querySelectorAll('.pdf-page');

            // Process each element
            for (let i = 0; i < pageElements.length; i++) {
                const pageElement = pageElements[i];

                // Get ONLY content (no HTML footer)
                const contentElement = pageElement.querySelector('.pdf-page-content');
                if (!contentElement) continue;

                // Capture content
                const canvas = await html2canvas(contentElement, {
                    scale: 1.5,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    windowWidth: 595
                });

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Check if content fits on current page
                const spaceAvailable = margin + maxContentHeight - currentY;

                if (imgHeight <= spaceAvailable) {
                    // Fits on current page
                    pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
                    currentY += imgHeight + 5;
                } else {
                    // Doesn't fit - move to next page
                    if (currentY > margin + 5) {
                        addFooter();
                        pdf.addPage();
                        pageNumber++;
                        currentY = margin;
                    }

                    // Add to new page
                    if (imgHeight > maxContentHeight) {
                        // Very tall - just place what fits
                        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, Math.min(imgHeight, maxContentHeight));
                        currentY = margin + maxContentHeight;
                    } else {
                        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
                        currentY += imgHeight + 5;
                    }
                }
            }

            // Add footer to last page
            addFooter();

            // Clean up
            document.body.removeChild(tempElement);

            // Download
            const customerName = (this.data.trip_overview.customer_name || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `Vigovia_Itinerary_${customerName}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            this.hideLoading();
            this.showNotification('PDF generated successfully!', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.hideLoading();
            this.showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    validateData() {
        const required = [
            this.data.trip_overview.customer_name,
            this.data.trip_overview.trip_title,
            this.data.trip_overview.departure_from,
            this.data.trip_overview.destination
        ];
        
        return required.every(field => field && field.trim().length > 0);
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
let itineraryBuilder;
document.addEventListener('DOMContentLoaded', () => {
    itineraryBuilder = new ItineraryBuilder();
});

// Global functions for onclick events
function addActivity(dayIndex, period) {
    itineraryBuilder.addActivityToDay(dayIndex, period);
}

function removeActivity(dayIndex, period, actIndex) {
    itineraryBuilder.removeActivity(dayIndex, period, actIndex);
}

function removeActivityItem(index) {
    itineraryBuilder.removeActivityItem(index);
}

// Fix for multiple activity types
function removeDayActivity(dayIndex, period, actIndex) {
    itineraryBuilder.removeActivity(dayIndex, period, actIndex);
}

function addDayActivity(dayIndex, period) {
    itineraryBuilder.addActivityToDay(dayIndex, period);
}

function updateVisaDetails() {
    if (itineraryBuilder) {
        itineraryBuilder.updateVisaDetails();
    }
}

// Additional global helper functions for the exact reference image styling
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${month}`;
}

function formatCurrency(amount) {
    if (!amount) return '';
    // Ensure proper Indian currency formatting
    return amount.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
}