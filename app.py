from flask import Flask, render_template, request, redirect, session, flash
from dotenv import load_dotenv
from DBConnection import Db
import os
import requests

# ==========================
# LOAD ENV VARIABLES
# ==========================
load_dotenv()

app = Flask(__name__)

app.secret_key = os.getenv(
    "SECRET_KEY",
    "secret123"
)

# ==========================
# HOME PAGE
# ==========================
@app.route('/')
def home():
    return render_template(
        'index.html'
    )


# ==========================
# ABOUT PAGE
# ==========================
@app.route('/about')
def about():
    return render_template(
        'about.html'
    )


# ==========================
# CONTACT PAGE
# ==========================
@app.route('/contact-us')
def contact_us():
    return render_template(
        'contact_us.html'
    )


# ==========================
# FIND YOUR CHARGER
# ==========================
@app.route('/find-your-charger')
def find_your_charger():

    if 'user_type' not in session:
        return redirect('/login')

    return render_template(
        'user/user_find_your_charger.html'
    )


# ==========================
# USER DASHBOARD
# ==========================
@app.route('/user-dashboard')
def user_dashboard():

    if 'user_type' not in session:
        return redirect('/login')

    db = Db()

    username = session.get('username')
    user_id = session.get('uid')

    # Total Stations
    total_stations = db.select(
        "SELECT * FROM charging_station_list"
    )

    # User Bookings
    my_bookings = db.select(
        f"""
        SELECT *
        FROM booking
        WHERE user_id='{user_id}'
        ORDER BY booking_id DESC
        """
    )

    total_bookings = len(my_bookings)

    recent_booking = (
        my_bookings[0]
        if total_bookings > 0
        else None
    )

    return render_template(
        'user/user_dashboard.html',
        username=username,
        total_stations=len(total_stations),
        total_bookings=total_bookings,
        recent_booking=recent_booking
    )




# ==========================
# LOGIN
# ==========================
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == "POST":

        username = request.form.get(
            'username'
        )

        password = request.form.get(
            'password'
        )

        db = Db()

        query = """
        SELECT *
        FROM login
        WHERE username=%s
        """

        user = db.selectOne(
            query,
            (username,)
        )

        if user:

            if user['password'] == password:

                session['username'] = username
                session['user_type'] = user['usertype']
                session['uid'] = user['login_id']

                # ADMIN LOGIN
                if user['usertype'] == 'admin':
                    return redirect(
                        '/admin-dashboard'
                    )

                # USER LOGIN
                elif user['usertype'] == 'user':
                    return redirect(
                        '/user-dashboard'
                    )

        flash(
            "Invalid username or password",
            "danger"
        )

        return redirect('/login')

    return render_template(
        'login.html'
    )


# ==========================
# REGISTER
# ==========================
@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == "POST":

        username = request.form.get(
            'username'
        )

        password = request.form.get(
            'password'
        )

        confirm_password = request.form.get(
            'confirm_password'
        )

        db = Db()

        # CHECK EMPTY FIELDS
        if not username or not password:

            flash(
                "Please fill all fields",
                "danger"
            )

            return redirect(
                '/register'
            )

        # PASSWORD CHECK
        if password != confirm_password:

            flash(
                "Passwords do not match",
                "danger"
            )

            return redirect(
                '/register'
            )

        # CHECK EXISTING USER
        existing_user = db.selectOne(
            """
            SELECT *
            FROM login
            WHERE username=%s
            """,
            (username,)
        )

        if existing_user:

            flash(
                "Username already exists",
                "warning"
            )

            return redirect(
                '/register'
            )

        # INSERT USER
        db.insert(
            """
            INSERT INTO login
            (
                username,
                password,
                usertype
            )
            VALUES
            (
                %s,
                %s,
                'user'
            )
            """,
            (
                username,
                password
            )
        )

        flash(
            "Registration successful!",
            "success"
        )

        return redirect(
            '/login'
        )

    return render_template(
        'register.html'
    )


# ==========================
# ADMIN DASHBOARD
# ==========================
@app.route('/admin-dashboard')
def admin_dashboard():

    if 'user_type' not in session:
        return redirect('/login')

    db = Db()

    # TOTAL USERS
    users = db.select(
        "SELECT * FROM login WHERE usertype='user'"
    )

    # TOTAL STATIONS
    stations = db.select(
        "SELECT * FROM charging_station_list"
    )

    # TOTAL BOOKINGS
    bookings = db.select(
        """
        SELECT *
        FROM booking
        ORDER BY booking_id DESC
        """
    )

    total_users = len(users)
    total_stations = len(stations)
    total_bookings = len(bookings)

    # DEMO REVENUE
    revenue = total_bookings * 199

    recent_bookings = bookings[:5]
    latest_users = users[-5:]

    return render_template(
        'admin/admin_dashboard.html',

        total_users=total_users,
        total_stations=total_stations,
        total_bookings=total_bookings,
        revenue=revenue,

        recent_bookings=recent_bookings,
        latest_users=latest_users
    )


# ==========================
# LOGOUT
# ==========================
@app.route('/logout')
def logout():

    session.clear()

    flash(
        "Logged out successfully",
        "success"
    )

    return redirect('/')

# ==========================
# SEARCH STATIONS
# ==========================
@app.route('/search-stations', methods=['POST'])
def search_stations():

    city = request.form.get('City')
    charger_type = request.form.get(
        'Charger_type'
    )

    stations = []

    # -----------------------
    # LIVE API (OpenChargeMap)
    # -----------------------

    try:

        api_url = (
            "https://api.openchargemap.io/v3/poi/"
        )

        params = {
            "output": "json",
            "countrycode": "IN",
            "maxresults": 15,
            "compact": True,
            "verbose": False,
            "location": city
        }

        headers = {
            "X-API-Key":
            "ocm-demo-key"
        }

        response = requests.get(
            api_url,
            params=params,
            headers=headers,
            timeout=8
        )

        if response.status_code == 200:

            api_data = response.json()

            for item in api_data:

                address = item.get(
                    "AddressInfo", {}
                )

                connections = item.get(
                    "Connections", []
                )

                station = {

                    "station_id":
                    item.get("ID"),

                    "station_name":
                    address.get(
                        "Title",
                        "EV Station"
                    ),

                    "city":
                    city,

                    "location":
                    address.get(
                        "AddressLine1",
                        "Unknown Location"
                    ),

                    "charger_type":
                    charger_type,

                    "available_slots":
                    len(connections),

                    "status":
                    "Live Available"
                }

                stations.append(station)

    except Exception as e:

        print("API Error:", e)

    # -----------------------
    # FALLBACK DATABASE
    # -----------------------

    if len(stations) == 0:

        db = Db()

        query = f"""
        SELECT *
        FROM charging_station_list
        WHERE city='{city}'
        AND charger_type=
        '{charger_type}'
        LIMIT 20
        """

        stations = db.select(query)

    return render_template(
        'user/station_search.html',
        stations=stations,
        city=city,
        charger_type=charger_type
    )
# ==========================
# BOOK SLOT PAGE
# ==========================
@app.route('/book-slot/<int:station_id>')
def book_slot(station_id):

    if 'user_type' not in session:
        return redirect('/login')

    db = Db()

    query = f"""
    SELECT *
    FROM charging_station_list
    WHERE station_id={station_id}
    """

    station = db.selectOne(query)

    return render_template(
        'user/book_slot.html',
        station=station
    )
# ==========================
# SAVE BOOKING
# ==========================
@app.route('/save-booking', methods=['POST'])
def save_booking():

    if 'user_type' not in session:
        return redirect('/login')

    user_id = session.get('uid')

    station_name = request.form.get(
        'station_name'
    )

    city = request.form.get(
        'city'
    )

    charger_type = request.form.get(
        'charger_type'
    )

    booking_date = request.form.get(
        'booking_date'
    )

    booking_time = request.form.get(
        'booking_time'
    )

    db = Db()

    query = f"""
    INSERT INTO booking
    (
        user_id,
        station_name,
        city,
        charger_type,
        booking_date,
        booking_time
    )
    VALUES
    (
        '{user_id}',
        '{station_name}',
        '{city}',
        '{charger_type}',
        '{booking_date}',
        '{booking_time}'
    )
    """

    booking_id = db.insert(query)

    # -------------------------
    # GOOGLE MAPS VARIABLES
    # -------------------------

    station_query = (
        f"{station_name}, {city}, India"
    )

    google_api_key = os.getenv(
        "GOOGLE_MAPS_API_KEY"
    )

    return render_template(
        'user/booking_success.html',

        booking_id=booking_id,
        station_name=station_name,
        city=city,
        charger_type=charger_type,
        booking_date=booking_date,
        booking_time=booking_time,

        # NEW VARIABLES
        station_query=station_query,
        google_api_key=google_api_key
    )
# ==========================
# RUN APP
# ==========================
if __name__ == "__main__":

    app.run(
        debug=True
    )