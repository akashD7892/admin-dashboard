
let selectedRows = [];
let currentPage = 1;
const rowsPerPage = 10;

let users = []; // The in-memory data

//accessing data from api
async function fetchData() {
    try {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        const data = await response.json();
        users = data; // Update the in-memory data
        console.log(users) ;
        displayData(users) ;
    } catch (error) {
        console.error('Error fetching data:', error);
        
    }
}

fetchData() ;

function displayData(users) {
    // Display data in the table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    users.slice(startIndex, endIndex).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" onchange="toggleRowSelection(${user.id})"></td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit" onclick="editRow(${user.id})">Edit</button>
                <button class="delete" onclick="deleteRow(${user.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    document.getElementById('editForm').style.display = 'none';
    // Add pagination logic here
    renderPagination(users.length);
}


function toggleRowSelection(id) {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
        selectedRows.push(id);
    } else {
        selectedRows.splice(index, 1);
    }
}

function search() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
 
    // Filter data based on search term
    const filteredData = users.filter(user =>
        Object.values(user).some(value => String(value).toLowerCase().includes(searchTerm))
    );

    // Display filtered data
    displayData(filteredData);
        
}

let editR ;

function editRow(userId) { 

        const userToEdit = users[userId-1];
        editR = userId ;

        document.getElementById('editName').value = userToEdit.name ;
        document.getElementById('editEmail').value = userToEdit.email ;
        document.getElementById('editRole').value = userToEdit.role ;
        
        // Populate the form with current row values
        document.getElementById('editForm').style.display = 'block' ; 
       
}

function saveEdit() { 
    
    console.log(editR) ;

    users[editR-1].name = document.getElementById('editName').value ;
    users[editR-1].email = document.getElementById('editEmail').value ;
    users[editR-1].role = document.getElementById('editRole').value ;

    document.getElementById('editForm').style.display = 'none';
    displayData(users) ;

}

function deleteRow(id) {
   
    const row = document.querySelector(`#table-body tr input[type="checkbox"][onchange="toggleRowSelection(${id})"]`);
    row.closest('tr').remove();
    // Reset selected rows
    selectedRows = [];
}

function deleteSelected() {
   
    selectedRows.forEach(id => {
        const row = document.querySelector(`#table-body tr input[type="checkbox"][onchange="toggleRowSelection(${id})"]`);
        row.closest('tr').remove();
    });
    // Reset selected rows
    selectedRows = [];
}

function renderPagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    // First and Previous buttons
    if (currentPage > 1) {
        paginationElement.innerHTML += `<button onclick="changePage(1)">First</button>`;
        paginationElement.innerHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += `<button ${i === currentPage ? 'disabled' : ''} onclick="changePage(${i})">${i}</button>`;
    }

    // Next and Last buttons
    if (currentPage < totalPages) {
        paginationElement.innerHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
        paginationElement.innerHTML += `<button onclick="changePage(${totalPages})">Last</button>`;
    }
}

function changePage(page) {
    currentPage = page;
    // Re-fetch data or update data based on the search term
    search();
}
