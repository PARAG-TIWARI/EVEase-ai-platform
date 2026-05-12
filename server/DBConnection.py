import sqlite3

class Db:
    def __init__(self):
        # We connect to the SQLite embedded database on each initialization
        # to ensure thread safety in Flask
        self.db_path = 'ev_db.sqlite'

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        # Configure row factory to return dict-like objects
        conn.row_factory = sqlite3.Row
        return conn

    def select(self, q):
        # Convert %s to ? for SQLite compatibility
        q = q.replace('%s', '?')
        conn = self._get_connection()
        cur = conn.cursor()
        cur.execute(q)
        results = cur.fetchall()
        conn.close()
        # Convert sqlite3.Row objects to standard dictionaries
        return [dict(row) for row in results]

    def selectOne(self, q, values=None):
        q = q.replace('%s', '?')
        conn = self._get_connection()
        cur = conn.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        result = cur.fetchone()
        conn.close()
        return dict(result) if result else None

    def insert(self, q, values=None):
        q = q.replace('%s', '?')
        conn = self._get_connection()
        cur = conn.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        conn.commit()
        last_id = cur.lastrowid
        conn.close()
        return last_id

    def update(self, q, values=None):
        q = q.replace('%s', '?')
        conn = self._get_connection()
        cur = conn.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        conn.commit()
        rowcount = cur.rowcount
        conn.close()
        return rowcount

    def delete(self, q, values=None):
        q = q.replace('%s', '?')
        conn = self._get_connection()
        cur = conn.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        conn.commit()
        rowcount = cur.rowcount
        conn.close()
        return rowcount