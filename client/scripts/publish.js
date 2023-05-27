function chooseFile() {
    let input = document.getElementById('input_file');
    let button = document.getElementById('button_file');
    input.click();
    input.addEventListener('change', (event) => {
        button.value = event.target.files[0].name;
    });
}
