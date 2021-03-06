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
#Stocks_table = Base.classes.trending_stocks

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/visualizations")
def visuals():
    return render_template('stocks.html')

@app.route("/scatter")
def scatter():
    return render_template('d3.html')

@app.route("/skills")
def techincal_skills():
    return render_template('skills.html')

@app.route("/mapping")
def maps():
    return render_template('map.html')

@app.route("/ML")
def machine_learning():
    return render_template('ML.html')


@app.route("/census_data")
def censusData():
    conn = engine.connect()
    #create list of column names
    census_df = pd.read_sql("SELECT * FROM census_data", conn)
    census_json = census_df.to_dict(orient="records")
    return jsonify(census_json)




if __name__ == "__main__":
    app.run(debug=True)