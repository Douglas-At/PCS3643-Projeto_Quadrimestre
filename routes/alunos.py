from flask import Blueprint, jsonify, request
from database import db_session
from models import Aluno
from utils import serialize


alunos_bp = Blueprint("alunos", __name__)

@alunos_bp.route("/", methods=["GET"])
def listar_alunos():
    alunos = db_session.query(Aluno).all()
    return jsonify([serialize(a) for a in alunos])

@alunos_bp.route("/<int:aluno_id>", methods=["GET"])
def obter_aluno(aluno_id):
    aluno = db_session.query(Aluno).get(aluno_id)
    if not aluno:
        return jsonify({"erro": "Aluno não encontrado"}), 404
    return jsonify(serialize(aluno))

@alunos_bp.route("/", methods=["POST"])
def criar_aluno():
    data = request.get_json()
    aluno = Aluno(**data)
    db_session.add(aluno)
    db_session.commit()
    return jsonify(serialize(aluno)), 201
