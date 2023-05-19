// example: "2023.02.14 12:45:98"
function dateToString(milliseconds) {
    const ms = Number(milliseconds);
    let d = new Date(ms);
    d = d.getFullYear() +
        '.' +
        ((1 + d.getMonth() < 10) ? '0' : '') + (1 + d.getMonth()) +
        '.' +
        ((d.getDate() < 10) ? '0' : '') + (d.getDate()) +
        ' ' +
        ((d.getHours()<10) ? '0' : '') + (d.getHours()) +
        ':' +
        ((d.getMinutes()<10) ? '0' : '') + (d.getMinutes()) +
        ':' +
        ((d.getSeconds()<10) ? '0' : '') + (d.getSeconds());
    return d;
}

function edit(id) {
    let textarea = document.getElementById('post-'+ id);
    textarea.disabled = false;
    let button = document.getElementById('post-'+ id + '-button-edit');
    button.hidden = true;
    button = document.getElementById('post-'+ id + '-button-save');
    button.hidden = false;
}
function save(id) {
    let form = document.getElementById('post-'+ id + '-update-form');
    form.submit();
}
