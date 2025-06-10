document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  
    // Função para cadastro de patrimônio
    window.cadastroPatrimonio = function(event) {
      event.preventDefault();
      
      // Obter valores dos campos
      const descricao = document.getElementById('descricao').value;
      const local = document.getElementById('local').value;
      const status = document.getElementById('status').value;
      const valor = document.getElementById('valor').value;
      const img = document.getElementById('img').files[0];
      
      // Validar campos
      if (!descricao || !local || !status || !valor) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Por favor, preencha todos os campos!',
          confirmButtonColor: '#2c3e50'
        });
        return;
      }
      
      // Simular envio (substituir por chamada real à API)
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Patrimônio cadastrado com sucesso!',
          confirmButtonColor: '#2c3e50'
        }).then(() => {
          // Limpar formulário após sucesso
          event.target.reset();
          document.getElementById('descricao').focus();
        });
      }, 1000);
    };
  
    // Atualizar ano no footer
    const yearSpan = document.querySelector('.rodape div');
    if (yearSpan) {
      const currentYear = new Date().getFullYear();
      yearSpan.textContent = yearSpan.textContent.replace('2024', currentYear);
    }
  
    // Adicionar máscara para o campo de valor
    const valorInput = document.getElementById('valor');
    if (valorInput) {
      valorInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2) + '';
        value = value.replace('.', ',');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        e.target.value = 'R$ ' + value;
      });
    }
  });