// Residents Data Management App

class ResidentManager {
    constructor() {
        this.residents = this.loadResidents();
    }

    loadResidents() {
        const data = localStorage.getItem('residents');
        return data ? JSON.parse(data) : [];
    }

    saveResidents() {
        localStorage.setItem('residents', JSON.stringify(this.residents));
    }

    addResident(name, age, address, finance) {
        const resident = { name, age, address, finance };
        this.residents.push(resident);
        this.saveResidents();
    }

    getResidents() {
        return this.residents;
    }

    updateResident(index, updatedData) {
        this.residents[index] = { ...this.residents[index], ...updatedData };
        this.saveResidents();
    }

    deleteResident(index) {
        this.residents.splice(index, 1);
        this.saveResidents();
    }
}

class FinanceManager {
    constructor() {
        this.financialData = this.loadFinancialData();
    }

    loadFinancialData() {
        const data = localStorage.getItem('financeData');
        return data ? JSON.parse(data) : {};
    }

    saveFinancialData() {
        localStorage.setItem('financeData', JSON.stringify(this.financialData));
    }

    addExpense(category, amount) {
        if (!this.financialData[category]) {
            this.financialData[category] = 0;
        }
        this.financialData[category] += amount;
        this.saveFinancialData();
    }

    getExpenses() {
        return this.financialData;
    }
}

class Dashboard {
    constructor(residentManager, financeManager) {
        this.residentManager = residentManager;
        this.financeManager = financeManager;
    }

    render() {
        // Logic to render the dashboard using data from resident and finance managers
        console.log('Residents: ', this.residentManager.getResidents());
        console.log('Financial Data: ', this.financeManager.getExpenses());
    }
}

const residentManager = new ResidentManager();
const financeManager = new FinanceManager();
const dashboard = new Dashboard(residentManager, financeManager);

dashboard.render();