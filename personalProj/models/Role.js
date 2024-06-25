const { User } = require("./User");

class Role {
    /**
     * Link to user who owns role record.
     * @type {User}
     */
    user;

    constructor(user) {
        this.user = user;
    }

    get user() {
        return this.user;
    }

    /**
     * @param {User} user
     */
    set user(user) {
        if (this.user) { return; }
        this.user = user;
    }
}

module.exports = { Role };