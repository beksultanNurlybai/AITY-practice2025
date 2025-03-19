const pool = require('../config/db');

const cleanupExpiredUsers = async () => {
    try {
        await pool.query(`DELETE FROM pending_users WHERE expires_at < NOW()`);
        console.log('Expired users removed from pending_users');
    } catch (error) {
        console.error('Error deleting expired users:', error);
    }
};

// Run cleanup every hour
setInterval(cleanupExpiredUsers, 60 * 60 * 1000);

// Run cleanup immediately when script starts
cleanupExpiredUsers();
