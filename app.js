
class Pesquisa {

	constructor(titulo, autor, tipo, pagina, data){//responsavael por retornar os valores e não os campos

		this.titulo = titulo
		this.autor = autor
		this.tipo = tipo
		this.pagina = pagina
		this.data = data

	}

	validarDados() {//valida se os dados foram inseridos e nao haja campos em branco

		if(btn_in) {		//se der erro é aqui

			for (let i in this) {
				//console.log(i, this[i]) //debug 4 - recupera os indices e com o array de this recuperamos o valor
				if(this[i] == undefined || this[i] == '' || this[i] == null) {
					return false//retorna false se algum dos campos não estiverem preenchidos - operador OU
				}
			}

		}

			return true//retorna true se todos os campos estiverem preenchidos		
		

	}

}

class Bd {

	constructor() {

		let id = localStorage.getItem('id')//recupera um dado dentro do LS

		if(id === null) {

			localStorage.setItem('id', 0)//inicializa o indice caso não exista no LS
		}

	}

	getProximoId(){//verifica se tem um id ja cadastrado

		let proximoId = localStorage.getItem('id')//recupera um dado dentro do LS

		//console.log(parseInt(proximoId) + 1 )//debug 2
		return parseInt(proximoId) +1

	}

	gravar(p) {
		
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(p))//comunicação com o LS atraves do protocolo JSON - atrela os dados ao novo id

		localStorage.setItem('id', id)//atualiza a chave id com o id recuperado

	}

	recuperarTodosRegistros() {

		let pesquisas = Array() //array de pesquisas

		//console.log('estamos chegando ate aqui')//debug 5
		let id = localStorage.getItem('id')

		for(let i = 1; i <= id; i++) {//recupera todas as pesquisas cadastradas em LS

			let pesquisa = JSON.parse(localStorage.getItem(i)) //recuperar a pesquisa convertendo JSON de string para um objeto literal
			//console.log(pesquisa)//debug 5.1

			if(pesquisa === null) {//verifica se ha null no LS
				continue//desconsidera o item e pula para o proximo indice
			} //se estiver tudo certo, avança para o proximo incluindo o registro no Array

			pesquisa.id = i//recupera a key do LS

			pesquisas.push(pesquisa)//a cada iteração ele acrescente uma pesquisa no array pesquisas			

		}

		//console.log(pesquisas)//debug 5.2
		return pesquisas//necessario declarar o retorno das pesquisas encontradas
	}

	pesquisar(pesquisa){

		//console.log(pesquisa)//debug 6.1

		let pesquisasFiltradas = Array() //recuperando as pesquisas registradas para filtrar por pesquisa
		pesquisasFiltradas = this.recuperarTodosRegistros()

		console.log(pesquisasFiltradas)//debug 6.2
		console.log(pesquisa)//debug 6.2.1

		if(pesquisa.titulo != ''){

			console.log('filtro de titulo')
			//filtros dos elementos
		pesquisasFiltradas = pesquisasFiltradas.filter(p => p.titulo == pesquisa.titulo)

		}

		if(pesquisa.autor != ''){

			console.log('filtro de autor')
			//filtros dos elementos
		pesquisasFiltradas = pesquisasFiltradas.filter(p => p.autor == pesquisa.autor)

		}

		if(pesquisa.tipo != ''){

			console.log('filtro de tipo')
			//filtros dos elementos
		pesquisasFiltradas = pesquisasFiltradas.filter(p => p.tipo == pesquisa.tipo)

		}

		if(pesquisa.pagina != ''){

			console.log('filtro de pagina')
			//filtros dos elementos
		pesquisasFiltradas = pesquisasFiltradas.filter(p => p.pagina == pesquisa.pagina)

		}

		if(pesquisa.data != ''){

			console.log('filtro de data')
			//filtros dos elementos
		pesquisasFiltradas = pesquisasFiltradas.filter(p => p.data == pesquisa.data)

		}

		return pesquisasFiltradas
	}

	remover(id) {//metodo de remover registro pr meio do botão

		localStorage.removeItem(id)

	}
}

let bd = new Bd()



function cadastrarPesquisa() {//responsavel pelo cadastro da pesquisa

	let titulo = document.getElementById('titulo')
	let autor = document.getElementById('autor')
	let tipo = document.getElementById('tipo')
	let pagina = document.getElementById('pagina')
	let data = document.getElementById('data')

	//console.log(titulo.value, autor.value, tipo.value) /*debug 1.0*/

	let pesquisa = new Pesquisa(

		titulo.value,
		autor.value,
		tipo.value,
		pagina.value,
		data.value

		)

	if(pesquisa.validarDados()) {

		//console.log(pesquisa) /*debug 1.1*/
		bd.gravar(pesquisa)


		//alterar via html os dados da apresentação da caixa de dialogo na tela da aplicação
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso.'
		document.getElementById('modal_titulo_div').className = 'modal-header tex-success'
		document.getElementById('modal_conteudo').innerHTML = 'Pesquisa foi cadastrada com sucesso.'
		document.getElementById('modal_btn').innerHTML = 'Fechar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		//console.log('dados validados com sucesso') //debug 4.1
		$('#modalRegistraPesquisa').modal('show')//exibe uma caixa de dialogo informando o sucesso do registro

		//limpa os campos apos a inserçao dos dados
		titulo.value = ''
		autor.value = ''
		tipo.value = ''
		pagina.value = ''
		data.value =''

		//window.location.reload()//recarrega a pagina e a tabela com a nova inclusão


	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na gravação'
		document.getElementById('modal_titulo_div').className = 'modal-header tex-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação. Verifique se todos os campos foram preenchidos corretamente.'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir.'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//console.log('dados invalidos') //debug 4.1
		$('#modalRegistraPesquisa').modal('show')//exibe uma caixa de dialogo informando o erro

		window.location.reload()//recarrega a pagina apos a apresentação do modal

	}	

}

function carregaListaPesquisas(pesquisas = Array(), filtro = false) {

	if(pesquisas.length == 0 && filtro == false) {

		pesquisas = bd.recuperarTodosRegistros()
	}

	//console.log(pesquisas)//debug 5.3

	let listaPesquisas = document.getElementById('listaPesquisas')//variavel do elemento tbody da tabela

	listaPesquisas.innerHTML = ''

	//percorrer  array de pesquisas de forma dinamica
	pesquisas.forEach(function(p) {

		//console.log(p)//debug 6
		let linha = listaPesquisas.insertRow() //criação da linha (tr)

		linha.insertCell(0).innerHTML = p.titulo //populando a tabela - colunas (td)
		linha.insertCell(1).innerHTML = p.autor //populando a tabela - colunas (td)

		//ajustar o tipo
		switch(p.tipo) {
			case '1': p.tipo = 'Tese'
				break
			case '2': p.tipo = 'TCC'
				break
			case '3': p.tipo = 'Outros'
				break
		}
		
		linha.insertCell(2).innerHTML = p.tipo //populando a tabela - colunas (td)
		linha.insertCell(3).innerHTML = p.pagina //populando a tabela - colunas (td)
		linha.insertCell(4).innerHTML = p.data //populando a tabela - colunas (td)

		//inclusão do botão de exclusão de registro
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_pesquisa_${p.id}`//associ as keys acada registro

		btn.onclick = function() {

			//alert(this.id)//debug 7

			let id = this.id.replace('id_pesquisa_', '')
			bd.remover(id)

			window.location.reload()
		}

		linha.insertCell(5).append(btn)

		//console.log(p)//debug 6.5


	})

}

function procurarPesquisa() {

	let titulo = document.getElementById('titulo').value
	let autor = document.getElementById('autor').value
	let tipo = document.getElementById('tipo').value
	let pagina = document.getElementById('pagina').value
	let data = document.getElementById('data').value

	let pesquisa = new Pesquisa(titulo, autor, tipo, pagina, data)

	let pesquisas = bd.pesquisar(pesquisa)

	this.carregaListaPesquisas(pesquisas, true)

}