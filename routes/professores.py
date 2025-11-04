from flask import Blueprint, jsonify, request
from database import db_session
from models import Usuario, Professor, Escola,Aluno
from utils import serialize
from werkzeug.security import generate_password_hash

professores_bp = Blueprint("professores", __name__)

@professores_bp.route("/", methods=["GET"])
def listar_professores():
    professores = db_session.query(Professor).all()
    return jsonify([serialize(p) for p in professores])

@professores_bp.route("/<int:professor_id>/escolas", methods=["GET"])
def listar_escolas_do_professor(professor_id):
    professores = db_session.query(Professor).filter_by(usuario_id=professor_id).all()
    if not professores:
        return jsonify({"erro": "Professor não encontrado ou sem escolas"}), 404

    escolas = [
        {
            "id": p.escola.id,
            "nome": p.escola.nome,
            "disciplina": p.disciplina
        }
        for p in professores
    ]
    return jsonify(escolas)

@professores_bp.route("/<int:professor_id>/escolas/<int:escola_id>/alunos", methods=["GET"])
def listar_alunos_do_professor_na_escola(professor_id, escola_id):

    professor = db_session.query(Professor).filter_by(usuario_id=professor_id, escola_id=escola_id).first()
    if not professor:
        return jsonify({"erro": "Professor não vinculado a esta escola"}), 404

    alunos = db_session.query(Aluno).filter_by(escola_id=escola_id).all()
    return jsonify([
        {"id": aluno.id, "nome": aluno.nome, "data_nascimento": aluno.data_nascimento}
        for aluno in alunos
    ])

