from flask import Blueprint, jsonify
from database import engine
import pandas as pd
import numpy as np

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
def listar_dashboard():
    tabela = pd.read_sql("select * from tabela_zanato", con=engine)
    tabela = tabela.replace({np.nan: None})

    registros = tabela.to_dict(orient="records")
    return jsonify(registros)
