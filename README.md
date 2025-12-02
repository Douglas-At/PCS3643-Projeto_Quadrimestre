
Para instalar as dependencias do ambiente virtual python é necessário primeiro realziar ( pip install "psycopg[binary]" ) e depois ( pip install -r requirements.txt ). Deve se ter o Node.js 22 instalado.

Para rodar o site deve-se executar ( python app.py ) e dentro da paste site-tea executar ( ng-serve ). O servidor estará em (http://localhost:4200/)

É também necessário ter acesso ao banco de dados com o arquivo ( .env ), cuja estrutura é: 
(
DB_HOST=ip
DB_PORT=port
DB_USER=user
DB_PASSWORD=psswd
DB_NAME=name )
(dados não reais)
