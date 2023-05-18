  //client side javascript for DOM manipulation for the main menu popup form
  function openForm() {
    document.getElementById("myModal").style.display = "block";
    }
    function closeForm() {
    document.getElementById("myModal").style.display = "none";
    }
    document.getElementById("myButton").addEventListener("click", openForm);
    document.getElementsByClassName("close")[0].addEventListener("click", closeForm);

   