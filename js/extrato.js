let total = 0
let valor = 0
let numeroRegistro
let lancamentos = []
let lancamento
let retornoLancamentos
let id = 0


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

function setId() {
    id = localStorage.getItem("last_id")
    id++
    localStorage.setItem("last_id", id)
}

function gravarLancamento(lancamento) {
    lancamentos = getLancamentos()
    lancamentos.push(lancamento)
    localStorage.setItem('lancamentos', JSON.stringify(lancamentos))
}

function editarRegistro(numeroRegistro) {
    lancamentos = getLancamentos()
    $.each(lancamentos, function (index) {
        if (this.codigo == numeroRegistro) {
            $("input[name=form-id]").val(this.codigo)
            $("input[name=form-data]").val(this.data)
            $("input[name=form-descricao]").val(this.descricao)
            $("input[name=form-valor]").val(this.valor)
        }
    })
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

function montarTabelaNaTela() {
    retornoLancamentos = getLancamentos()
    //limpar a tela extrato
    $("#extrato").html("")
    $.each(retornoLancamentos, function () {
        $("#extrato").append(
            `<tr class='extrato-item'>
               <td>${this.data}</td>
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
            setId()
            numeroRegistro = localStorage.getItem("last_id")
            lancamento = {
                data: $('input[name=form-data]').val(),
                codigo: id,
                descricao: $('input[name=form-descricao]').val(),
                valor: parseFloat($('input[name=form-valor]').val())
            }
            gravarLancamento(lancamento)
        }

        else {
            alert('aqui')
            lancamentos = getLancamentos()
            $.each(lancamentos, function (index) {
                if (this.codigo == numeroRegistro) {
                    lancamento = {
                        data: $('input[name=form-data]').val(),
                        codigo: numeroRegistro,
                        descricao: $('input[name=form-descricao]').val(),
                        valor: parseFloat($('input[name=form-valor]').val())
                    }
                    lancamentos[index] = lancamento
                }
            })
            localStorage.setItem('lancamentos', JSON.stringify(lancamentos))
        }
        montarTabelaNaTela()
    })
}

$(document).ready(function () {
    montarTabelaNaTela();
    enviarForm();
})