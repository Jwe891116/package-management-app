document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createPackageBtn = document.getElementById('createPackageBtn');
    const trackPackageBtn = document.getElementById('trackPackageBtn');
    const managePackagesBtn = document.getElementById('managePackagesBtn');
    
    const createPackageSection = document.getElementById('createPackageSection');
    const trackPackageSection = document.getElementById('trackPackageSection');
    const managePackagesSection = document.getElementById('managePackagesSection');
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const packageForm = document.getElementById('packageForm');
    const packageResult = document.getElementById('packageResult');
    const packageDetails = document.getElementById('packageDetails');
    const printLabelBtn = document.getElementById('printLabelBtn');
    
    const trackingNumberInput = document.getElementById('trackingNumberInput');
    const searchPackageBtn = document.getElementById('searchPackageBtn');
    const trackingResult = document.getElementById('trackingResult');
    const packageInfo = document.getElementById('packageInfo');
    const statusUpdateSection = document.getElementById('statusUpdateSection');
    const statusSelect = document.getElementById('statusSelect');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const printTrackedLabelBtn = document.getElementById('printTrackedLabelBtn');
    
    const statusFilter = document.getElementById('statusFilter');
    const shippingMethodFilter = document.getElementById('shippingMethodFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const packagesTableBody = document.getElementById('packagesTableBody');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    // Global variables
    let currentPage = 1;
    let totalPages = 1;
    let currentPackageType = 'one-day';
    let currentPackageData = null;
    
    // Event Listeners
    createPackageBtn.addEventListener('click', () => showSection('create'));
    trackPackageBtn.addEventListener('click', () => showSection('track'));
    managePackagesBtn.addEventListener('click', () => {
        showSection('manage');
        loadPackages();
    });
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPackageType = btn.dataset.type;
        });
    });
    
    packageForm.addEventListener('submit', handlePackageSubmit);
    printLabelBtn.addEventListener('click', printLabel);
    
    searchPackageBtn.addEventListener('click', trackPackage);
    updateStatusBtn.addEventListener('click', updatePackageStatus);
    printTrackedLabelBtn.addEventListener('click', printTrackedLabel);
    
    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1;
        loadPackages();
    });
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPackages();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPackages();
        }
    });
    
    // Functions
    function showSection(section) {
        createPackageSection.classList.add('hidden');
        trackPackageSection.classList.add('hidden');
        managePackagesSection.classList.add('hidden');
        
        if (section === 'create') {
            createPackageSection.classList.remove('hidden');
            packageForm.reset();
            packageResult.classList.add('hidden');
        } else if (section === 'track') {
            trackPackageSection.classList.remove('hidden');
            trackingResult.classList.add('hidden');
            trackingNumberInput.value = '';
        } else if (section === 'manage') {
            managePackagesSection.classList.remove('hidden');
        }
    }
    
    async function handlePackageSubmit(e) {
        e.preventDefault();
        
        const formData = {
            senderName: document.getElementById('senderName').value,
            senderAddress: document.getElementById('senderAddress').value,
            receiverName: document.getElementById('receiverName').value,
            receiverAddress: document.getElementById('receiverAddress').value,
            weight: parseFloat(document.getElementById('weight').value),
            costPerUnitWeight: parseFloat(document.getElementById('costPerUnitWeight').value),
            flatFee: parseFloat(document.getElementById('flatFee').value),
            shippingMethod: currentPackageType === 'one-day' ? 'One-Day' : 'Two-Day'
        };
        
        try {
            const endpoint = currentPackageType === 'one-day' 
                ? '/api/packages/one-day' 
                : '/api/packages/two-day';
                
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create package');
            }
            
            const data = await response.json();
            currentPackageData = data.package;
            
            // Safely handle total_cost which might be string or number
            const totalCost = parseFloat(data.package.total_cost);
            
            // Display the result
            packageDetails.innerHTML = `
                <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
                <p><strong>Status:</strong> ${data.package.status}</p>
                <p><strong>Total Cost:</strong> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
            `;
            
            packageResult.classList.remove('hidden');
            packageForm.reset();
        } catch (error) {
            showError('Error creating package: ' + error.message);
            console.error('Error:', error);
        }
    }
    
    function printLabel() {
        if (!currentPackageData) return;
        
        const printWindow = window.open('', '_blank');
        const totalCost = parseFloat(currentPackageData.total_cost);
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Shipping Label - ${currentPackageData.tracking_number}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .label { border: 2px dashed #000; padding: 20px; max-width: 500px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .section { margin-bottom: 15px; }
                        .bold { font-weight: bold; }
                        .tracking { text-align: center; margin-top: 20px; font-size: 18px; }
                        .barcode { text-align: center; margin-top: 10px; font-family: 'Libre Barcode 128', cursive; font-size: 36px; }
                    </style>
                </head>
                <body>
                    <div class="label">
                        <div class="header">
                            <h2>SHIPPING LABEL</h2>
                            <p>${currentPackageData.shipping_method} Delivery</p>
                        </div>
                        
                        <div class="section">
                            <p class="bold">FROM:</p>
                            <p>${currentPackageData.sender_name}</p>
                            <p>${currentPackageData.sender_address}</p>
                        </div>
                        
                        <div class="section">
                            <p class="bold">TO:</p>
                            <p>${currentPackageData.receiver_name}</p>
                            <p>${currentPackageData.receiver_address}</p>
                        </div>
                        
                        <div class="section">
                            <p><span class="bold">Weight:</span> ${currentPackageData.weight} kg</p>
                            <p><span class="bold">Cost:</span> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
                        </div>
                        
                        <div class="tracking">
                            <p class="bold">TRACKING NUMBER</p>
                            <p>${currentPackageData.tracking_number}</p>
                        </div>
                        
                        <div class="barcode">
                            *${currentPackageData.tracking_number}*
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    async function trackPackage() {
        const trackingNumber = trackingNumberInput.value.trim();
        if (!trackingNumber) {
            showError('Please enter a tracking number');
            return;
        }
        
        try {
            const response = await fetch(`/api/packages/${trackingNumber}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Package not found');
            }
            
            const data = await response.json();
            currentPackageData = data.package;
            
            // Safely handle numeric values
            const totalCost = parseFloat(data.package.total_cost);
            const createdAt = new Date(data.package.created_at);
            const updatedAt = data.package.updated_at ? new Date(data.package.updated_at) : null;
            
            // Display package info
            packageInfo.innerHTML = `
                <p><strong>Sender:</strong> ${data.package.sender_name}</p>
                <p><strong>Receiver:</strong> ${data.package.receiver_name}</p>
                <p><strong>Shipping Method:</strong> ${data.package.shipping_method}</p>
                <p><strong>Status:</strong> ${data.package.status}</p>
                <p><strong>Weight:</strong> ${data.package.weight} kg</p>
                <p><strong>Total Cost:</strong> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
                <p><strong>Created:</strong> ${createdAt.toLocaleString()}</p>
                ${updatedAt ? `<p><strong>Last Updated:</strong> ${updatedAt.toLocaleString()}</p>` : ''}
                <div id="labelContent" class="hidden">${data.package.printLabel}</div>
            `;
            
            // Show update status section if not delivered
            if (data.package.status !== 'Delivered') {
                statusSelect.value = data.package.status;
                statusUpdateSection.classList.remove('hidden');
            } else {
                statusUpdateSection.classList.add('hidden');
            }
            
            trackingResult.classList.remove('hidden');
        } catch (error) {
            showError('Error tracking package: ' + error.message);
            console.error('Error:', error);
        }
    }
    
    async function updatePackageStatus() {
        const newStatus = statusSelect.value;
        
        try {
            const response = await fetch('/api/packages/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackingNumber: currentPackageData.tracking_number,
                    newStatus: newStatus
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }
            
            const data = await response.json();
            currentPackageData = data.package;
            
            // Update displayed status
            const statusElements = packageInfo.querySelectorAll('p');
            if (statusElements.length >= 4) {
                statusElements[3].innerHTML = `<strong>Status:</strong> ${data.package.status}`;
            }
            
            // Hide update section if now delivered
            if (newStatus === 'Delivered') {
                statusUpdateSection.classList.add('hidden');
            }
            
            showSuccess('Status updated successfully');
        } catch (error) {
            showError('Error updating status: ' + error.message);
            console.error('Error:', error);
        }
    }
    
    function printTrackedLabel() {
        if (!currentPackageData) return;
        printLabel();
    }
    
    async function loadPackages() {
        const status = statusFilter.value;
        const shippingMethod = shippingMethodFilter.value;
        
        try {
            let url = `/api/packages?page=${currentPage}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;
            if (shippingMethod) url += `&shippingMethod=${encodeURIComponent(shippingMethod)}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load packages');
            }
            
            const data = await response.json();
            
            // Update pagination info
            totalPages = data.pagination.totalPages;
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            
            // Enable/disable pagination buttons
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
            
            // Populate table
            packagesTableBody.innerHTML = '';
            
            if (data.packages.length === 0) {
                packagesTableBody.innerHTML = '<tr><td colspan="7" class="no-packages">No packages found</td></tr>';
                return;
            }
            
            data.packages.forEach(pkg => {
                const totalCost = parseFloat(pkg.total_cost);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pkg.tracking_number}</td>
                    <td>${pkg.sender_name}</td>
                    <td>${pkg.receiver_name}</td>
                    <td>${pkg.shipping_method}</td>
                    <td><span class="status-badge status-${pkg.status.toLowerCase().replace(' ', '-')}">${pkg.status}</span></td>
                    <td>$${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</td>
                    <td>
                        <button class="view-btn" data-id="${pkg.tracking_number}">View</button>
                    </td>
                `;
                packagesTableBody.appendChild(row);
            });
            
            // Add event listeners to view buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    trackingNumberInput.value = btn.dataset.id;
                    showSection('track');
                    trackPackage();
                });
            });
        } catch (error) {
            showError('Error loading packages: ' + error.message);
            console.error('Error:', error);
        }
    }
    
    // Utility functions
    function showError(message) {
        alert(message); // Replace with a nicer notification system if needed
    }
    
    function showSuccess(message) {
        alert(message); // Replace with a nicer notification system if needed
    }
    
    // Initialize
    showSection('create');
});