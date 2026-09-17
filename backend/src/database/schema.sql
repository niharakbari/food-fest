CREATE DATABASE IF NOT EXISTS food_fests;
USE food_fests;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chefs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    status ENUM('upcoming', 'live', 'past') DEFAULT 'upcoming',
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_chefs (
    event_id INT,
    chef_id INT,
    PRIMARY KEY (event_id, chef_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (chef_id) REFERENCES chefs(id) ON DELETE CASCADE
);

-- Insert Dummy Data

INSERT INTO categories (name, icon) VALUES 
('Pizza', '🍕'), ('Burgers', '🍔'), ('Indian', '🍛'), 
('Street Food', '🌮'), ('Desserts', '🍰'), ('Drinks', '🍹'), ('BBQ', '🍖');

INSERT INTO chefs (name, specialty, description, image_url) VALUES 
('Gordon Ramsay', 'Fine Dining', 'Multi-Michelin starred chef.', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80'),
('Massimo Bottura', 'Italian', 'Innovative Italian cuisine.', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80'),
('Dominique Crenn', 'French', 'Poetic culinaria.', 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=500&q=80');

INSERT INTO events (name, description, event_date, start_time, end_time, location, image_url, status, category_id) VALUES 
('The Grand Pizza Slice', 'A marathon of the best pizzas in town.', '2027-10-15', '12:00:00', '22:00:00', 'Downtown Plaza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', 'live', 1),
('Burger Bonanza', 'Gourmet burgers and craft beers.', '2027-10-16', '11:00:00', '20:00:00', 'City Park', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 'upcoming', 2),
('Spice Route Festival', 'Authentic Indian street food.', '2027-10-20', '16:00:00', '23:00:00', 'Heritage Square', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', 'upcoming', 3);

INSERT INTO event_chefs (event_id, chef_id) VALUES 
(1, 2), (2, 1), (3, 3);
