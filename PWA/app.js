if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}

// Función para renderizar los datos de la API
function renderData(data) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('Elemento con id "content" no encontrado');
        return;
    }

    contentDiv.innerHTML = '';  // Limpiar el contenido anterior

    data.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');

        // Crear un contenido para mostrar la información del usuario
        userCard.innerHTML = `
            <img src="${user.photo}" alt="${user.name}" class="user-photo">
            <h3>${user.name}     </h3><br>
            <p><strong>Correo:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
            <p><strong>Teléfono:</strong> ${user.phone}</p>
            <p><strong>Dirección:</strong> ${user.address}, ${user.state}, ${user.country}, ${user.zip}</p>
        `;

        contentDiv.appendChild(userCard);
    });
}


function showLoading() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<p>Cargando datos...</p>';
}

function hideLoading() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';
}

// Mostrar el mensaje de carga antes de hacer la petición
showLoading();

fetch('https://fake-json-api.mock.beeceptor.com/users')
    .then(response => response.json())
    .then(data => {
        console.log('Datos recibidos:', data);  // Verifica los datos aquí
        hideLoading();  // Ocultar el mensaje de carga
        renderData(data);  // Renderizar los datos
    })
    .catch(error => {
        console.error('Error al consultar la API:', error);
        hideLoading();
        document.getElementById('content').innerHTML = '<p>Error al cargar los datos.</p>';
    });
