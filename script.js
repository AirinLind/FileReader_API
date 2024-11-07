document.addEventListener("DOMContentLoaded", () => {
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("file-input");
  const fileList = document.getElementById("file-list");
  const filterTypeInput = document.getElementById("filter-type");
  const filterSizeInput = document.getElementById("filter-size");

  loadFiles();

  dropArea.addEventListener("dragover", (e) => e.preventDefault());
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

  filterTypeInput.addEventListener("input", renderFiles);
  filterSizeInput.addEventListener("input", renderFiles);

  function handleFiles(files) {
    Array.from(files).forEach((file) => saveFile(file));
    renderFiles();
  }

  function saveFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        content: e.target.result,
      };
      let files = JSON.parse(localStorage.getItem("files")) || [];
      files.push(fileData);
      localStorage.setItem("files", JSON.stringify(files));
    };
    reader.readAsDataURL(file);
  }

  function loadFiles() {
    renderFiles();
  }

  function renderFiles() {
    fileList.innerHTML = "";
    const files = JSON.parse(localStorage.getItem("files")) || [];
    const filteredFiles = files.filter((file) => {
      const typeMatch = filterTypeInput.value
        ? file.type.includes(filterTypeInput.value)
        : true;
      const sizeMatch = filterSizeInput.value
        ? file.size / 1024 <= filterSizeInput.value
        : true;
      return typeMatch && sizeMatch;
    });

    filteredFiles.forEach((file) => {
      const fileElement = document.createElement("div");
      fileElement.textContent = `Название: ${file.name}, Тип: ${
        file.type
      }, Размер: ${(file.size / 1024).toFixed(2)} КБ`;
      fileList.appendChild(fileElement);
    });
  }
});
