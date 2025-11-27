import os
import pyodbc
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    server = os.getenv("AZURE_SQL_SERVER")
    database = os.getenv("AZURE_SQL_DATABASE")
    username = os.getenv("AZURE_SQL_USER")
    password = os.getenv("AZURE_SQL_PASSWORD")
    driver = os.getenv("AZURE_SQL_DRIVER")

    conn_str = (
        f"DRIVER={{{driver}}};"
        f"SERVER=tcp:{server},1433;"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "Connection Timeout=30;"
    )

    return pyodbc.connect(conn_str)

@app.route("/api/brands", methods=["GET"])
def get_brands():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT TOP 50
                BRAND_ID         AS BrandId,
                BRAND_NAME       AS BrandName,
                BRAND_TYPE       AS BrandType,
                BRAND_URL_ADDR   AS BrandUrl,
                INDUSTRY_NAME    AS IndustryName,
                SUBINDUSTRY_ID   AS SubindustryId,
                SUBINDUSTRY_NAME AS SubindustryName
            FROM dbo.BrandDetail;
        """)

        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        conn.close()

        return jsonify(result), 200
    except Exception as e:
        print("Error /api/brands:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/daily-spend", methods=["GET"])
def get_daily_spend():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT TOP 50
                BRAND_ID     AS BrandId,
                BRAND_NAME   AS BrandName,
                SPEND_AMOUNT AS SpendAmount,
                STATE_ABBR   AS StateAbbr,
                TRANS_COUNT  AS TransCount,
                TRANS_DATE   AS TransDate,
                VERSION      AS Version
            FROM dbo.DailySpend;
        """)

        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        conn.close()
        return jsonify(result), 200
    except Exception as e:
        print("Error /api/daily-spend:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Flask dev server
    app.run(host="0.0.0.0", port=5000, debug=True)