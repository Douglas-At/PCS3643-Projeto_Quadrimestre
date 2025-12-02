from flask import Blueprint, jsonify, request
from database import db_session
from models import RegistroSuspeita
from utils import serialize

registros_bp = Blueprint("registros", __name__)

@registros_bp.route("/", methods=["GET"])
def listar_registros():
    registros = db_session.query(RegistroSuspeita).all()
    return jsonify([serialize(r) for r in registros])

@registros_bp.route('', methods=['POST'])
def criar_registro():
    dados = request.json
    print("Dados recebidos:", dados)


    try:
        registro = RegistroSuspeita(
            descricao=dados.get("descricao", "Suspeita registrada."),
            aluno_id=dados["aluno_id"],
            professor_id=dados["professor_id"]
        )

        db_session.add(registro)
        db_session.commit()

        return jsonify({"mensagem": "Registro criado com sucesso"}), 201

    except Exception as e:
        db_session.rollback()
        return jsonify({"erro": str(e)}), 400