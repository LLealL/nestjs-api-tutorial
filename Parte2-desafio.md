# Parte 2 desafio Leal

## Utilizando a API que fez:
* **Pré Requisitos**
	* Fazer esse curso: https://learn.deeplearning.ai/?_gl=1*vquwnv*_ga*MTUwODQzOTc5MC4xNjgzNjQzMzYx*_ga_PZF1GBS1R1*MTY4ODEzOTYxMy41LjAuMTY4ODEzOTYxNC41OS4wLjA.
 	* Fazer também esse curso: https://www.youtube.com/watch?v=cSa-SMVMGsE 	 	
	* Criar uma conta na OpenAI https://openai.com/product
	* Utilizar-se das bibliotecas da https://js.langchain.com/

## Parte 2.1
* Fazer um endpoint para a pessoa falar sobre ela e ele sugerir uma lista de 3 nomes para o filho da pessoa
	* O endpoint deve ser restful (https://aws.amazon.com/what-is/restful-api/), e sincrono, não tem problema se for um pouco lento
	* Segue aqui um exemplo de como isso poderia ser feito
		* https://chat.openai.com/share/af2d1bb3-e96f-461b-9b14-0a99c837e496
	* Lembrando que o exemplo usa o chat GPT, vc deve usar a API da Open AI
## Parte 2.2
* Fazer uma pagina web utilizando-se de vue.js com typescript e a parte de css usando Tailwind.css - aqui sem problemas usar um pronto: 
	* https://freefrontend.com/tailwind-chats/
	* https://codepen.io/cruip/pen/GRMKMOv
	

## Critérios de aceite: 
* O front deverá ter uma tela de login, usar a sua API para logar e depois fazer o chat com a api da Open AI e devolver a lista de nomes 

* E perguntar para a pessoa se ela aprova a lista:
	* se sim? Gravar no banco, o login da pessoa e os nomes que vieram para ela
	* se não? Gravar em uma tabela diferente o login da pessoa e os nomes que vieram errados
* Devo ser capaz de rodar o projeto na minha maquina (Heucles)
* Criar um login para mim
* Acessar a parte web por no endereço http://localhost:8080

### Extra: 

* Escrever testes unitários
* Configurar eslint
 
