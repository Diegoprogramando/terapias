document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  document.getElementById("terapias-toggle").addEventListener("click", function(event) {
      event.preventDefault(); 
      document.querySelector(".dropdown-menu").classList.toggle("show");
  });
  
  // Cerrar el menú al hacer clic fuera
  document.addEventListener("click", function(event) {
      let dropdown = document.querySelector(".dropdown");
      if (!dropdown.contains(event.target)) {
          document.querySelector(".dropdown-menu").classList.remove("show");
      }
  });

  menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
  });

  const enviarMensajeBtn = document.getElementById('enviar-mensaje');
  if (enviarMensajeBtn) {
    enviarMensajeBtn.addEventListener('click', async (event) => {
      event.preventDefault();

      const nombre = document.getElementById('nombre').value;
      const telefono = document.getElementById('telefono').value;
      const correo = document.getElementById('correo').value;
      const tema = document.getElementById('tema').value;
      const mensaje = document.getElementById('mensaje').value;
      const fecha = document.getElementById('fecha').value;
      const hora = document.getElementById('hora').value;

      if (!nombre || !telefono || !correo || !tema || !mensaje || !fecha || !hora) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos.',
        });
        return;
      }

      const currentDate = new Date().toISOString().split('T')[0];
      if (fecha < currentDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha seleccionada no es válida. Elige una fecha futura.',
        });
        return;
      }

      if (fecha === currentDate) {
        const selectedTime = hora;
        const currentTime = new Date().toTimeString().slice(0, 5);
        if (selectedTime <= currentTime) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La hora seleccionada no es válida. Elige una hora futura.',
          });
          return;
        }
      }

      const response = await fetch('http://localhost:3000/enviar-mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, telefono, correo, tema, mensaje, fecha, hora })
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Mensaje enviado y turno reservado correctamente',
          background: '#d4edda',
          confirmButtonColor: '#28a745'
        });
        // Limpiar los campos del formulario
        document.getElementById('nombre').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('correo').value = '';
        document.getElementById('tema').value = '';
        document.getElementById('mensaje').value = '';
        document.getElementById('fecha').value = '';
        document.getElementById('hora').value = '';
      }
    });
  } else {
    console.error('El elemento con ID "enviar-mensaje" no se encontró en el DOM.');
  }

  // Validar que los campos numéricos solo acepten números
  document.getElementById('telefono').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  document.getElementById('fecha').setAttribute('min', new Date().toISOString().split('T')[0]);
});
