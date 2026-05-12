import mysql.connector

mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="ev_db",
    port=3306
)


class Db:

    def select(self, q):
        cur = mydb.cursor(dictionary=True)
        cur.execute(q)
        return cur.fetchall()

    def selectOne(self, q, values=None):
        cur = mydb.cursor(dictionary=True)

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        return cur.fetchone()

    def insert(self, q, values=None):
        cur = mydb.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        mydb.commit()
        return cur.lastrowid

    def update(self, q, values=None):
        cur = mydb.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        mydb.commit()
        return cur.rowcount

    def delete(self, q, values=None):
        cur = mydb.cursor()

        if values:
            cur.execute(q, values)
        else:
            cur.execute(q)

        mydb.commit()
        return cur.rowcount