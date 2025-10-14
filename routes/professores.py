from flask import Blueprint, jsonify
from database import db_session
from models import Professor
from utils import serialize

professores_bp = Blueprint("professores", __name__)

@professores_bp.route("/", methods=["GET"])
def listar_professores():
    professores = db_session.query(Professor).all()
    return jsonify([serialize(p) for p in professores])
