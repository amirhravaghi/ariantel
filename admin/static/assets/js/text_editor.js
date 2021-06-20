document.addEventListener("DOMContentLoaded", function(event) {
  // Text Editor
    var toolbarOptions = [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],

        ["image", "video" ,"link"],
    ];

    var quill = new Quill(".text-editor", {
        modules: {
            toolbar: toolbarOptions,
            table: true
        },
        placeholder: 'محتویات صفحه ...',
        theme: "snow",
    });
    const table = quill.getModule('table');
    quill.getModule("toolbar").addHandler("image", function (a) {
        selectLocalImage(quill);
    });
    //quill.getModule("toolbar").addHandler("video", function (a) {
//	videoHandler(quill);
  //  });

    var en_quill = new Quill(".en-text-editor", {
        modules: {
            toolbar: toolbarOptions,
        },
        placeholder: 'Content of the page ...',
        theme: "snow",
    });
    en_quill.getModule("toolbar").addHandler("image", function (a) {
        selectLocalImage(en_quill);
    });
});
