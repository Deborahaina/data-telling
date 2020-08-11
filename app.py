#import dependencies
import os

#flask dependencies
from flask import Flask, render_template, jsonify

#sqlalchemy orm 
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import Session

#mysql dependencies
import pymysql
pymysql.install_as_MySQLdb()

import pandas as pd


is_prod = os.environ.get('IS_HEROKU', None)	


if is_prod:	
    endpoint = os.environ.get('endpoint')	
    instance = os.environ.get('instance')	
    password = os.environ.get('password')	
    port = os.environ.get('port')	
    username = os.environ.get('username')	
else:	
    from config import endpoint, username, password, instance, port


dburl= f"mysql://{username}:{password}@{endpoint}:{port}/{instance}"

app = Flask(__name__)

SQLALCHEMY_TRACK_MODIFICATIONS = False

app.config["SQLALCHEMY_DATABASE_URI"] = dburl
app.config['JSON_SORT_KEYS'] = False  

db = SQLAlchemy(app)
engine = create_engine(f"mysql://{username}:{password}@{endpoint}:{port}/{instance}")
conn = engine.connect()

Base = automap_base()
Base.prepare(engine, reflect=True)

#Save reference to tables in the db
Stocks_table = Base.classes.stocks



@app.route("/")
def index():
    return render_template('index.html')

@app.route("/visualizations")
def visuals():
    return render_template('viz.html')

@app.route("/skills")
def techincal_skills():
    return render_template('skills.html')


@app.route("/stocks_data")
def stock_analysis_():
    conn = engine.connect()
    #create list of columns
    stocks_data = pd.read_sql("SELECT * FROM Stocks_table", conn)
    stocks_data_json = stocks_data.to_dict(orient="records")
    return jsonify(stocks_data_json)


@app.route("/metadata/<sample>")
def sample_metadata(sample):
    """Return the MetaData for a given sample."""
    sel = [
        Samples_Metadata.sample,
        Samples_Metadata.ETHNICITY,
        Samples_Metadata.GENDER,
        Samples_Metadata.AGE,
        Samples_Metadata.LOCATION,
        Samples_Metadata.BBTYPE,
        Samples_Metadata.WFREQ,
    ]

    results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata["sample"] = result[0]
        sample_metadata["ETHNICITY"] = result[1]
        sample_metadata["GENDER"] = result[2]
        sample_metadata["AGE"] = result[3]
        sample_metadata["LOCATION"] = result[4]
        sample_metadata["BBTYPE"] = result[5]
        sample_metadata["WFREQ"] = result[6]

    print(sample_metadata)
    return jsonify(sample_metadata)

@app.route("/metadata/<sample>")
def preferredStocks(sample):
    conn = engine.connect()

    # Filter the data based on the ticker submitted by the user
    #AMD, SHOP, ADP, GE etc
    stocks_data = pd.read_sql("SELECT * FROM trending_stocks", conn)
    stocks_data = stocks_data.loc[stocks_data["Ticker"] == choice]
    stocksChosen_json = stocks_data.to_dict(orient="records")

    return jsonify(stocksChosen_json)


if __name__ == "__main__":
    app.run(debug=True)