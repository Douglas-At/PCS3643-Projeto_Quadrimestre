## Instalação do Ambiente

Para instalar as dependências do ambiente virtual Python, execute:

```bash
pip install "psycopg[binary]"
pip install -r requirements.txt
```

Certifique-se também de ter o **Node.js 22** instalado.

---

## Executando o Projeto

Para rodar o backend (Python):

```bash
python app.py
```

Para rodar o frontend Angular, entre na pasta `site-tea` e execute:

```bash
ng serve
```

O servidor estará disponível em:

```
http://localhost:4200/
```

---

## Configuração do Banco de Dados

É necessário possuir um arquivo `.env` com a seguinte estrutura:

```
DB_HOST=ip
DB_PORT=port
DB_USER=user
DB_PASSWORD=psswd
DB_NAME=name
```

*(valores fictícios acima, substitua pelos reais)*
