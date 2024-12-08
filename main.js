class GerenciadorClientes {
    constructor() {
        this.clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        this.renderizarTabela();
    }

    adicionarCliente(cliente) {
        cliente.id = Date.now().toString();
        this.clientes.push(cliente);
        this.salvarClientes();
        this.renderizarTabela();
    }

    atualizarCliente(id, dadosAtualizados) {
        const indice = this.clientes.findIndex(c => c.id === id);
        if (indice !== -1) {
            this.clientes[indice] = { ...dadosAtualizados, id };
            this.salvarClientes();
            this.renderizarTabela();
        }
    }

    excluirCliente(id) {
        this.clientes = this.clientes.filter(c => c.id !== id);
        this.salvarClientes();
        this.renderizarTabela();
    }

    buscarClientes(termo) {
        termo = termo.toLowerCase();
        return this.clientes.filter(cliente => 
            cliente.nomeCompleto.toLowerCase().includes(termo) ||
            cliente.email.toLowerCase().includes(termo) ||
            cliente.endereco.toLowerCase().includes(termo)
        );
    }

    salvarClientes() {
        localStorage.setItem('clientes', JSON.stringify(this.clientes));
    }

    renderizarTabela(clientesParaExibir = null) {
        const corpoTabela = document.getElementById('corpoTabelaClientes');
        corpoTabela.innerHTML = '';

        const clientes = clientesParaExibir || this.clientes;

        clientes.forEach(cliente => {
            const linha = corpoTabela.insertRow();
            linha.innerHTML = `
                <td>${cliente.nomeCompleto}</td>
                <td>${cliente.dataNascimento}</td>
                <td>${cliente.email}</td>
                <td>${cliente.endereco}</td>
                <td>
                    <button class="btn btn-warning btn-sm editar-cliente" data-id="${cliente.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm excluir-cliente" data-id="${cliente.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        });

        this.configurarEventosAcoes();
    }

    configurarEventosAcoes() {
        document.querySelectorAll('.editar-cliente').forEach(botao => {
            botao.addEventListener('click', () => {
                const id = botao.getAttribute('data-id');
                this.preencherFormularioEdicao(id);
            });
        });

        document.querySelectorAll('.excluir-cliente').forEach(botao => {
            botao.addEventListener('click', () => {
                const id = botao.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este cliente?')) {
                    this.excluirCliente(id);
                }
            });
        });
    }

    preencherFormularioEdicao(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            document.getElementById('clienteId').value = cliente.id;
            document.getElementById('nome').value = cliente.nomeCompleto.split(' ')[0];
            document.getElementById('sobrenome').value = cliente.nomeCompleto.split(' ').slice(1).join(' ');
            document.getElementById('dataNascimento').value = cliente.dataNascimento;
            document.getElementById('email').value = cliente.email;
            document.getElementById('endereco').value = cliente.endereco;

            document.getElementById('botaoCadastrar').textContent = 'Atualizar Cliente';
            document.getElementById('tituloFormulario').textContent = 'Editar Cliente';
            document.getElementById('botaoCancelar').style.display = 'inline-block';
        }
    }
}

const gerenciadorClientes = new GerenciadorClientes();

function montarNomeCompleto(nome, sobrenome) {
    return `${nome} ${sobrenome}`;
}

function obterDadosFormulario() {
    const id = document.getElementById('clienteId').value;
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const nomeCompleto = montarNomeCompleto(nome, sobrenome);
    const dataNascimento = document.getElementById('dataNascimento').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;

    return { id, nomeCompleto, dataNascimento, email, endereco };
}

document.getElementById('botaoCadastrar').addEventListener('click', function() {
    const formulario = document.getElementById('formularioCadastro');
    
    if (formulario.checkValidity()) {
        const dados = obterDadosFormulario();
        
        if (dados.id) {
            gerenciadorClientes.atualizarCliente(dados.id, dados);
        } else {
            gerenciadorClientes.adicionarCliente(dados);
        }

        formulario.reset();
        formulario.classList.remove('was-validated');

        document.getElementById('botaoCadastrar').textContent = 'Salvar Cliente';
        document.getElementById('tituloFormulario').textContent = 'Adicionar Novo Cliente';
        document.getElementById('botaoCancelar').style.display = 'none';
        document.getElementById('clienteId').value = '';
    } else {
        formulario.classList.add('was-validated');
    }
});

document.getElementById('botaoCancelar').addEventListener('click', function() {
    document.getElementById('formularioCadastro').reset();
    document.getElementById('clienteId').value = '';

    document.getElementById('botaoCadastrar').textContent = 'Salvar Cliente';
    document.getElementById('tituloFormulario').textContent = 'Adicionar Novo Cliente';
    this.style.display = 'none';
});

document.getElementById('filtroClientes').addEventListener('input', function() {
    const termo = this.value;
    const clientesFiltrados = gerenciadorClientes.buscarClientes(termo);
    gerenciadorClientes.renderizarTabela(clientesFiltrados);
});

document.getElementById('limparFiltro').addEventListener('click', function() {
    document.getElementById('filtroClientes').value = '';
    gerenciadorClientes.renderizarTabela();
});