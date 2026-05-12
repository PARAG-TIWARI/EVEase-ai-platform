import sqlite3
import os

def setup():
    if os.path.exists('ev_db.sqlite'):
        os.remove('ev_db.sqlite')
        
    conn = sqlite3.connect('ev_db.sqlite')
    cursor = conn.cursor()

    # Create admin_charging_station_list
    cursor.execute('''
    CREATE TABLE admin_charging_station_list (
      station_id INTEGER PRIMARY KEY AUTOINCREMENT,
      Station_name TEXT NOT NULL,
      Address TEXT NOT NULL,
      City TEXT NOT NULL,
      Charger_type TEXT NOT NULL,
      Available_ports TEXT NOT NULL,
      Status TEXT NOT NULL
    )
    ''')

    # Create login
    cursor.execute('''
    CREATE TABLE login (
      login_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      usertype TEXT DEFAULT 'user'
    )
    ''')

    # Create charging_station_list
    cursor.execute('''
    CREATE TABLE charging_station_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      charger_type TEXT NOT NULL,
      available_slots INTEGER NOT NULL DEFAULT 4,
      location TEXT,
      status TEXT NOT NULL DEFAULT 'Active'
    )
    ''')

    # Create booking
    cursor.execute('''
    CREATE TABLE booking (
      booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      station_name TEXT NOT NULL,
      city TEXT NOT NULL,
      charger_type TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Insert admin login
    cursor.execute("INSERT INTO login (username, password, usertype) VALUES ('admin', 'admin', 'admin')")
    cursor.execute("INSERT INTO login (username, password, usertype) VALUES ('user', 'user', 'user')")
    
    # Insert some stations
    stations = [
        ('ABC Charging Station', '123 Main St', 'Thiruvananthapuram', 'AC Level 1 Charging', 4, '123 Main St', 'Active'),
        ('XYZ Charging Station', '456 Elm St', 'Kollam', 'AC Level 2 Charging', 2, '456 Elm St', 'Active'),
        ('123 Charging Station', '789 Oak St', 'Pathanamthitta', 'DC Fast Charging', 6, '789 Oak St', 'Active'),
    ]
    cursor.executemany("INSERT INTO charging_station_list (station_name, address, city, charger_type, available_slots, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)", stations)

    conn.commit()
    conn.close()
    print("Serverless SQLite Database setup successfully! XAMPP is no longer needed.")

if __name__ == '__main__':
    setup()
