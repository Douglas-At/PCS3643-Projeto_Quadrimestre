from flask import Blueprint, jsonify, request
from database import db_session
from models import RegistroSuspeita
from utils import serialize

registros_bp = Blueprint("registros", __name__)

@registros_bp.route("/", methods=["GET"])
def listar_registros():
    registros = db_session.query(RegistroSuspeita).all()
    return jsonify([serialize(r) for r in registros])

@registros_bp.route("/", methods=["POST"])
def criar_registro():
    data = request.get_json()
    registro = RegistroSuspeita(**data)
    db_session.add(registro)
    db_session.commit()
    return jsonify(serialize(registro)), 201
