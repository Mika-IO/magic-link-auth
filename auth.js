(function() {
    // Checa se o usuário já está logado
    const token = localStorage.getItem('authToken');
    const logoutButton = document.getElementById('logoutButton');
  
    // Função para mostrar o modal de login
    function showLoginModal() {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <form id="email-form">
              <h2 class="text-xl text-center font-bold mb-4">Enter your best email to login</h2>
              <div class="mb-4">
                <input type="email" placeholder="mikaio@mikaio.dev" id="email" name="email" class="mt-1 p-2 border border-gray-300 rounded-md w-full" required>
              </div>
            <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark">Send Magic Link</button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
  
      // Adiciona listener para enviar o email
      document.getElementById('email-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        const currentPath = window.location.pathname;  // Obtém o caminho atual
        const hostname = window.location.origin;  // Obtém o hostname completo (ex: https://mikaio.dev)
        const redirectUrl = `${hostname}${currentPath}`;  // Combina o hostname com o caminho

        const response = await fetch('https://magic-link-auth-api-production.up.railway.app/send-magic-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email,
            redirect_url: redirectUrl  // Envia a URL dinamicamente
          })
        });

  
        if (response.ok) {
          // Substitui o formulário pela mensagem
          const modalContent = document.getElementById('email-form').parentElement;
          modalContent.innerHTML = `
            <div class="text-center">
              <p class="text-lg font-medium text-gray-700">Check your email</p>
              <p class="text-gray-500 mt-2">Confirm your email, click on the link we sent to your email, you will be logged in automatically.</p>
            </div>
          `;
      }
      
      });
    }
  
    // Exibe o modal se o usuário não estiver logado
    if (!token) {
      showLoginModal();
    }
  
    // Função de logout
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      alert('You are now logged out.');
  
      // Limpa os parâmetros da URL sem recarregar a página
      const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, url);
  
      // Recarrega a página
      location.reload();
  });
  
  
    // Função para armazenar o token após o login bem-sucedido
    function storeToken(token) {
      localStorage.setItem('authToken', token);
    }
  
    // Lógica para capturar o token de magic link
    const urlParams = new URLSearchParams(window.location.search);
    const magicLinkToken = urlParams.get('magic-link');
    if (magicLinkToken) {
      storeToken(magicLinkToken);
      // Recarregar a página sem os parâmetros da URL
      window.location.href = window.location.origin + window.location.pathname;
    }
})();
