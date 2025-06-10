/* ***************************************************************************** */
/* ******************************* TODAS TELAS ********************************* */
/* ***************************************************************************** */

//Hambuguer - Telas Pequenas
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("menu-active");
});

// Funcionalidade de dropdown no celular
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (dropdownToggle) {
  dropdownToggle.addEventListener('click', (event) => {
    event.preventDefault();
    dropdownMenu.classList.toggle('show');
  });
} else {
  console.error('Elemento #dropdownToggle não encontrado no DOM.');
}

// Fecha o menu se o usuário clicar fora
window.addEventListener('click', (event) => {
const dropdown = document.querySelector('.dropdown');
  if (!dropdown.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }
}); 

/* **************************************************************************** */
/* ********************************** INDEX *********************************** */
/* **************************************************************************** */

//Função Logar - Tela de Login
function logar() {
  const email = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  // Verificação do usuário
  const pessoa = email === "carlosadm@senai" && senha === "12345678900";

  if (pessoa) {
      window.location.href = "homeP.html";
  } else {
      document.getElementById("mensagemErro").innerText = "Usuário não encontrado. Email ou Senha incorretos!";
      document.getElementById("imgErro").src = "imagens/logo-removebg-preview.png";  // Defina o caminho da imagem de erro aqui
      document.getElementById("modal").style.display = "flex";

      document.getElementById("usuario").value = "";
      document.getElementById("senha").value = "";
  }
}

// Fechar o modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
      fecharModal();
  }
}

/* **************************************************************************** */
/* ************************ TELA CADASTRO PATRIMÔNIO ************************** */
/* **************************************************************************** */

//POST - Tela Cadastro Patrimônio
function cadastroPatrimonio(event) {
  // Prevenir o comportamento padrão (recarregar a página)
  event.preventDefault();

  var descricao = document.getElementById("descricao").value;
  var local = document.getElementById("local").value;
  var status = document.getElementById("status").value;
  var valor = document.getElementById("valor").value;

  // Envia a imagem e captura o nome
  var imgInput = document.getElementById("img");
  var formData = new FormData();
  formData.append("imagem", imgInput.files[0]);

  fetch("http://localhost:3001/upload", {
    method: "POST",
    body: formData,
  })
    .then((resposta) => resposta.json())
    .then((data) => {
      console.log("Imagem enviada:", data);
      // Agora enviamos os dados do patrimônio, incluindo o nome da imagem
      return fetch("http://localhost:3000/patrimonio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao,
          local,
          status,
          valor,
          imagem: data.filename, // Inclui o nome da imagem
        }),
      });
    })
    .then((resposta) => resposta.json())
    .then((data) => {
      console.log("Dados do patrimônio enviados:", data);
      
      // Exibe o alerta SweetAlert2
      Swal.fire({
        title: 'Sucesso!',
        text: `Patrimônio cadastrado com sucesso! ID: ${data.patrimonio.id}`,
        icon: 'success',
        confirmButtonText: 'Ok',
        allowOutsideClick: false, // Impede fechar ao clicar fora
        allowEscapeKey: false,   // Impede fechar ao pressionar "Esc"
      }).then((result) => {
        if (result.isConfirmed) {
          // Recarrega a página após o usuário clicar no botão "Ok"
          location.reload();
        }
      });
    })
    .catch((error) => {
      console.error("Erro ao enviar dados do patrimônio:", error);
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao cadastrar o patrimônio. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    });
}

/* **************************************************************************** */
/* *************************** TELA RELATÓRIO TOTAL *************************** */
/* **************************************************************************** */

//Relatório Patrimônio - Tela Relatório Total de Patrimônio /* GET */
function tabelaPatrimonios() {
  fetch(`http://localhost:3000/patrimonio`)
  .then((response) => response.json())
  .then((data) => {
    const tabela = document.getElementById("tabelaCorpo");

    data.forEach((objeto) => {
      const linha = `<tr>
        <td>${objeto.id}</td>
        <td>${objeto.descricao}</td>
        <td>${objeto.local}</td>
        <td>${objeto.status}</td>
        <td>${objeto.valor}</td>
        <td><button onclick="btnVisuImagem(event, ${objeto.id})"><img src="imagens/visualizarImagem.png" alt="" class="acaoTabela"></button></td>
        <td><button onclick="btnAtualizar(event, ${objeto.id})"><img src="imagens/editar.png" alt="" class="acaoTabela"></button></td>
        <td><button onclick="btnDeletar(event, ${objeto.id})"><img src="imagens/lixo.png" alt="" class="acaoTabela"></button></td>
      </tr>`;
    tabela.innerHTML += linha;
    });
  })
  .catch((error) => console.error("Erro ao obter dados:", error));
}

//Botão Função para Visualizar Imagem - Tela Relatório Total de Patrimônio /* GET */
function btnVisuImagem(event, id) {
  event.preventDefault();

  const modalimg = document.getElementById("modalimg");
  modalimg.style.display = "block";

  fetch(`http://localhost:3000/patrimonio/${id}`)
  .then((response) => response.json())
  .then((patrimonio) => {
    const modalImg = document.getElementById("modalImg");
    modalImg.src = `http://localhost:3000/imagens/${patrimonio.imagem}`;
    document.getElementById("modalimg").style.display = "block";
  })
  .catch((error) => {
    console.error("Erro ao obter patrimônio:", error);
  });
}

//Função para fechar a visualização da imagem
function fecharModal2() {
  const modalimg = document.getElementById("modalimg");
  modalimg.style.display = "none";
}

//###############################

//Botão Função para Atualizar os dados - Tela Relatório Total de Patrimônio /* GET */
function btnAtualizar(event, id) {
  event.preventDefault(); // Previne o envio padrão do formulário

  fetch(`http://localhost:3000/patrimonio/${id}`)
  .then((response) => response.json())
  .then((data) => {
    // Preenche os campos do modal com os dados do item
    document.getElementById("descricaoModal").value = data.descricao;
    document.getElementById("localModal").value = data.local;
    document.getElementById("statusModal").value = data.status;
    document.getElementById("valorModal").value = data.valor;
  });

  //Exibe o modal
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  //Lida com o envio do formulário
  document.getElementById("formAtualizacao").onsubmit = function (event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    salvarAtualizacaoPatrimonio(id);
  };
}

function fecharModal() {
  const modal = document.getElementById("modal");
  const modal2 = document.getElementById("myModal");
  modal.style.display = "none";
  modal2.style.display = "none";
}

//Função para Salvar os dados atualizados - Tela Relatório de Patrimônio /* UPDATE */
function salvarAtualizacaoPatrimonio(id) {
  const descricaoAtt = document.getElementById("descricaoModal").value;
  const localAtt = document.getElementById("localModal").value;
  const statusAtt = document.getElementById("statusModal").value;
  const valorAtt = document.getElementById("valorModal").value;

  fetch(`http://localhost:3000/patrimonio/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao: descricaoAtt,
      local: localAtt,
      status: statusAtt,
      valor: valorAtt,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar patrimônio");
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire("Sucesso!", data.message, "success"); // Exibe uma mensagem de sucesso
      fecharModal(); // Fecha o modal após salvar
      getTeste(); // Atualiza a lista de patrimônios
    })
    .catch((error) => {
      Swal.fire("Erro!", error.message, "error"); // Exibe mensagem de erro
    });
}

//Função para Deletar Patrimônio /* DELETE */
// Função para Deletar Patrimônio
function btnDeletar(event, id) {
  event.preventDefault();

  // Exibir a confirmação antes de deletar
  Swal.fire({
    title: "Você tem certeza?",
    text: "Você não conseguirá reverter isso caso delete!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, delete isso!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Se o usuário confirmar, faz a requisição DELETE
      fetch(`http://localhost:3000/patrimonio/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Se a resposta for ok, mostra o alerta de sucesso
            Swal.fire({
              title: "Deletado!",
              text: "O patrimônio foi deletado com sucesso.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              // Atualiza a página após o alerta
              location.reload();
            });
          } else {
            // Trata os erros retornados pelo servidor
            response.json().then((errorData) => {
              const errorMessage = errorData?.message || "Erro desconhecido ao deletar.";
              console.error("Erro ao deletar o item:", errorData);
              Swal.fire("Erro", errorMessage, "error");
            }).catch(() => {
              Swal.fire("Erro", "Erro ao processar a resposta do servidor.", "error");
            });
          }
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
          Swal.fire("Erro", "Houve um erro ao fazer a requisição. Tente novamente mais tarde.", "error");
        });
    } else {
      // Ação se o usuário cancelar (opcional)
      Swal.fire({
        title: "Cancelado!",
        text: "A exclusão foi cancelada.",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
}

/* **************************************************************************** */
/* ************************ TELA CADASTRO PATRIMÔNIO ************************** */
/* **************************************************************************** */

//Relatório Patrimônio - Tela Relatório Total de Patrimônio /* GET */
function getPDF() {
  fetch(`http://localhost:3000/patrimonio`)
  .then((response) => response.json())
  .then((data) => {
    const tabela = document.getElementById("tabelaCorpo");

    data.forEach((objeto) => {
      const linha = `<tr>
        <td>${objeto.id}</td>
        <td>${objeto.descricao}</td>
        <td>${objeto.local}</td>
        <td>${objeto.status}</td>
        <td>${objeto.valor}</td>
      </tr>`;
    tabela.innerHTML += linha;
    });
  })
  .catch((error) => console.error("Erro ao obter dados:", error));
}

/* **************************************************************************** */
/* ************************ TELA BUSCA POR DESCRIÇÃO ************************** */
/* **************************************************************************** */

function buscarPorDescricao() {
  const descricao = document.getElementById("descricao_digitada").value;

  if (descricao === "") {
      alert("Por favor, digite uma descrição.");
      return;
  }

  fetch(`http://localhost:3000/patrimonio/buscar-por-descricao?descricao=${encodeURIComponent(descricao)}`, {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Nenhum patrimônio encontrado.");
          }
          return response.json();
      })
      .then((data) => {
          console.log(data);
          let resultadoHTML = "";

          data.forEach((patrimonio) => {
            resultadoHTML += `<tr>
              <td>${patrimonio.id}</td>
              <td>${patrimonio.descricao}</td>
              <td>${patrimonio.local}</td>
              <td>${patrimonio.status}</td>
              <td class="resultadoValores">${patrimonio.valor}</td>
            </tr>`;
          });

          document.getElementById("resultado").innerHTML = resultadoHTML;
      })
      .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          document.getElementById("resultado").innerHTML =
              "<tr><td colspan='4'>Nenhum patrimônio encontrado para a descrição especificada.</td></tr>";
      });
}

/* **************************************************************************** */
/* *************************** TELA BUSCA POR LOCAL *************************** */
/* **************************************************************************** */

function buscarPorLocal() {
  const local = document.getElementById("local_digitado").value.trim();

  if (local === "") {
      alert("Por favor, digite um local.");
      return;
  }

  fetch(`http://localhost:3000/patrimonio/local?local=${encodeURIComponent(local)}`, {
      method: "GET",
  })
      .then(response => {
          if (!response.ok) {
              return response.json().then(error => { throw new Error(error.message); });
          }
          return response.json();
      })
      .then(data => {
          let resultadoHTML = "";
          data.forEach(patrimonio => {
              resultadoHTML += `<tr>
                  <td>${patrimonio.id}</td>
                  <td>${patrimonio.descricao}</td>
                  <td>${patrimonio.local}</td>
                  <td>${patrimonio.status}</td>
                  <td>${patrimonio.valor}</td>
              </tr>`;
          });
          document.getElementById("resultado").innerHTML = resultadoHTML;
      })
      .catch(error => {
          console.error("Erro ao buscar dados:", error);
          document.getElementById("resultado").innerHTML =
              `<tr><td colspan='5'>${error.message}</td></tr>`;
      });
}        

/* **************************************************************************** */
/* **************************** TELA BUSCA POR NI ***************************** */
/* **************************************************************************** */

//GET - Tela Busca por ID / NI
function buscarId() {
  const id = document.getElementById("id_digitado").value;

  if (id === "") {
      alert("Por favor, digite um ID");
      return; // Interrompe a execução da função se o id estiver vazio
  }

  fetch(`http://localhost:3000/patrimonio/${id}`, {
      method: "GET",
  })
      .then((response) => {
          if (!response.ok) {
              return response.json().then((error) => { throw new Error(error.message); });
          }
          return response.json();
      })
      .then((data) => {
          console.log(data);

          // Limpar o resultado atual
          let resultadoHTML = `<tr>
              <td>${data.descricao}</td>
              <td>${data.local}</td>
              <td>${data.status}</td>
              <td>${data.valor}</td>      
          </tr>`;

          document.getElementById("resultado").innerHTML = resultadoHTML;
      })
      .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          document.getElementById("resultado").innerHTML =
              "<tr><td colspan='4'>Nenhum patrimônio encontrado com esse ID.</td></tr>";
      });
}

/* ************************************************************************* */
/* *****************************CONTROLE CAMISETAS************************** */
/* ************************************************************************* */

/*CPF das camisetas*/
function formatarCPF(cpfInput) {
  let cpf = cpfInput.value.replace(/\D/g, "");
  if (cpf.length > 3) {
    cpf = cpf.slice(0, 3) + "." + cpf.slice(3);
  }
  if (cpf.length > 7) {
    cpf = cpf.slice(0, 7) + "." + cpf.slice(7);
  }
  if (cpf.length > 11) {
    cpf = cpf.slice(0, 11) + "-" + cpf.slice(11);
  }
  cpfInput.value = cpf.slice(0, 14);
}

/* POST */
// Função para listar alunos cadastrados
async function cadastroAluno() {
  var cpf = document.getElementById("cpf").value;
  var nome = document.getElementById("nome").value;
  var tamanho = document.getElementById("tamanho").value; // Tamanho escolhido (P, M, G, GG)
  var pagamento = document.getElementById("pagamento").checked;

  // Verificar se o CPF tem 14 caracteres
  if (cpf.length !== 14) {
      alert("CPF inválido. Certifique-se de que está no formato correto (XXX.XXX.XXX-XX).");
      return; // Interrompe a função caso o CPF seja inválido
  }

  pagamento = pagamento ? "Pago" : "Pendente";

  const novoAluno = {
      cpf: cpf,
      nome: nome,
      tamanho: tamanho,
      pagamento: pagamento,
  };

  try {
      // Etapa 1: Obter o estoque atual
      const estoqueResponse = await fetch("http://localhost:3002/estoque", {
          method: "GET",
      });

      if (!estoqueResponse.ok) {
          throw new Error("Erro ao obter o estoque.");
      }

      const estoque = await estoqueResponse.json();

      // Etapa 2: Verificar e atualizar o estoque
      if (!estoque[0][tamanho]) {
          alert("Tamanho de camiseta inválido.");
          return;
      }

      if (estoque[0][tamanho] <= 0) {
          alert(`Estoque insuficiente para camisetas do tamanho ${tamanho}.`);
          return;
      }

      // Subtrair 1 do tamanho escolhido
      estoque[0][tamanho] -= 1;

      // Etapa 3: Atualizar o estoque no servidor
      const atualizarEstoqueResponse = await fetch("http://localhost:3002/estoque", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(estoque),
      });

      if (!atualizarEstoqueResponse.ok) {
          throw new Error("Erro ao atualizar o estoque.");
      }

      // Etapa 4: Enviar os dados do aluno
      const alunoResponse = await fetch("http://localhost:3002/alunos", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(novoAluno),
      });

      if (!alunoResponse.ok) {
          throw new Error("Erro ao cadastrar aluno.");
      }

      const data = await alunoResponse.json();
      alert("Aluno cadastrado com sucesso!");
  } catch (error) {
      console.error(error);
      alert("Houve um erro: " + error.message);
  }
}

/* GET */
//Função para puxar os dados cadastrados
function listarAlunos() {
  fetch(`http://localhost:3002/alunos`)
    .then((response) => response.json())
    .then((data) => {
      const tabela = document.getElementById("listaAlunos");

      data.forEach((camisetas) => {
        const linha = `<tr>
        <td>${camisetas.cpf}</td>
        <td>${camisetas.nome}</td>
        <td>${camisetas.tamanho}</td>
        <td>${camisetas.pagamento}</td>
        <td><a><img onclick="btnAtualizarAluno(event, ${camisetas.id})" src="imagens/editar.png" alt="" class="acaoTabela"></a></td>
        <td><a><img onclick="btnDeletarAluno(event, ${camisetas.id})" src="imagens/lixo.png" alt="" class="acaoTabela"></a></td>
      </tr>`;
        tabela.innerHTML += linha;
      });
    })
    .catch((error) => console.error("Erro ao obter dados:", error)); //Tratamento de erro
}

/* GET - Especifico Estoque */
// Função para exibir o estoque atualizado
function exibirEstoque() {
  fetch(`http://localhost:3002/estoque`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((estoque) => {

        document.getElementById("estoquePP").innerHTML= estoque.PP
        document.getElementById("estoqueP").innerHTML= estoque.P
        document.getElementById("estoqueM").innerHTML= estoque.M
        document.getElementById("estoqueG").innerHTML= estoque.G
        document.getElementById("estoqueGG").innerHTML= estoque.GG

        console.log(estoque)
      })
  })
  .catch((error) => console.error("Erro ao obter dados:", error)); //Tratamento de erro
}

/* PUT */
function btnAtualizarAluno(event, id) {
  event.preventDefault(); // Previne o envio padrão do formulário

  fetch(`http://localhost:3002/alunos/${id}`)
    .then((response) => response.json())
    .then((data) => {
      // Preenche os campos do modal com os dados do item
      document.getElementById("descricaoModal").value = data.descricao;
      document.getElementById("localModal").value = data.local;
      document.getElementById("statusModal").value = data.status;
      document.getElementById("valorModal").value = data.valor;
    });

  // Exibe o modal
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  // Lida com o envio do formulário
  document.getElementById("formAtualizacao").onsubmit = function (event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    salvarAtualizacao(id);
  };
}

function salvarAtualizacao(id) {
  const descricaoAtt = document.getElementById("descricaoModal").value;
  const localAtt = document.getElementById("localModal").value;
  const statusAtt = document.getElementById("statusModal").value;
  const valorAtt = document.getElementById("valorModal").value;

  fetch(`http://localhost:3002/alunos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao: descricaoAtt,
      local: localAtt,
      status: statusAtt,
      valor: valorAtt,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar patrimônio");
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire("Sucesso!", data.message, "success"); // Exibe uma mensagem de sucesso
      fecharModal(); // Fecha o modal após salvar
      getTeste(); // Atualiza a lista de patrimônios
    })
    .catch((error) => {
      Swal.fire("Erro!", error.message, "error"); // Exibe mensagem de erro
    });
}

/* DELETE */
//Função para deletar um cadastro Camiseta/Aluno
function btnDeletarAluno(event, id) {
  event.preventDefault();

  // Exibir a confirmação antes de deletar
  Swal.fire({
    title: "Você tem certeza?",
    text: "Você não conseguirá reverter isso caso delete!!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, delete isso!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Se o usuário confirmar, faz a requisição DELETE
      fetch(`http://localhost:3002/alunos/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Se a resposta for ok, mostra o alerta de sucesso
            Swal.fire({
              title: "Deletado!",
              text: "Foi deletado com sucesso",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              // Atualiza a página após o alerta
              location.reload();
            });
          } else {
            // Mostra a resposta do servidor para debugar
            response.json().then((errorData) => {
              console.error("Erro ao deletar o item:", errorData);
              Swal.fire("Erro", errorData.message, "error");
            });
          }
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);
          Swal.fire("Erro", "Houve um erro ao fazer a requisição", "error");
        });
    } else {
      // Ação se o usuário cancelar (opcional)
      Swal.fire("Cancelado", "Ação cancelada com sucesso", "info");
    }
  });
}

// Função para adicionar camisetas ao estoque
async function adicionarEstoque() {
  var tamanho = document.getElementById("tamanho2").value; // Tamanho selecionado (P, M, G, GG)
  var quantidade = parseInt(document.getElementById("qntdCamiseta").value); // Quantidade a ser adicionada

  if (isNaN(quantidade) || quantidade <= 0) {
      alert("Digite uma quantidade válida.");
      return;
  }

  try {
      // Etapa 1: Obter o estoque atual
      const estoqueResponse = await fetch("http://localhost:3002/estoque", {
          method: "GET",
      });

      if (!estoqueResponse.ok) {
          throw new Error("Erro ao obter o estoque.");
      }

      const estoque = await estoqueResponse.json();

      // Verificar se o tamanho da camiseta é válido
      if (!estoque[0][tamanho]) {
          alert("Tamanho de camiseta inválido.");
          return;
      }

      // Etapa 2: Adicionar a quantidade ao estoque
      estoque[0][tamanho] += quantidade;

      // Etapa 3: Atualizar o estoque no servidor
      const atualizarEstoqueResponse = await fetch("http://localhost:3002/estoque", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(estoque),
      });

      if (!atualizarEstoqueResponse.ok) {
          throw new Error("Erro ao atualizar o estoque.");
      }

      alert(`Quantidade adicionada com sucesso! O estoque do tamanho ${tamanho} foi atualizado.`);
  } catch (error) {
      console.error(error);
      alert("Houve um erro: " + error.message);
  }
}