let customers = JSON.parse(localStorage.getItem('customers') || '[]');
const $ = id => document.getElementById(id);
const save = () => localStorage.setItem('customers', JSON.stringify(customers));

function render(){
  const q = $('search').value.toLowerCase();
  const rows = customers.filter(c => Object.values(c).join(' ').toLowerCase().includes(q));
  $('tbody').innerHTML = '';
  rows.forEach(c => {
    const tr = document.createElement('tr');
    [c.id, c.name, c.email, c.phone, c.address].forEach(v => {
      const td = document.createElement('td'); td.textContent = v; tr.appendChild(td);
    });
    const td = document.createElement('td');
    const edit = document.createElement('button'); edit.textContent = 'Edit';
    edit.onclick = () => startEdit(c.id);
    const del = document.createElement('button'); del.textContent = 'Delete'; del.className = 'del';
    del.onclick = () => { if (confirm('Delete ' + c.name + '?')) { customers = customers.filter(x => x.id !== c.id); save(); render(); } };
    td.append(edit, del); tr.appendChild(td);
    $('tbody').appendChild(tr);
  });
  $('empty').hidden = rows.length > 0;
}

function startEdit(id){
  const c = customers.find(x => x.id === id);
  $('editId').value = id; $('name').value = c.name; $('email').value = c.email;
  $('phone').value = c.phone; $('address').value = c.address;
  $('saveBtn').textContent = 'Save changes'; $('cancelBtn').hidden = false;
}

function reset(){
  $('customerForm').reset(); $('editId').value = '';
  $('saveBtn').textContent = 'Add customer'; $('cancelBtn').hidden = true;
}

$('customerForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = { name: $('name').value.trim(), email: $('email').value.trim(), phone: $('phone').value.trim(), address: $('address').value.trim() };
  const id = $('editId').value;
  if (id) {
    const c = customers.find(x => x.id === Number(id));
    Object.assign(c, data);
  } else {
    const nextId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customers.push({ id: nextId, ...data });
  }
  save(); reset(); render();
});
$('cancelBtn').onclick = reset;
$('search').oninput = render;
render();