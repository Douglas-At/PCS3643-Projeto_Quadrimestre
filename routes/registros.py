from flask import Blueprint, jsonify, request
from database import db_session
from models import RegistroSuspeita
from utils import serialize

registros_bp = Blueprint("registros", __name__)

@registros_bp.route("/", methods=["GET"])
def listar_registros():
    registros = db_session.query(RegistroSuspeita).all()
    return jsonify([serialize(r) for r in registros])

@registros_bp.route("/sem-agente", methods=["GET"])
def listar_registros_sem_agente():
    registros = (
        db_session.query(RegistroSuspeita)
        .filter(RegistroSuspeita.agente_publico_id == None)
        .all()
    )

    def serialize_registro(r):
        return {
            "id": r.id,
            "descricao": r.descricao,
            "status": r.status,
            "data_registro": r.data_registro,
            
            "aluno": {
                "id": r.aluno.id,
                "nome": r.aluno.nome,
                "endereco": r.aluno.endereco,
                "data_nascimento": r.aluno.data_nascimento,
                "nome_pai": r.aluno.nome_pai,
                "telefone_pai": r.aluno.telefone_pai,
            }
        }

    return jsonify([serialize_registro(r) for r in registros])

@registros_bp.route("/<int:registro_id>/status", methods=["PUT"])
def atualizar_status(registro_id):
    data = request.get_json()
    novo_status = data.get("status")

    registro = db_session.query(RegistroSuspeita).get(registro_id)
    if not registro:
        return jsonify({"erro": "Registro não encontrado"}), 404

    registro.status = novo_status
    db_session.commit()

    return jsonify({"mensagem": "Status atualizado com sucesso"})


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