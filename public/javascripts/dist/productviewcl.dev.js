"use strict";

// JavaScript code
function filterItems() {
  // Get the selected filter option
  var filter = document.getElementById('filter').value; // Create an object with the filter data

  var filterData = {
    filter: filter
  }; // Send an AJAX request to filter the items

  fetch('/filter-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(filterData)
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    // Process the filtered items data
    if (data.error) {
      console.error(data.error);
      return;
    }

    console.log(data.items); // Update the table with the retrieved data

    var tableBody = document.getElementById('tableBody'); // Clear the existing table body content

    tableBody.innerHTML = ''; // Iterate over the filtered items data and update the table

    data.items.forEach(function (item) {
      // Create a new table row
      var row = document.createElement('tr'); // Create table cells and populate them with item data

      var productIdCell = document.createElement('td');
      productIdCell.textContent = item.productId;
      row.appendChild(productIdCell);
      var nameCell = document.createElement('td');
      nameCell.textContent = item.name;
      row.appendChild(nameCell);
      var agecheckCell = document.createElement('td');
      agecheckCell.textContent = item.ageRestricted;
      row.appendChild(agecheckCell);
      var priceCell = document.createElement('td');
      priceCell.textContent = item.price;
      row.appendChild(priceCell);
      var twoForOneCell = document.createElement('td');
      twoForOneCell.textContent = item.twoForOne;
      row.appendChild(twoForOneCell);
      var percentOffCell = document.createElement('td');
      percentOffCell.textContent = item.percentOffCell;
      row.appendChild(percentOffCell); // ... Add code to create and populate other cells
      // Append the row to the table body

      tableBody.appendChild(row);
    });
  })["catch"](function (error) {
    console.error('Error:', error);
  });
}

function editItem(productId) {
  // Show the edit form for the specified item
  var editFormRow = document.getElementById("editFormRow-".concat(productId));
  editFormRow.style.display = 'table-row';
}

function saveItem(productId) {
  // Get the form values
  var name = document.getElementById("name-".concat(productId)).value;
  var price = document.getElementById("price-".concat(productId)).value;
  var ageRestricted = document.getElementById("ageRestricted-".concat(productId)).checked; // Create an object with the updated item data

  var updatedItem = {
    productId: productId,
    name: name,
    price: price,
    ageRestricted: ageRestricted
  }; // Send an AJAX request to update the item in the database

  fetch('/update-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedItem)
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    console.log(data.message); // Hide the edit form after saving

    var editFormRow = document.getElementById("editFormRow-".concat(productId));
    editFormRow.style.display = 'none'; // You can perform additional actions after saving, such as updating the UI or reloading the data
  });
  /*.catch((error) => {
    console.error('Error:', error);
  });*/
}