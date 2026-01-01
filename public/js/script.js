// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


 


  function adjustFilters() {
    const container = document.getElementById("filters");
    const filters = container.children;

    let containerWidth = container.offsetWidth;
    let usedWidth = 0;

    for (let i = 0; i < filters.length; i++) {
      const itemWidth = filters[i].offsetWidth;

      if (usedWidth + itemWidth <= containerWidth) {
        filters[i].style.display = "flex";
        usedWidth += itemWidth;
      } else {
        filters[i].style.display = "none";
      }
    }
  }

  window.addEventListener("resize", adjustFilters);
  window.addEventListener("load", adjustFilters);

