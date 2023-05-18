// JavaScript code
function filterItems() {
  // Get the selected filter option
const filter = document.getElementById('filter').value;

  // Create an object with the filter data
  const filterData = {
    filter
  };

  // Send an AJAX request to filter the items
  fetch('/filter-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filterData),
  })
  
    .then((res) => res.json())
    .then((data) => {
      // Process the filtered items data
      if (data.error) {
        console.error(data.error);
        return;
      }
      console.log(data.items);
      // Update the table with the retrieved data
      const tableBody = document.getElementById('tableBody');

      // Clear the existing table body content
      tableBody.innerHTML = '';

      // Iterate over the filtered items data and update the table
      data.items.forEach((item) => {
        // Create a new table row
        const row = document.createElement('tr');

        // Create table cells and populate them with item data
        const productIdCell = document.createElement('td');
        productIdCell.textContent = item.productId;
        row.appendChild(productIdCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const stockCell = document.createElement('td');
        stockCell.textContent = item.stock;
        row.appendChild(stockCell);

        const agecheckCell = document.createElement('td');
        agecheckCell.textContent = item.ageRestricted;
        row.appendChild(agecheckCell);
        
        const priceCell= document.createElement('td');
        priceCell.textContent = item.price;
        row.appendChild(priceCell);

        const twoForOneCell = document.createElement('td');
        twoForOneCell.textContent = item.twoForOne;
        row.appendChild(twoForOneCell);

        const percentOffCell = document.createElement('td');
        percentOffCell.textContent = item.percentOffCell;
        row.appendChild(percentOffCell);


        // ... Add code to create and populate other cells

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}  
 

function editItem(productId) {
  // Show the edit form for the specified item
  const editFormRow = document.getElementById(`editFormRow-${productId}`);
  editFormRow.style.display = 'table-row';
}

function saveItem(productId) {
  // Get the form values
  const name = document.getElementById(`name-${productId}`).value;
  const stock = document.getElementById(`stock-${productId}`).value;
  const price = document.getElementById(`price-${productId}`).value;
  const ageRestricted = document.getElementById(`ageRestricted-${productId}`).checked;

  // Create an object with the updated item data
  const updatedItem = {
    productId,
    name,
    stock,
    price,
    ageRestricted,
  };
  

  // Send an AJAX request to update the item in the database
  fetch('/update-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedItem),
  })
    
    .then((res) => res.json())
    .then((data) => {
      console.log(data.message);
      // Hide the edit form after saving
      const editFormRow = document.getElementById(`editFormRow-${productId}`);
      editFormRow.style.display = 'none';
      // You can perform additional actions after saving, such as updating the UI or reloading the data
    })
    /*.catch((error) => {
      console.error('Error:', error);
    });*/


}


