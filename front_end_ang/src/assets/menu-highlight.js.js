// angular.module('app.component').controller('mainController', function ($scope) {
//     $scope.activeTab = '';

//     $scope.setActive = function (tab) {
//         $scope.activeTab = tab;
//     };

// });

// Verifica se estamos no navegador antes de acessar o objeto document
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('nav a');

    // Função para remover a classe 'active' de todos os links do menu
    function removeActiveClassFromLinks() {
      links.forEach(function(link) {
        link.classList.remove('active');
      });
    }

    // Adiciona ouvintes de evento aos links do menu
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        // Remove a classe 'active' de todos os links do menu
        removeActiveClassFromLinks();

        // Adiciona a classe 'active' ao link clicado
        this.classList.add('active');
      });

      // Verifica se o link corresponde à rota atual da aplicação
      if (link.getAttribute('routerlink') === location.pathname) {
        link.classList.add('active');
      }
    });

    // Adiciona ouvinte de evento ao logo
    var logoLink = document.querySelector('header a');
    if (logoLink) {
      logoLink.addEventListener('click', function() {
        // Remove a classe 'active' de todos os links do menu
        removeActiveClassFromLinks();
      });
    }

    // Adiciona ouvinte de evento ao botão de logout
    var logoutButton = document.querySelector('.admin-actions button[mat-icon-button][routerLink="/"]');
    if (logoutButton) {
      logoutButton.addEventListener('click', function() {
        // Remove a classe 'active' de todos os links do menu
        removeActiveClassFromLinks();
      });
    }

    // Adiciona ouvinte de evento ao botão de configurações
    var configButton = document.querySelector('.admin-actions button[mat-icon-button][routerLink="/config"]');
    if (configButton) {
      configButton.addEventListener('click', function() {
        // Remove a classe 'active' de todos os links do menu
        removeActiveClassFromLinks();
      });
    }
  });
}
