from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from database import db_session
from models import Usuario

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'chave_dev')

    from routes.alunos import alunos_bp
    app.register_blueprint(alunos_bp, url_prefix='/api/alunos')

    from routes.professores import professores_bp
    app.register_blueprint(professores_bp, url_prefix='/api/professores')

    from routes.registros import registros_bp
    app.register_blueprint(registros_bp, url_prefix='/api/registros')

    from routes.usuarios import usuarios_bp
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')

    @app.route('/')
    def index():
        return {"mensagem": "API sprint 1"}

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    return app

application = create_app()

if __name__ == "__main__":
    application.run(debug=True, host="0.0.0.0", port=5000)
