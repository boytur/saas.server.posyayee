const userDecode = require("./userDecode");

class Permission {

    constructor(req) {
        this.role = (userDecode(req))?.user?.user_role || '';
        this.user_acc_verify = (userDecode(req))?.user?.user_acc_verify || '';
    }

    canGetOrderSessionId() {
        if (this.role === "owner" && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canLogout() {
        if (this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewAdminAnalytic() {
        if ((this.role === 'god') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewProduct() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewAddUnit() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewAddCategories() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canCreatePromotion() {
        if (this.role === "owner" && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canGetBill() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canGetStoreUser() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canSellProducts() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewDashboard() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canManageEmployees() {
        if (this.role === 'god' || this.role === 'owner' || sthis.role === 'manager') {
            return true;
        }
        return false;
    }
}

module.exports = Permission;
