from flask import Blueprint, jsonify, request
from database import db_session
from models import Usuario
from utils import serialize

usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    usuarios = db_session.query(Usuario).all()
    return jsonify([serialize(u) for u in usuarios])

@usuarios_bp.route("/", methods=["POST"])
def criar_usuario():
    data = request.get_json()
    usuario = Usuario(**data)
    db_session.add(usuario)
    db_session.commit()
    return jsonify(serialize(usuario)), 201
