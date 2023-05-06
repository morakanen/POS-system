
foodArray = ["Fish", "Hot Chocolate", "Other cool things"]

function back(){
    window.location.reload();
    return false;
}

function food(){
    document.getElementById("options").innerHTML = ""
    foodArray.forEach(function (value) {
        console.log(value)
        form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "#");

        formInput = document.createElement("input");
        formInput.setAttribute("type", "submit");
        formInput.setAttribute("name", "input");
        formInput.setAttribute("value", value);

        form.appendChild(formInput);

        document.getElementById("options").appendChild(form);
    });
    button = document.createElement("button");
    button.innerText="Back";
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "back()");


    form.appendChild(button);

}