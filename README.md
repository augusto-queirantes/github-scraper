# Github serverless scraper

Scraper do github que trata e armazena dados provenientes de um webhook. Esses dados são armazenados no (S3)[https://aws.amazon.com/pt/s3/] sempre que um pull request é mergeado. É possível fazer uma integração com o (Athena)[https://aws.amazon.com/pt/athena/] para consultar dados já armazenados.

## Instalação

1. Instale o npm:
    * ```sudo apt install npm```
2. Instale as dependências:
    * ```npm install```
3. Instale o framework serverless:
    * ```sudo npm install -g serverless```
4. Criar variáveis de ambiente dentro do projeto:
    * ```touch .env```
    * Adicione as seguintes variáveis de ambiente:
        * `GIT_API_KEY`: Contém a chave de autenticação do github, pode ser obitda no [link](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
        * `S3_ACCESS_KEY_ID`e `S3_SECRET_ACCESS_KEY`: São as chaves de autenticaçao da AWS, podem ser obtidas através do [link](https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/)
        * `S3_BUCKET_NAME`: É o nome do bucket criado no [S3](https://console.aws.amazon.com/s3/home?region=us-east-1)
        * `S3_BUCKET_FOLDER`: É o nome da pasta criada dentro do bucket

## Deploy

Para ser possível fazer o deploy da aplicação é necessário:

1. Configurar o serverless na linha de comando:
    * ```serverless config credentials --provider aws --key < ACCESS_KEY_ID > --secret < SECRET_ACCESS_KEY >```
    * Substitua os campos `ACCESS_KEY_ID` e `SECRET_ACCESS_KEY` pelas credenciais já obtidas da AWS

* Deploy de todo o projeto:

  * ```serverless deploy```

* Deploy de funções específicas:
  * ```serverless deploy -f < FUNCTION_NAME >```
  * Substitua `FUNCTION_NAME` pelo nome da função que deve ser deployada

## Configurando o webhook

Para que o webhook funcione corretamente é necessário seguir os seguintes passos:

1. Entre no seu projeto no github

2. Entre na aba `Settings` do menu localizado entre o nome do projeto e a descrição do projeto

3. Entre na aba `Webhooks` localizada no menu lateral a página

4. Clique no botão `Add webhook` no canto direito da página

5. Adicione a url obtida após o deploy no campo `Payload URL`

6. Troque o `Content type` para `application/json`

7. Selecione `Let me select individual events` e marque somente a opção `Pull requests`

8. Tenha certeza que a opção `Active` está marcada

9. Clique no botão `Update webhook`

## Rotas

O projeto possui somente uma rota que é destinada à `POST`. Essa URL será usada somente para o webhook do github fazer posts toda vez que um pull request for modificado ou criado.

## Testes

  Os testes unitários da aplicação foram escritos usando o framework [jest](https://jestjs.io/)

  Para rodar os testes:
  * ```npm run test```

## Style guide

  O style guide usado no projeto é [airbnb](https://github.com/airbnb/javascript). O lint do projeto é verificado através do [eslint](https://eslint.org/)

  Para rodar o lint:
  * ```npm run lint```
