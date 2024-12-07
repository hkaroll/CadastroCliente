function montarNomeCompleto(nome, sobrenome) {
    return `${nome} ${sobrenome}`;
}

function obterDadosFormulario() {
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const nomeCompleto = montarNomeCompleto(nome, sobrenome);
    const dataNascimento = document.getElementById('dataNascimento').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;

    return { nomeCompleto, dataNascimento, email, endereco };
}

function adicionarLinhaNaTabela(dados) {
    const tabela = document.querySelector('#tabelaClientes tbody');
    const novaLinha = tabela.insertRow();

    novaLinha.insertCell(0).textContent = dados.nomeCompleto;
    novaLinha.insertCell(1).textContent = dados.dataNascimento;
    novaLinha.insertCell(2).textContent = dados.email;
    novaLinha.insertCell(3).textContent = dados.endereco;
}

document.getElementById('botaoCadastrar').addEventListener('click', function() {
    const formulario = document.getElementById('formularioCadastro');
    
    if (formulario.checkValidity()) {
        const dados = obterDadosFormulario();
        adicionarLinhaNaTabela(dados);
        formulario.reset();
        formulario.classList.remove('was-validated');
    } else {
        formulario.classList.add('was-validated');
    }
});