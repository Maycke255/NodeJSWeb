const path = require('path')

class DashboardController {
    dashboard (req, res) {
        console.log(req.session.authenticated);
        console.log(req.session.currentUser);

        return res.sendFile(path.join(__dirname, '../public/dashboard.html'));
    }
}

module.exports = new DashboardController();