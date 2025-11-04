from flask import Blueprint, jsonify, request
from database import db_session
from models import Usuario
from utils import serialize
from werkzeug.security import check_password_hash,generate_password_hash


usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    usuarios = db_session.query(Usuario).all()
    return jsonify([serialize(u) for u in usuarios])

@usuarios_bp.route("/", methods=["POST"])
def criar_usuario():
    data = request.get_json()
    senha_plana = data.pop("senha")
    senha_hash = generate_password_hash(senha_plana)

    usuario = Usuario(**data, senha_hash=senha_hash)
    db_session.add(usuario)
    db_session.commit()
    return jsonify(serialize(usuario)), 201

@usuarios_bp.route("/login", methods=["POST"])
def login_usuario():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"erro": "E-mail e senha são obrigatórios"}), 400

    usuario = db_session.query(Usuario).filter_by(email=email).first()

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    # compara o hash armazenado com a senha recebida
    if not check_password_hash(usuario.senha_hash, senha):
        return jsonify({"erro": "Senha incorreta"}), 401

    # token fictício (em produção use JWT)
    token = "token_falso_para_teste"

    return jsonify({
        "token": token,
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "tipo_usuario": usuario.tipo_usuario
        }
    }), 200