function selectLocalImage(editor) {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.onchange = () => {
        const file = input.files[0];
        saveToServer(editor, file);
    };
}

function saveToServer(editor, file) {
    const fd = new FormData();
    fd.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/admin/api/mediaUpload", true);
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.onload = () => {
        if (xhr.status === 200) {
            // this is callback data: url
            const res = JSON.parse(xhr.responseText);
            if (res.status) {
                insertToEditor(editor, res.url);
            }
        } else {
            console.log("Server error");
        }
    };
    xhr.send(fd);
}

function insertToEditor(editor, url) {
    // push image url to rich editor.
    const range = editor.getSelection();
    editor.insertEmbed(range.index, "image", `${url}`);
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const fd = new FormData();
        fd.append("image", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/admin/api/mediaUpload", true);
        // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.onload = () => {
            if (xhr.status === 200) {
                // this is callback data: url
                const res = JSON.parse(xhr.responseText);
                if (res.status) {
                    resolve(res.url);
                }
            } else {
                resolve(false);
            }
        };
        xhr.send(fd);
    });
}
