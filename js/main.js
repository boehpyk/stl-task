    /*
        Initialize area for dropping files
     */
    let dropArea = document.getElementById('drop-area');

    let gallery = document.getElementById('gallery'); // initialize area for uploaded files

    /*
        Drag and drop events
     */
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    /*
        Handling dropped files
     */
    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        files.forEach(previewFile);
    }


    /*
        Function that shows uploaaded models
     */
    function previewFile(file) {
        let stl = document.createElement('div'); // container for uploaded model

        let info = document.createElement('div'); // block with model information
        info.className = 'info';

        let container = document.createElement('div'); // container for model canvas
        container.className = 'container';

        let img = document.createElement('img'); // loading animation (i used simple GIF)
        img.src = '/loading.gif';


        container.appendChild(img);
        stl.appendChild(container);
        stl.appendChild(info);
        gallery.appendChild(stl);



        /*
            Use of STLViewer library to show model and retrieve model information
         */
        const stl_viewer = new StlViewer (
            container, {
                ready_callback: function () {
                    this.add_model({
                        local_file: file // load model from local file
                    });
                },
                model_loaded_callback: function(model_id) {

                    img.className = 'hidden'; // hide loading animation
                    dropArea.className = 'hidden'; // hide drop area

                    const volume = this.get_model_info(model_id).volume; // get volume information
                    const filename = this.get_model_info(model_id).name; // get filename
                    const mesh = this.get_model_mesh(model_id);
                    const sizes = new THREE.Box3().setFromObject( mesh ).getSize(); // get size of model (using THREE library)

                    /*
                        show model information
                     */
                    info.innerHTML = `<p><b>Filename:</b> ${filename}</p><p><b>Volume:</b> ${volume.toFixed(2)}</p><p><b>Sizes: </b><br /><ul><li><b>width:</b> ${sizes.x.toFixed(2)}</li><li><b>length:</b> ${sizes.y.toFixed(2)}</li><li><b>height:</b> ${sizes.z.toFixed(2)}</li></ul></p>`;

                    document.getElementById('reload').classList.remove('hidden'); // show reload button for new uploads
                },
            }
        );

    }



    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }
