from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Text, Enum
)
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(Enum("professor", "agente_publico", name="tipo_usuario_enum"), nullable=False)

    professor = relationship("Professor", uselist=False, back_populates="usuario")
    agente_publico = relationship("AgentePublico", uselist=False, back_populates="usuario")


class Escola(Base):
    __tablename__ = "escolas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    endereco = Column(String(200))
    telefone = Column(String(50))

    alunos = relationship("Aluno", back_populates="escola")
    professores = relationship("Professor", back_populates="escola")


class Professor(Base):
    __tablename__ = "professores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    escola_id = Column(Integer, ForeignKey("escolas.id"), nullable=False)
    disciplina = Column(String(100))

    usuario = relationship("Usuario", back_populates="professor")
    escola = relationship("Escola", back_populates="professores")
    registros_suspeita = relationship("RegistroSuspeita", back_populates="professor")


class AgentePublico(Base):
    __tablename__ = "agentes_publicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    orgao = Column(String(100))

    usuario = relationship("Usuario", back_populates="agente_publico")
    registros_acompanhados = relationship("RegistroSuspeita", back_populates="agente_publico")

class Aluno(Base):
    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(120), nullable=False)
    data_nascimento = Column(String(20))
    escola_id = Column(Integer, ForeignKey("escolas.id"))
    nome_pai = Column(String(120))
    telefone_pai = Column(String(50))
    endereco = Column(String(200))

    escola = relationship("Escola", back_populates="alunos")
    registros_suspeita = relationship("RegistroSuspeita", back_populates="aluno")

class RegistroSuspeita(Base):
    __tablename__ = "registros_suspeita"

    id = Column(Integer, primary_key=True, autoincrement=True)
    data_registro = Column(DateTime, default=datetime.utcnow)
    descricao = Column(Text)
    aluno_id = Column(Integer, ForeignKey("alunos.id"), nullable=False)
    professor_id = Column(Integer, ForeignKey("professores.id"), nullable=False)
    agente_publico_id = Column(Integer, ForeignKey("agentes_publicos.id"), nullable=True)
    status = Column(Enum("aberto", "em_andamento", "concluido", name="status_suspeita_enum"), default="aberto")

    aluno = relationship("Aluno", back_populates="registros_suspeita")
    professor = relationship("Professor", back_populates="registros_suspeita")
    agente_publico = relationship("AgentePublico", back_populates="registros_acompanhados")
