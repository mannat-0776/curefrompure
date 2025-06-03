const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            google_id TEXT UNIQUE,
            fullname TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            remedy_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, remedy_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            first_name TEXT,
            surname TEXT,
            mobile_number TEXT,
            address1 TEXT,
            address2 TEXT,
            postcode TEXT,
            state TEXT,
            area TEXT,
            education TEXT,
            country TEXT,
            state_region TEXT,
            experience_designing TEXT,
            additional_details TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Helper functions for users
const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (username, email, password, fullname) VALUES (?, ?, ?, ?)',
            [user.username, user.email, user.password, user.fullname],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

// Helper functions for user_profiles
const getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const upsertUserProfile = (userId, profileData) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE user_profiles SET
                first_name = ?,
                surname = ?,
                mobile_number = ?,
                address1 = ?,
                address2 = ?,
                postcode = ?,
                state = ?,
                area = ?,
                education = ?,
                country = ?,
                state_region = ?,
                experience_designing = ?,
                additional_details = ?
            WHERE user_id = ?`,
            [
                profileData.first_name,
                profileData.surname,
                profileData.mobile_number,
                profileData.address1,
                profileData.address2,
                profileData.postcode,
                profileData.state,
                profileData.area,
                profileData.education,
                profileData.country,
                profileData.state_region,
                profileData.experience_designing,
                profileData.additional_details,
                userId
            ],
            function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    db.run(
                        `INSERT INTO user_profiles (
                            user_id, first_name, surname, mobile_number, address1, address2, postcode, state, area, education, country, state_region, experience_designing, additional_details
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            userId,
                            profileData.first_name,
                            profileData.surname,
                            profileData.mobile_number,
                            profileData.address1,
                            profileData.address2,
                            profileData.postcode,
                            profileData.state,
                            profileData.area,
                            profileData.education,
                            profileData.country,
                            profileData.state_region,
                            profileData.experience_designing,
                            profileData.additional_details
                        ],
                        function (err2) {
                            if (err2) reject(err2);
                            else resolve({ id: this.lastID });
                        }
                    );
                } else {
                    resolve({ updated: true });
                }
            }
        );
    });
};

// Helper functions for pages
const upsertPage = (filename, content) => {
    return new Promise((resolve, reject) => {
        const now = new Date().toISOString();
        db.run(
            `INSERT INTO pages (filename, content, created_at, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(filename) DO UPDATE SET
                content=excluded.content,
                updated_at=excluded.updated_at`,
            [filename, content, now, now],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID || null });
            }
        );
    });
};

const getPageByFilename = (filename) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM pages WHERE filename = ?', [filename], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const getAllPages = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM pages', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = { db, getUserByUsername, createUser, getUserProfile, upsertUserProfile, upsertPage, getPageByFilename, getAllPages };
