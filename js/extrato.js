let total = 0
let valor = 0
let numeroRegistro
let lancamentos = []
let lancamento
let retornoLancamentos
let novoID = 0

String.prototype.isEmpty = function () {
    return (this.length === 0 || !this.trim());
};

Date.prototype.isValid = function () {
    return !(this == "Invalid Date") ? true : false
};


function soma(valor) {
    return total += valor
}

function VerificaSeEhNegativo(valor, obj) {
    if (valor < 0) {
        return obj.find('.valor').css('color', 'red')
    }
}

function atualizaSaldo(total, obj) {
    return obj.find('.saldo').html(total)
}

function getValor(obj) {
    return parseFloat(obj.find('.valor').html());
}

function getNumRegistro(obj) {
    return parseInt(obj.find('.numero-registro').html());
}

function limparForm() {
    $("#btn-novo-lancamento").click(function () {
        $("input[name=form-id]").val('')
        $("input[name=form-data]").val('')
        $("input[name=form-descricao]").val('')
        $("input[name=form-valor]").val('')
    })
}

function acaoBotaoNovo() {
    limparForm()
}

function deletarRegistro(numeroRegistro) {
    lancamentos = getLancamentos()
    $.each(lancamentos, function (index) {
        if (this.codigo == numeroRegistro) {
            lancamentos.splice(index, 1)
            localStorage.setItem('lancamentos', JSON.stringify(lancamentos))
        }
    })
    montarTabelaNaTela()
}

function getLancamentos() {
    lancamentos = JSON.parse(localStorage.getItem('lancamentos'))
    if (lancamentos == null) {
        return lancamentos = []
    }
    return lancamentos
}

function setNovoId() {
    novoID = localStorage.getItem("last_id")
    novoID++
    localStorage.setItem("last_id", novoID)
}

function converteDataParaIngles(data) {
    let dataString
    dataString = data.split("/")
    return new Date(dataString[2], dataString[1] - 1, dataString[0])
}

function converteDataParaPortugues(data) {
    let dataString
    let dia
    dataString = data.split("-")
    dia = dataString[2].split("T")[0]
    return dia + '/' + dataString[1] + '/' + dataString[0]
}

function validaLancamento(lancamento) {
    let errosValidacao = []
    if (lancamento.descricao.isEmpty()) {
        errosValidacao.descricao = 'A descrição não pode estar vazia'
    }
    if (isNaN(lancamento.valor)) {
        errosValidacao.valor = 'O valor Precisa ser numérico'
    }
    if (!(lancamento.data.isValid())) {
        errosValidacao.data = "data Inválida"
    }
    if (Object.keys(errosValidacao).length > 0) {
        return false
    }
    return true
}

function gravarNovoLancamento(lancamento) {
    lancamentos = getLancamentos()
    setNovoId()
    lancamento = {
        data: converteDataParaIngles($('input[name=form-data]').val()),
        codigo: novoID,
        descricao: $('input[name=form-descricao]').val(),
        valor: parseFloat($('input[name=form-valor]').val())
    }
    if (validaLancamento(lancamento)) {
        lancamentos.push(lancamento)
        localStorage.setItem('lancamentos', JSON.stringify(lancamentos))
    }
}

function editarRegistro(numeroRegistro) {
    lancamentos = getLancamentos()
    $.each(lancamentos, function (index) {
        if (this.codigo == numeroRegistro) {
            $("input[name=form-id]").val(this.codigo)
            $("input[name=form-data]").val(converteDataParaPortugues(this.data))
            $("input[name=form-descricao]").val(this.descricao)
            $("input[name=form-valor]").val(this.valor)
        }
    })
}

function gravarEdicaoLancamento() {
    lancamentos = getLancamentos()
    $.each(lancamentos, function (index) {
        if (this.codigo == numeroRegistro) {
            lancamento = {
                data: converteDataParaIngles($('input[name=form-data]').val()),
                codigo: numeroRegistro,
                descricao: $('input[name=form-descricao]').val(),
                valor: parseFloat($('input[name=form-valor]').val())
            }
            lancamentos[index] = lancamento
        }
    })
    if (validaLancamento(lancamento)) {
        localStorage.setItem('lancamentos', JSON.stringify(lancamentos))
    }
}

function montarBotaoAcoes(registro, obj) {
    let acoes = `
    <button onclick="editarRegistro(${registro})" type="button" 
    class="btn btn-warning btn-sm btn-edit-lancamento" 
    data-toggle="modal" data-target="#modal-form-lancamento">
    <i class="fas fa-edit"></i>
    </button>

    <button onclick="deletarRegistro(${registro})" type="button" 
    class="btn btn-danger btn-sm btn-delete-lancamento">
    <i class="fas fa-eraser"></i>
    </button >
    `
    obj.find('.acoes').html(acoes)
}

function montarTabelaNaTela(lancamentos = null) {

    retornoLancamentos = ((lancamentos == null) ? getLancamentos() : lancamentos)

    //limpar a tela extrato
    $("#extrato").html("")
    $.each(retornoLancamentos, function () {
        $("#extrato").append(
            `<tr class='extrato-item'>
               <td>${converteDataParaPortugues(this.data)}</td>
                <td class="numero-registro">${this.codigo}</td>
                <td>${this.descricao}</td>
                <td class="valor">${this.valor}</td>
                <td class="saldo"></td>
                <td class="acoes"></td>
            </tr>`
        )
    })
    main()
}

function main() {
    total = 0
    valor = 0
    $(".extrato-item").each(function () {
        valor = getValor($(this))
        numeroRegistro = getNumRegistro($(this))
        VerificaSeEhNegativo(valor, $(this))
        soma(valor)
        atualizaSaldo(total, $(this))
        montarBotaoAcoes(numeroRegistro, $(this))
    })
}

function enviarForm() {
    $("#btn-enviar-form").click(function () {
        numeroRegistro = $("input[name=form-id]").val()
        if (numeroRegistro == "") {
            gravarNovoLancamento()
        }
        else {
            gravarEdicaoLancamento()
        }
        montarTabelaNaTela()
    })
}

$(document).ready(function () {
    acaoBotaoNovo()
    montarTabelaNaTela()
    enviarForm()
    ordernarArray()
})

function ordernarArray() {
    let tipoOrdenacao
    let tipoCampo
    lancamentos = getLancamentos()
    $(".ordenar-array").click(function () {
        tipoCampo = $(this).attr('data-type')
        tipoOrdenacao = $(this).attr('data-order')
        lancamentos.sort(function (a, b) {
            let campoA = a[tipoCampo]
            let campoB = b[tipoCampo]
            if (tipoCampo == "data") {
                campoA = new Date(a[tipoCampo]).getTime()
                campoB = new Date(b[tipoCampo]).getTime()
            }
            if (tipoOrdenacao == 'asc') {
                return campoB - campoA
            } else if (tipoOrdenacao == "desc") {
                return campoA - campoB
            }
        });

        if (tipoOrdenacao == 'asc') {
            $(this).attr('data-order', "desc")
            $(this.childNodes)
                .removeClass("fa-arrow-alt-circle-down")
                .addClass("fa-arrow-alt-circle-up")
        } else {
            $(this).attr('data-order', "asc")
            $(this.childNodes)
                .removeClass("fa-arrow-alt-circle-up")
                .addClass("fa-arrow-alt-circle-down")
        }
        montarTabelaNaTela(lancamentos)
    })
}
